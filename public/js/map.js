var mymap;

$(document).ready(function () {
    var ws = new WebSocket("ws://localhost:3000/echo");   

	mymap = L.map('mapid').setView([51.9830926, 6.0033324], 8);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		id: 'mapbox.streets'
	}).addTo(mymap);

    ws.onmessage = function (event) {
        data = JSON.parse(event.data);

        var marker = L.marker([data.Lat, data.Lon]).addTo(mymap);
       
        setTimeout(function() {
            mymap.removeLayer(marker)
        }, 30000);
    }
});






