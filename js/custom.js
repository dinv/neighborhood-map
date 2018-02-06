$(function () {

    function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 40.74135, lng: -73.99802},
            zoom: 14
            });

        // Create a single latLng literal object.
        var singleLatLng = {lat: 40.74135, lng: -73.99802};
        // TODO: Create a single marker appearing on initialize -
        // Create it with the position of the singleLatLng,
        // on the map, and give it your own title!

        var marker = new google.maps.Marker({
            position: singleLatLng,
            title: 'this is a test',
            map: map,
            animation: google.maps.Animation.DROP,
        });

        // TODO: create a single infowindow, with your own content.
        // It must appear on the marker
        var infowindow = new google.maps.InfoWindow({
        content: singleLatLng.lat + ", " + singleLatLng.lng
        });

        // TODO: create an EVENT LISTENER so that the infowindow opens when
        // the marker is clicked!
        marker.addListener('click', function(){
            infowindow.open(map, marker)
        });

        $(window).resize(function () {
            var h = $(window).height()
                w = $(window).width()
                s_w = $('#sidebar-wrapper').width()
                offsetTop = 80, // Calculate the top offset
            $('#map').css('height', (h - offsetTop));
            $('#page-content-wrapper').css('width', (w-s_w));
        }).resize();

    }

    google.maps.event.addDomListener(window, 'load', initMap);
});