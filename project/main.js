let routesData = [];
let selectedRoute = null;
let page = 1;
const recordsPerPage = 10;

async function loadRoutes() {
    try {
        const apiKey = '2f188709-6fab-4094-947d-730dd80ebecc';
        const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/api/routes?api_key=${apiKey}`, { method: 'GET' });

        if (!response.ok) {
            throw new Error('No response');
        }

        routesData = await response.json();
        renderTable(routesData);
        renderPagination(routesData.length);

        const landmarkSelect = document.getElementById('searchLandmark');
        const landmarks = [...new Set(routesData.map(route => route.mainObject))];

        landmarks.forEach(landmark => {
            const option = document.createElement('option');
            option.value = landmark.toLowerCase();
            option.textContent = landmark;
            landmarkSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Fetch operation error:', error);
        updateNotification('Ошибка загрузки данных. Пожалуйста, попробуйте еще раз.');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const map = new mapgl.Map('map', { key: '', center: [37.6176, 55.7558], zoom: 15 });

    // Load routes and landmarks
    await loadRoutes();

    document.getElementById('searchForm').addEventListener('submit', (event) => {
        event.preventDefault();
        searchRoutes();
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

function searchRoutes() {
    const searchRouteInput = document.getElementById('searchRoute');
    const searchLandmarkSelect = document.getElementById('searchLandmark');

    const searchRoute = searchRouteInput.value.toLowerCase();
    const searchLandmark = searchLandmarkSelect.value.toLowerCase();

    const filteredRoutes = routesData.filter(route => {
        const routeName = route.name.toLowerCase();
        const routeLandmark = route.mainObject.toLowerCase();

        return routeName.includes(searchRoute) && (searchLandmark === '' || routeLandmark === searchLandmark);
    });

    renderTable(filteredRoutes);
    renderPagination(filteredRoutes.length);
}

DG.then(function () {
    var map = DG.map('map', {
        center: [55.7558, 37.6176],
        zoom: 13
    });
});


function handleSelection(routeId, row) {

    cancelSelection();


    selectedRoute = routeId;


    const selectedRow = document.querySelector(`.selected-route`);
    if (selectedRow) {
        selectedRow.classList.remove('selected-route');
    }
    row.classList.add('selected-route');


    const selectButton = row.querySelector('.btn-success');
    if (selectButton) {
        selectButton.classList.remove('btn-success');
        selectButton.classList.add('btn-danger');
    }


}
