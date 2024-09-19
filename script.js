const map = L.map('map').setView([17.479928716897028,  78.42762605195722], 18);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


const vehicleIcon = L.icon({
  iconUrl: 'https://img.icons8.com/ios-filled/50/000000/car.png', 
  iconSize: [32, 32],
});


let vehicleMarker; 
let pathCoordinates = [];
let currentIndex = 0;
let locations = [];


fetch('locations.json')
  .then(response => response.json())
  .then(data => {
    locations = data;
    startTracking();
  })
  .catch(error => console.error('Error loading location data:', error));


function startTracking() {
  
  vehicleMarker = L.marker([locations[0].latitude, locations[0].longitude], { icon: vehicleIcon }).addTo(map);

  
  setInterval(() => updateVehiclePosition(), 2000); 
}


function generateTimestamp(index) {
  const currentTime = new Date();
  currentTime.setSeconds(currentTime.getSeconds() + index * 2); 
  return currentTime.toISOString();
}


function updateVehiclePosition() {
  if (currentIndex < locations.length) {
    
    const nextLocation = locations[currentIndex];
    const newLatLng = [nextLocation.latitude, nextLocation.longitude];

   
    vehicleMarker.setLatLng(newLatLng);

    
    pathCoordinates.push(newLatLng);

   
    L.polyline(pathCoordinates, { color: 'red' }).addTo(map);

   
    map.setView(newLatLng);

   
    const timestamp = generateTimestamp(currentIndex);
    console.log("Vehicle is at:", newLatLng, "Timestamp:", timestamp);

   
    currentIndex++;
  }
}
