/*
frida: 16.0.10
project: lordfilmapp-mirror

id: 3afd31dd-3377-4cf3-95f2-520685c42200

С помощью этого скрипта вы можете поставить свое зеркало для hdrezka.ag
*/

// Как создать зеркало:
// https://vk.com/@hdrezka-instrukciya-dlya-polucheniya-vsegda-aktualnogo-zerkala-onlai
// Поддерживаемая версия приложения: 1

function init() {
    editHost("http://hdrezka.ag/"); // http:// only
}

function editHost(host) {
    Java.perform(() => {
        // Java.use();
    });
}

init();