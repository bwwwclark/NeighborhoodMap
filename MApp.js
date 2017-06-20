//MApp.js

//In Knockout, create array of places in Maps format (check).
//Figure out how to annotate the markers with relevant information
//Search bar functionality on map markers. (check)



//Model:

var $wikiElem = $('#wikipedia-links');
function loadData(){

var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=New York&format=json&callback=wikiCallback';
var wikiRequestTimeout = setTimeout(function(){
    $wikiElem.text("failed to get wikiepedia resources");
}, 8000);

$.ajax({
    url: wikiUrl,
    dataType: "jsonp",
    jsonp: "callback",
    success: function( response ) {
        var articleList = response[1];
        console.log(response);

    for (var i = 0; i < articleList.length; i++){
        articleStr = articleList[i];
        console.log(articleStr);
        var url = 'http://en.wikipedia.org/wiki/' + articleStr;
        $wikiElem.append('<li><a href="' + url + '">'+ articleStr +'</a></li>');
    };
    clearTimeout(wikiRequestTimeout);
    }
});
return false
};

var Pin = function Pin(map, name, position, text, streetview) {
  var marker;

  this.name = ko.observable(name);
  this.position = ko.observable(position);
  this.text = ko.observable(text);
  this.streetView = ko.observable(streetview);
  //this.text = text;

  infowindow = new google.maps.InfoWindow({
    content: name
  });



  marker = new google.maps.Marker({
    position: position,//new google.maps.LatLng(lat, lon),
    animation: google.maps.Animation.DROP,
    title: name

  });

 

  marker.addListener('click', function() {
    infowindow.setContent(name);
    infowindow.open(map, marker);
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
  console.log(name)

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
        lat: 40.779345,
        long: -73.980686,
        streetView: "https://maps.googleapis.com/maps/api/streetview?size=300x200&location=40.779345,-73.980686&heading=1&pitch=-0.75&scale=2&key=AIzaSyATolub07wwdNH-A_gYvcjBVB9W7m_ovdM",
        map: map,
        text: "is a large Apartment "
        },
     {
        name: "boxKite",
        position: {lat: 40.777625, lng: -73.980028},
        lat: 40.777625,
        long: -73.980028,
        streetView: "https://maps.googleapis.com/maps/api/streetview?size=300x200&location=40.777625,-73.980028&heading=1&pitch=-0.75&&scale=1key=AIzaSyATolub07wwdNH-A_gYvcjBVB9W7m_ovdM",
        map: map,
        text: ""
    },

    {
        name: "AMC Lincoln Center 13",
        position: {lat: 40.774975, lng: -73.981640},
        lat: 40.774975,
        long: -73.981640,
        streetView: "https://maps.googleapis.com/maps/api/streetview?size=300x200&location=40.774975,-73.981640&heading=1&pitch=-0.75&key=AIzaSyATolub07wwdNH-A_gYvcjBVB9W7m_ovdM",
        map: map,
        text: "abbbbbbb qqq"
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
            var pin = new Pin(map, markers[x].name, markers[x].position, markers[x].text, markers[x].streetView); 
            self.koMarkers.push(pin);
        } ;  
      }

        
   this.initMap();
  Filter();

  //Add labels from Google Maps API

      };
ko.applyBindings(new viewModel());
loadData();
