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
      {address: '6767 S Clinton St', location: {lat: 39.584111, lng: -104.878002}},
      {address: '1265 Sergeant Jon Stiles Dr', location: {lat: 39.54986239999999, lng: -105.0049004}},
      {address: '11150 S Twenty Mile Rd', location: {lat: 39.5132173, lng: -104.7730542}},
      {address: '3650 River Point Pkwy', location: {lat: 39.6501413, lng: -105.0056014}},
      {address: '7400 S Gartrell Rd', location: {lat: 39.5812327, lng: -104.7220796}},
      {address: '16910 E Quincy Ave', location: {lat: 39.6362171, lng: -104.7903463}}
    ];

    this.recenter = function(){
        var panListener = google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) {
                        map.panBy(-250,0);
                    });
       
 setTimeout(function() {
            google.maps.event.removeListener(panListener)
        }, 2000);  
    }

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

          // Foursquare API Client
          clientID = "20HQ13ZT0S11J2B1KHHHA0B3YXFVMYXY0SFIW2YQISJJE4GK";
          clientSecret =
              "0VRLQVEXMXDYT2XUHPN5WPC2EXHOOQ3VKNS2W55FSOCEYTFJ";

          // URL for Foursquare API
          var apiUrl = 'https://api.foursquare.com/v2/venues/search?ll=' +
              marker.position.lat() + ',' + marker.position.lng() + '&client_id=' + clientID +
              '&client_secret=' + clientSecret + '&query=target&v=20170708' + '&m=foursquare';

          // Foursquare API
          var HTMLContent = ''
          $.getJSON(apiUrl).done(function(marker) {
              var response = marker.response.venues[0];
              for (var i = 0; i < response.location.formattedAddress.length; i++){
                HTMLContent += response.location.formattedAddress[i]
                HTMLContent += '<br>'
              }
              infowindow.setContent('<div>' + HTMLContent + '</div>');
          }).fail(function() {
              infowindow.setContent('<div> Uh oh!  There was an error reaching the Foursquare API :(<div>')

          });

          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });

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

googleError = function googleError() {
    $('#myGoogleError').text("Uh oh!  The Google Maps API could not be loaded :(");
};

function startApp() {
   ko.applyBindings(viewModel); 
}  

