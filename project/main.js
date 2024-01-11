'use strict';

let currentPage = 1;
const recordsPerPage = 10;
let nameRoute = '';
let selectedRouteId = null;

async function loadRoute() {
    const apiUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes';
    const apiKey = '2f188709-6fab-4094-947d-730dd80ebecc';
    const url = `${apiUrl}?api_key=${apiKey}`;

    try {
        const response = await fetch(url, { method: 'GET' });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        renderTableWalking(data);
        splitSelectLandmark(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}


function renderTableWalking(data) {
    const tbody = document.getElementById('routesTableBody');
    tbody.innerHTML = '';

    const currentPageData = data.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

    currentPageData.forEach(route => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${route.name}</td>
            <td>${route.description}</td>
            <td>${route.mainObject}</td>
            <td>
                <button class="btn btn-success" onclick="handleRouteSelection(${route.id}, this.parentNode.parentNode)">
                    Выбрать маршрут
                </button>
            </td>
        `;

        tbody.appendChild(row);

        if (route.id === selectedRouteId) {
            row.classList.add('selected-route');
        }
    });

    renderPaginationControls(data.length);
}


function renderPaginationControls(totalRecords) {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = '';

    const paginationList = document.createElement('ul');
    paginationList.classList.add('pagination');

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        pageItem.classList.add('page-item');

        const pageLink = document.createElement('a');
        pageLink.classList.add('page-link');
        pageLink.textContent = i;
        pageLink.onclick = function() {
            currentPage = i;
            loadRoute();
        };

        pageItem.appendChild(pageLink);
        paginationList.appendChild(pageItem);
    }

    paginationContainer.appendChild(paginationList);
}
window.onload = function () {
    windowload();
}
function windowload(){
    loadRoute();
}

document.addEventListener('DOMContentLoaded', async function () {
    const apiKey = '303bb3a5-1ede-4545-b449-4f904e790f77';

    if (typeof mapgl !== 'undefined') {
        let map = new mapgl.Map('map', {
            key: apiKey,
            center: [37.36, 55.45],
            zoom: 7,
        });

        document.getElementById('addressForm').addEventListener('submit', async function (event) {
            event.preventDefault();

            const address = document.getElementById('addressInput').value;
            const url = new URL('https://catalog.api.2gis.com/3.0/items/geocode');
            url.searchParams.append('q', address);
            url.searchParams.append('fields', 'items.point');
            url.searchParams.append('key', apiKey);
            console.log(url);

            try {
                const response = await fetch(url);
                const data = await response.json();
                const coordinates = data.result.items[0].point;
                console.log(coordinates);
                const marker = new mapgl.Marker(map, {
                    coordinates: [coordinates.lon, coordinates.lat],
                    label: {
                        text: 'Вы здесь',
                        offset: [0, -75],
                        image: {
                            url: 'https://docs.2gis.com/img/mapgl/tooltip.svg',
                            size: [100, 40],
                            padding: [10, 10, 20, 10],
                        },
                    },
                });
            } catch (error) {
                console.error('Geocoding error:', error);
            }
        });
    } else {
        console.error('mapgl library is not loaded.');
    }
});
