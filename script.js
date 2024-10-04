// script.js
const map = L.map('map').setView([-23.5505, -46.6333], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

const tableBody = document.getElementById('userTable').getElementsByTagName('tbody')[0];

document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const newRow = tableBody.insertRow();
        newRow.insertCell(0).textContent = name;
        newRow.insertCell(1).textContent = email;
        newRow.insertCell(2).textContent = `Lat: ${lat}, Lon: ${lon}`;

        const marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup(`<b>${name}</b><br>${email}`).openPopup();
    });
});

//server.js
const socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => {
    console.log('Conectado ao servidor WebSocket');
};

socket.onmessage = event => {
    const user = JSON.parse(event.data);
    addUserToTable(user);
    addUserToMap(user);
};

document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const user = { name, email, lat, lon };
        socket.send(JSON.stringify(user));
    });
});

function addUserToTable(user) {
    const newRow = tableBody.insertRow();
    newRow.insertCell(0).textContent = user.name;
    newRow.insertCell(1).textContent = user.email;
    newRow.insertCell(2).textContent = `Lat: ${user.lat}, Lon: ${user.lon}`;
}

function addUserToMap(user) {
    const marker = L.marker([user.lat, user.lon]).addTo(map);
    marker.bindPopup(`<b>${user.name}</b><br>${user.email}`).openPopup();
}

