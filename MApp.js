//MApp.js


//Model:
//Data Model:
var markers = [{
        name: "Our Apartment",
        position: {
            lat: 40.779345,
            lng: -73.980686
        },
        lat: 40.779345,
        long: -73.980686,
        streetView: "https://maps.googleapis.com/maps/api/streetview?size=400x300&location=40.779345,-73.980686&heading=1&pitch=-0.75&scale=2&key=AIzaSyATolub07wwdNH-A_gYvcjBVB9W7m_ovdM",
        map: map,
        link: "",
        text: "is a large Apartment "
    },
    {
        name: "BoxKite",
        position: {
            lat: 40.777625,
            lng: -73.980028
        },
        lat: 40.777625,
        long: -73.980028,
        streetView: "https://maps.googleapis.com/maps/api/streetview?size=400x300&location=40.777625,-73.980028&heading=1&pitch=-0.75&&scale=1key=AIzaSyATolub07wwdNH-A_gYvcjBVB9W7m_ovdM",
        map: map,
        link: "https://www.yelp.com/biz/box-kite-coffee-new-york-4",
        text: "Our favorite coffee shop"
    },

    {
        name: "AMC Lincoln Center 13",
        position: {
            lat: 40.774975,
            lng: -73.981640
        },
        lat: 40.774975,
        long: -73.981640,
        streetView: "https://maps.googleapis.com/maps/api/streetview?size=400x300&location=40.774975,-73.981640&heading=1&pitch=-0.75&key=AIzaSyATolub07wwdNH-A_gYvcjBVB9W7m_ovdM",
        map: map,
        link: "https://www.amctheatres.com/movie-theatres/new-york-city/amc-loews-lincoln-square-13",
        text: "Our favorite movie theater within walking distance"
    }
];

///Wikipedia API Model
var $wikiElem = $('#wikipedia-links');

function loadData() {

    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=New York&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("failed to get wikiepedia resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        jsonp: "callback",
        success: function(response) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }
    });
    return false
};

//Pin Model

var Pin = function Pin(map, name, position, text, streetview, link) {
    var marker;
    var content = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h4 id="firstHeading" class="firstHeading">' + name + '</h1>' +
        '<div id="bodyContent">' +
        '<p><b><a href="' + link + '"> ' + name + ' </a></b></p><p> ' + text + '</p>' +
        '</div>' +
        '</div>';
    this.name = ko.observable(name);
    this.position = ko.observable(position);
    this.text = ko.observable(text);
    this.streetView = ko.observable(streetview);
    this.link = ko.observable(link);

    infowindow = new google.maps.InfoWindow({
        content: name
    });

    marker = new google.maps.Marker({
        position: position, //new google.maps.LatLng(lat, lon),
        animation: google.maps.Animation.DROP,
        title: name

    });

    marker.addListener('click', function() {
        infowindow.setContent(content);
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

};

var Filter = function() {

    self.query = ko.observable('');

    self.filterPins = ko.computed(function() {
        var search = self.query().toLowerCase();

        return ko.utils.arrayFilter(koMarkers(), function(pin) {
            var doesMatch = pin.name().toLowerCase().indexOf(search) >= 0;

            pin.isVisible(doesMatch);

            return doesMatch;
        });
    });
};

//View Model
function viewModel() {

    self.koMarkers = ko.observableArray([]);


    this.initMap = function() {
        var myApt = {
            lat: 40.779345,
            lng: -73.980686
        };
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: myApt
        });


        for (var x = 0; x < markers.length; x++) {
            var pin = new Pin(map, markers[x].name, markers[x].position, markers[x].text, markers[x].streetView, markers[x].link);
            self.koMarkers.push(pin);
        };
    }


    this.initMap();
    Filter();

};
ko.applyBindings(new viewModel());
loadData();