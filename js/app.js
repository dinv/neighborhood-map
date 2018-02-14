function viewModel() {

    var self = this;
    this.searchOption = ko.observable("");
    this.markers = [];
    this.largeInfowindow = new google.maps.InfoWindow();
    this.map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 39.6006849, lng: -104.9491477},
                zoom: 12,
                mapTypeControl: false
                });
    this.locations = [
      {address: '6767 S Clinton St', city: 'Englewood 80112', location: {lat: 39.584111, lng: -104.878002}},
      {address: '1265 Sergeant Jon Stiles Dr', city: 'Highlands Ranch 80129', location: {lat: 39.54986239999999, lng: -105.0049004}},
      {address: '11150 S Twenty Mile Rd', city: 'Parker 80134', location: {lat: 39.5132173, lng: -104.7730542}},
      {address: '3650 River Point Pkwy', city: 'Sheridan 80110', location: {lat: 39.6501413, lng: -105.0056014}},
      {address: '7400 S Gartrell Rd', city: 'Aurora 80016', location: {lat: 39.5812327, lng: -104.7220796}},
      {address: '16910 E Quincy Ave', city: 'Aurora 80015', location: {lat: 39.6362171, lng: -104.7903463}}
    ];

    this.bounceAndOpenInfoWindow=function() {
      populateInfoWindow(this, largeInfowindow);
      if (this.getAnimation() !== null) {
        this.setAnimation(null);
      } else {
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
          this.setAnimation(null);
        }).bind(this), 1400);
      }
      var latLng = this.getPosition(); // returns LatLng object
      this.map.panTo(latLng); // setCenter takes a LatLng object
    }

    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    this.populateInfoWindow = function(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          // Clear the infowindow content to give the streetview time to load.
          infowindow.setContent('');
          infowindow.marker = marker;
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
          var streetViewService = new google.maps.StreetViewService();
          var radius = 50;
          // In case the status is OK, which means the pano was found, compute the
          // position of the streetview image, then calculate the heading, then get a
          // panorama from that and set the options
          function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
              var nearStreetViewLocation = data.location.latLng;
              var heading = google.maps.geometry.spherical.computeHeading(
                nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div>');
            } else {
                infowindow.setContent('<div>' + marker.title + '</div>');
            }
          }
          // Use streetview service to get the closest streetview image within
          // 50 meters of the markers position
          streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
          // Open the infowindow on the correct marker.
          infowindow.open(map, marker);
        }
    }

    this.initMap = function(){
        var map = this.map
        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < this.locations.length; i++) {
          // Get the position from the location array.
          var position = this.locations[i].location;
          var title = this.locations[i].address;
          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
          });
          // Push the marker to our array of markers.
          this.markers.push(marker);
          // Create an onclick event to open the large infowindow at each marker.
          marker.addListener('click', bounceAndOpenInfoWindow);
        }

        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
          this.markers[i].setMap(map);
          bounds.extend(this.markers[i].position);
        }
        map.fitBounds(bounds);


        $(window).resize(function () {
            var h = $(window).height()
                w = $(window).width()
            $('#map').css('height', h);
        }).resize();
    };

    this.initMap();

    this.locationsFilter = ko.computed(function() {
        var result = [];
        for (var i = 0; i < this.markers.length; i++) {
            var markerLocation = this.markers[i];
            if (markerLocation.title.toLowerCase().includes(this.searchOption()
                    .toLowerCase())) {
                result.push(markerLocation);
                this.markers[i].setVisible(true);
            } else {
                this.markers[i].setVisible(false);
            }
        }
        return result;
    }, this);

};

function startApp() {
   ko.applyBindings(viewModel); 
}  

