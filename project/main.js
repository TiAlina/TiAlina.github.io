"use strict";

function loadData() {
    let url = new URL('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=2f188709-6fab-4094-947d-730dd80ebecc');
    //url.searchParams.set('id', 1);

    let xhr = new XMLHttpRequest();
    //xhr.open('GET', "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=2f188709-6fab-4094-947d-730dd80ebecc");
    xhr.open('GET', url)
    xhr.onload = () => {
        let data = xhr.response;
        data = JSON.parse(data)
        console.log(data);
    };

    xhr.send();
}

loadData();
