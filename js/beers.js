$(function() {
    var beers = [
          {title: '6767 S Clinton St, Englewood, CO 80112', location: {lat: 39.584111, lng: -104.878002}},
          {title: '1265 Sergeant Jon Stiles Dr, Highlands Ranch, CO 80129', location: {lat: 39.54986239999999, lng: -105.0049004}},
          {title: '11150 S Twenty Mile Rd, Parker, CO 80134', location: {lat: 39.5132173, lng: -104.7730542}},
          {title: '3650 River Point Pkwy, Sheridan, CO 80110', location: {lat: 39.6501413, lng: -105.0056014}},
          {title: '7400 S Gartrell Rd, Aurora, CO 80016', location: {lat: 39.5812327, lng: -104.7220796}},
          {title: '16910 E Quincy Ave, Aurora, CO 80015', location: {lat: 39.6362171, lng: -104.7903463}}
        ];

    var viewModel = {
        query: ko.observable('')
    };

    viewModel.beers = ko.dependentObservable(function() {
        var search = this.query().toLowerCase();
        return ko.utils.arrayFilter(beers, function(beer) {
            return beer.title.toLowerCase().indexOf(search) >= 0;
        });
    }, viewModel);

    ko.applyBindings(viewModel);
});