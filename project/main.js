const apiKey = '2f188709-6fab-4094-947d-730dd80ebecc';
let currentPage = 1;
const recordsPerPage = 10;
let selectedRouteId = null;

async function loadRoutes() {
    const apiUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes';
    const url = `${apiUrl}?api_key=${apiKey}`;

    try {
        const response = await fetch(url, { method: 'GET' });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const routesData = await response.json();
        renderTable(routesData);
        renderPagination(routesData.length);
    } catch (error) {
        console.error('Fetch operation error:', error);
        updateNotification('Ошибка загрузки данных. Пожалуйста, попробуйте еще раз.');
    }
}

function updateNotification(message) {
    const notificationElement = document.getElementById('notification');
    notificationElement.textContent = message;
    notificationElement.classList.remove('alert-success');
    notificationElement.classList.add('alert-danger');
}

function renderTable(data) {
    const tbody = document.getElementById('routesTableBody');
    tbody.innerHTML = '';

    const currentPageData = data.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

    currentPageData.forEach(route => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${route.name}</td>
            <td>${route.description}</td>
            <td>${route.mainObject}</td>
            <td><button class="btn btn-success" onclick="handleSelection(${route.id}, this.parentNode.parentNode)">Select Route</button></td>
        `;

        if (route.id === selectedRouteId) {
            row.classList.add('selected-route');
        }

        tbody.appendChild(row);
    });
}



function renderPagination(totalRecords) {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = '';

    const paginationList = document.createElement('ul');
    paginationList.className = 'pagination';

    Array.from({ length: totalPages }, (_, i) => {
        const pageItem = document.createElement('li');
        pageItem.className = 'page-item';

        const pageLink = document.createElement('a');
        pageLink.className = 'page-link';
        pageLink.textContent = i + 1;
        pageLink.onclick = () => { currentPage = i + 1; loadRoutes(); };

        pageItem.appendChild(pageLink);
        paginationList.appendChild(pageItem);
    });

    paginationContainer.appendChild(paginationList);
}



window.onload = function () {
    loadRoutes();
}

document.addEventListener('DOMContentLoaded', async () => {
    const mapKey = '303bb3a5-1ede-4545-b449-4f904e790f77';
    const map = new mapgl.Map('map', { key: mapKey, center: [37.6176, 55.7558], zoom: 15 });

    document.getElementById('locationForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const address = document.getElementById('locationInput').value;

        try {
            const response = await fetch(`https://catalog.api.2gis.com/3.0/items/geocode?q=${address}&fields=items.point&key=${mapKey}`);
            const { result: { items: [{ point }] } } = await response.json();

            new mapgl.Marker(map, { coordinates: [point.lon, point.lat] });
        } catch (error) {
            console.error('Geocoding error:', error);
        }
    });
});

function handleSelection(routeId, row) {
    selectedRouteId = routeId;
    loadRoutes();
}
