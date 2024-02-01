#include "frida-core.h"

#include <pwd.h>
#include <string.h>
#include <unistd.h>

typedef struct _FridaEnumerateProcessesOperation FridaEnumerateProcessesOperation;

struct _FridaEnumerateProcessesOperation
{
  FridaScope scope;
  GArray * result;
};

static void frida_collect_process_info (guint pid, FridaEnumerateProcessesOperation * op);
static gboolean frida_add_process_metadata (GHashTable * parameters, const gchar * proc_entry_name);
static GDateTime * frida_query_boot_time (void);
static GVariant * frida_uid_to_name (uid_t uid);

void
frida_system_get_frontmost_application (FridaFrontmostQueryOptions * options, FridaHostApplicationInfo * result, GError ** error)
{
  g_set_error (error,
      FRIDA_ERROR,
      FRIDA_ERROR_NOT_SUPPORTED,
      "Not implemented");
}

FridaHostApplicationInfo *
frida_system_enumerate_applications (FridaApplicationQueryOptions * options, int * result_length)
{
  *result_length = 0;

  return NULL;
}

FridaHostProcessInfo *
frida_system_enumerate_processes (FridaProcessQueryOptions * options, int * result_length)
{
  FridaEnumerateProcessesOperation op;

  op.scope = frida_process_query_options_get_scope (options);
  op.result = g_array_new (FALSE, FALSE, sizeof (FridaHostProcessInfo));

  if (frida_process_query_options_has_selected_pids (options))
  {
    frida_process_query_options_enumerate_selected_pids (options, (GFunc) frida_collect_process_info, &op);
  }
  else
  {
    GDir * proc_dir;
    const gchar * proc_name;

    proc_dir = g_dir_open ("/proc", 0, NULL);

    while ((proc_name = g_dir_read_name (proc_dir)) != NULL)
    {
      guint pid;
      gchar * end;

      pid = strtoul (proc_name, &end, 10);
      if (*end == '\0')
        frida_collect_process_info (pid, &op);
    }

    g_dir_close (proc_dir);
  }

  *result_length = op.result->len;

  return (FridaHostProcessInfo *) g_array_free (op.result, FALSE);
}

static void
frida_collect_process_info (guint pid, FridaEnumerateProcessesOperation * op)
{
  FridaHostProcessInfo info = { 0, };
  gboolean still_alive = TRUE;
  gchar * proc_name = NULL;
  gchar * exe_path = NULL;
  gboolean is_userland;
  gchar * program_path = NULL;
  gchar * cmdline_path = NULL;
  gchar * cmdline_data = NULL;
  gchar * name = NULL;

  proc_name = g_strdup_printf ("%u", pid);

  exe_path = g_build_filename ("/proc", proc_name, "exe", NULL);

  is_userland = g_file_test (exe_path, G_FILE_TEST_EXISTS);
  if (!is_userland)
    goto beach;

  program_path = g_file_read_link (exe_path, NULL);

  cmdline_path = g_build_filename ("/proc", proc_name, "cmdline", NULL);

  g_file_get_contents (cmdline_path, &cmdline_data, NULL, NULL);
  if (cmdline_data == NULL)
    goto beach;

  if (g_str_has_prefix (cmdline_data, "/proc/"))
  {
    name = g_path_get_basename (program_path);
  }
  else
  {
    gchar * space_dash;

    space_dash = strstr (cmdline_data, " -");
    if (space_dash != NULL)
      *space_dash = '\0';

    name = g_path_get_basename (cmdline_data);
  }

  info.pid = pid;
  info.name = g_steal_pointer (&name);

  info.parameters = frida_make_parameters_dict ();

  if (op->scope != FRIDA_SCOPE_MINIMAL)
  {
    g_hash_table_insert (info.parameters, g_strdup ("path"),
        g_variant_ref_sink (g_variant_new_take_string (g_steal_pointer (&program_path))));

    still_alive = frida_add_process_metadata (info.parameters, proc_name);
  }

  if (still_alive)
    g_array_append_val (op->result, info);
  else
    frida_host_process_info_destroy (&info);

beach:
  g_free (name);
  g_free (cmdline_data);
  g_free (cmdline_path);
  g_free (program_path);
  g_free (exe_path);
  g_free (proc_name);
}

void
frida_system_kill (guint pid)
{
  kill (pid, SIGKILL);
}

gchar *
frida_temporary_directory_get_system_tmp (void)
{
#ifdef HAVE_ANDROID
  if (getuid () == 0)
    return g_strdup ("/data/local/tmp");
#endif

  return g_strdup (g_get_tmp_dir ());
}

static gboolean
frida_add_process_metadata (GHashTable * parameters, const gchar * proc_entry_name)
{
  gboolean success = FALSE;
  gchar * status_path = NULL;
  gchar * status_data = NULL;
  gchar ** status_lines = NULL;
  gchar ** cursor;
  gchar * stat_path = NULL;
  gchar * stat_data = NULL;
  int ppid;
  guint64 start_time_delta_in_jiffies;
  static gsize caches_initialized = 0;
  static GDateTime * boot_time = NULL;
  static long usec_per_jiffy = 0;
  GDateTime * started;

  status_path = g_build_filename ("/proc", proc_entry_name, "status", NULL);
  if (!g_file_get_contents (status_path, &status_data, NULL, NULL))
    goto beach;

  status_lines = g_strsplit (status_data, "\n", 0);
  for (cursor = status_lines; *cursor != NULL; cursor++)
  {
    const gchar * line = *cursor;

    if (g_str_has_prefix (line, "Uid:"))
    {
      uid_t uid;

      sscanf (line + 4, "%*u %u %*u %*u", &uid);

      g_hash_table_insert (parameters, g_strdup ("user"), frida_uid_to_name (uid));

      break;
    }
  }

  stat_path = g_build_filename ("/proc", proc_entry_name, "stat", NULL);
  if (!g_file_get_contents (stat_path, &stat_data, NULL, NULL))
    goto beach;

  sscanf (stat_data,
      "%*d "                       /* ( 1) pid         */
      "(%*[^)]) "                  /* ( 2) comm        */
      "%*c "                       /* ( 3) state       */
      "%d "                        /* ( 4) ppid        */
      "%*d "                       /* ( 5) pgrp        */
      "%*d "                       /* ( 6) session     */
      "%*d "                       /* ( 7) tty_nr      */
      "%*d "                       /* ( 8) tpgid       */
      "%*u "                       /* ( 9) flags       */
      "%*u "                       /* (10) minflt      */
      "%*u "                       /* (11) cminflt     */
      "%*u "                       /* (12) majflt      */
      "%*u "                       /* (13) cmajflt     */
      "%*u "                       /* (14) utime       */
      "%*u "                       /* (15) stime       */
      "%*d "                       /* (16) cutime      */
      "%*d "                       /* (17) cstime      */
      "%*d "                       /* (18) priority    */
      "%*d "                       /* (19) nice        */
      "%*d "                       /* (20) num_threads */
      "%*d "                       /* (21) itrealvalue */
      "%" G_GINT64_MODIFIER "u ",  /* (22) starttime   */
      &ppid,
      &start_time_delta_in_jiffies);

  g_hash_table_insert (parameters, g_strdup ("ppid"), g_variant_ref_sink (g_variant_new_int64 (ppid)));

  if (g_once_init_enter (&caches_initialized))
  {
    boot_time = frida_query_boot_time ();
    usec_per_jiffy = G_USEC_PER_SEC / sysconf (_SC_CLK_TCK);

    g_once_init_leave (&caches_initialized, TRUE);
  }

  started = g_date_time_add (boot_time, start_time_delta_in_jiffies * usec_per_jiffy);
  g_hash_table_insert (parameters, g_strdup ("started"),
      g_variant_ref_sink (g_variant_new_take_string (g_date_time_format_iso8601 (started))));
  g_date_time_unref (started);

  success = TRUE;

beach:
  g_free (stat_data);
  g_free (stat_path);
  g_strfreev (status_lines);
  g_free (status_data);
  g_free (status_path);

  return success;
}

static GDateTime *
frida_query_boot_time (void)
{
  GDateTime * boot_time = NULL;
  gchar * data = NULL;
  gchar ** lines, ** cursor;

  g_file_get_contents ("/proc/stat", &data, NULL, NULL);
  g_assert (data != NULL);

  lines = g_strsplit (data, "\n", 0);

  for (cursor = lines; *cursor != NULL; cursor++)
  {
    const gchar * line = *cursor;

    if (g_str_has_prefix (line, "btime "))
    {
      gint64 unix_utc_time;

      g_ascii_string_to_signed (line + 6, 10, G_MININT64, G_MAXINT64, &unix_utc_time, NULL);

      boot_time = g_date_time_new_from_unix_utc (unix_utc_time);

      break;
    }
  }
  g_assert (boot_time != NULL);

  g_strfreev (lines);
  g_free (data);

  return boot_time;
}

static GVariant *
frida_uid_to_name (uid_t uid)
{
  GVariant * name;
  static size_t buffer_size = 0;
  char * buffer;
  struct passwd pwd, * entry;

  if (buffer_size == 0)
    buffer_size = sysconf (_SC_GETPW_R_SIZE_MAX);

  buffer = g_malloc (buffer_size);

  entry = NULL;
  getpwuid_r (uid, &pwd, buffer, buffer_size, &entry);

  if (entry != NULL)
    name = g_variant_new_string (entry->pw_name);
  else
    name = g_variant_new_take_string (g_strdup_printf ("%u", uid));
  name = g_variant_ref_sink (name);

  g_free (buffer);

  return name;
}
