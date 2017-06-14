//MApp.js

//In Knockout, create array of places in Maps format (check).
//Figure out how to annotate the markers with relevant information
//Search bar functionality on map markers. (check)



//Model:

var Pin = function Pin(map, name, position, text) {
  var marker;

  this.name = ko.observable(name);
  this.position = ko.observable(position);
  this.text = ko.observable(text);

  marker = new google.maps.Marker({
    position: position,//new google.maps.LatLng(lat, lon),
    animation: google.maps.Animation.DROP
  });

  this.isVisible = ko.observable(false);

  this.isVisible.subscribe(function(currentState) {
    if (currentState) {
      marker.setMap(map);
    } else {
      marker.setMap(null);
    }
  });

  this.isVisible(true);
};

var Filter = function(){

    self.query = ko.observable('');

     self.filterPins = ko.computed(function () {
            var search  = self.query().toLowerCase();

            return ko.utils.arrayFilter(koMarkers(), function (pin) {
                var doesMatch = pin.name().toLowerCase().indexOf(search) >= 0;

                pin.isVisible(doesMatch);

                return doesMatch;
            });
        });
};


var markers = [
     {
        name: "Our Apartment",
        position: {lat: 40.779345, lng: -73.980686},
        // lat: 40.779345,
        // long: -73.980686,
        map: map,
        text: ""
        },
     {
        name: "boxKite",
        position: {lat: 40.777625, lng: -73.980028},
        // lat: 40.777625,
        // long: -73.980028,
        map: map,
        text: ""
    },

    {
        name: "AMC Lincoln Center 13",
        position: {lat: 40.774975, lng: -73.981640},
        // lat: 40.774975,
        // long: -73.981640,
        map: map,
        text: ""
    }];

///Yelp Model
//the view will be something like foreach filterPins - search yelp keyword, display some yelp info and a URL. (just tack on yelp URL and rating? snippet?)
///SteetView Model
// implement labels on markers


function viewModel() {

    self.koMarkers=ko.observableArray([]);

   
      this.initMap = function () {
        var myApt = {lat: 40.779345, lng: -73.980686};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: myApt
        });


        for (var x = 0; x < markers.length; x++){
            var pin = new Pin(map, markers[x].name, markers[x].position, markers[x].text); 
            self.koMarkers.push(pin);
        } ;  
      }

        
   this.initMap();
  Filter();

  //Add labels from Google Maps API

      };
ko.applyBindings(new viewModel());

