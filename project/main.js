const apiKey = '2f188709-6fab-4094-947d-730dd80ebecc';
let page = 1;
const recordsPerPage = 10;
let selectedRoute = null;

window.onload = function () {
    loadRoutes();
}

async function loadRoutes() {
    try {
        const response = await fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=${apiKey}`, { method: 'GET' });
        if (!response.ok) {
            throw new Error('No response');
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
    document.getElementById('notification').textContent = message;
    document.getElementById('notification').classList.remove('alert-success');
    document.getElementById('notification').classList.add('alert-danger');
}


document.addEventListener('DOMContentLoaded', async () => {
    const map = new mapgl.Map('map', { key: '', center: [37.6176, 55.7558], zoom: 15 });

    document.getElementById('locationForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const address = document.getElementById('locationInput').value;

        try {
            const response = await fetch(`https://catalog.api.2gis.com/3.0/items/geocode?q=${address}&fields=items.point&key=${map.key}`);
            const { result: { items: [{ point }] } } = await response.json();

            new mapgl.Marker(map, { coordinates: [point.lon, point.lat] });
        } catch (error) {
            console.error('Geocoding error:', error);
        }
    });
});

function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    const pdata = data.slice((page - 1) * recordsPerPage, page * recordsPerPage);

    pdata.forEach(route => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${route.name}</td>
            <td>${route.description}</td>
            <td>${route.mainObject}</td>
            <td><button class="btn btn-success" onclick="handleSelection(${route.id}, this.parentNode.parentNode)">Select Route</button></td>
        `;

        if (route.id === selectedRoute) {
            row.classList.add('selected-route');
        }

        tbody.appendChild(row);
    });
}

function renderPagination(totalRecords) {
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.replaceChildren(createPaginationList(totalRecords));
}

function createPaginationList(totalRecords) {
    const paginationList = document.createElement('ul');
    paginationList.className = 'pagination';

    Array.from({ length: Math.ceil(totalRecords / recordsPerPage) }, (_, i) => {
        const pageItem = paginationList.appendChild(document.createElement('li'));
        pageItem.className = 'page-item';

        const pageLink = pageItem.appendChild(document.createElement('a'));
        pageLink.className = 'page-link';
        pageLink.textContent = i + 1;
        pageLink.onclick = () => { page = i + 1; loadRoutes(); };
    });

    return paginationList;
}


function setPageAndLoadRoutes(selectedPage) {
    page = selectedPage;
    loadRoutes();
}

