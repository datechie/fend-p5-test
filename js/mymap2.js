'use strict';
var infoLoc = new google.maps.InfoWindow({
    content: "",
    maxWidth: 200
});

function ViewModel (){
	var self = this;
	self.thaiRestaurants = [
		{
			name: "Banh Thai Restaurant",
//			street: "39060 Fremont Blvd",
//			city: "Fremont",
			state: "CA",
			position: {lat: 37.560621, lng: -121.990357},
			marker: null
		},
		{
			name: "Sala Thai",
//			street: "39170 State Street",
//			city: "Fremont",
			state: "CA",
			position: {lat:  37.561213, lng: -121.999914},
			marker: null
		},
		{
			name: "Green Champa Garden",
//			street: "42318 Fremont Blvd",
//			city: "Fremont",
			state: "CA",
			position: {lat:  37.540918, lng: -121.990357},
			marker: null
		},
		{
			name: "Beyond Thai",
//			street: "46535 Mission Blvd",
//			city: "Fremont",
			state: "CA",
			position: {lat:  37.561213, lng: -121.999184},
			marker: null
		},
		{
			name: "Chef Chai Thai Cuisine",
//			street: "47894 Warm Springs Blvd",
//			city: "Fremont",
			state: "CA",
			position: {lat:  37.526886, lng: -121.98499375},
			marker: null
		},
	]

	var map, marker;
  	self.restaurant = ko.observableArray(self.thaiRestaurants);

	// Initialize the Map
	function initMap() {
		// Latitude, Longitude for map center
		var myLatLng = {lat: 37.529659, lng: -122.040240};

		var mapOptions = {
			disableDefaultUI: true,
			center: myLatLng,
			scrollwheel: false,
			zoom: 13
		};

		// Create a map object and specify the DOM element for display.
		map = new google.maps.Map(document.getElementById('map'), mapOptions);
		var pointMarkers = []; //array to show the place Markers on the map


		// Create a marker and set its position.
		for (var i = 0;i < self.restaurant().length; i++){
				var tempRes = self.restaurant()[i];
				//console.log("Temp name is " + tempRes.name);
			//	debugger;

				marker = new google.maps.Marker({
					map: map,
					position: new google.maps.LatLng(tempRes.position),
					title: tempRes.name,
					draggable: true,
					animation: google.maps.Animation.DROP,
					icon: 'images/thai.png' // icon gotten from https://mapicons.mapsmarker.com
				});
				// Add marker to our location
				tempRes.marker = marker;

				pointMarkers.push(marker);
		}

		// Display the markers
	  	for (var i = 0; i < pointMarkers.length; i++) {
	      	//pointMarkers[i].setMap(map);
	      	pointMarkers[i].setVisible(true);
	  	}

		// We use this for the data binding and will be called below for the click listener
	    self.showPlace = function (loc) {
                toggleBounce(loc.marker);
                yelpInfo(loc, map);
	    };

	    // Add a click listener to the marker
		self.restaurant().forEach(function (loc) {
			var marker = loc.marker;
            google.maps.event.addListener(marker, 'click', function () {
            	self.showPlace(loc);
            });
        })

		// Function to bounce the marker for 2 seconds on click
		function toggleBounce(marker) {
		  if (marker.getAnimation() !== null) {
		    marker.setAnimation(null);
		  } else {
		    marker.setAnimation(google.maps.Animation.BOUNCE);
		    setTimeout(function () {
		          marker.setAnimation(null);
		      }, 2000);
		  	}
		}

	}

	// We use a second array for search filtering with the knockout framework
	self.searchFilter = ko.observable('');
	var filter;
	self.filterPlaces = ko.computed(function () {
        return ko.utils.arrayFilter(self.restaurant(), function (place) {
        	filter = self.searchFilter().toLowerCase();
            //var isDisplay = place.name.toLowerCase().indexOf(filter) >= 0;
            var isDisplay = (place.name.toLowerCase().indexOf(filter)) >= 0 ? true : false;
            console.log("Filter is " + filter);
            console.log("Display is " + isDisplay);
            if (place.marker) {
                if (isDisplay) {
                    place.marker.setVisible(true);
                } else {
                    place.marker.setVisible(false);
                }
            }
            return isDisplay;
        });
    })

	google.maps.event.addDomListener(window, 'load', initMap);

}

function yelpInfo (loc, map){
         	var auth = {
                // My auth tokens.
                consumerKey : "_QrOLPgd8nGC-tuNJcxtUA",
                consumerSecret : "ndJTUrL82MqEYBsKSd0Wa_oQyOw",
                accessToken : "c8U06Cl3cxLeNqHMvRsTalU6Q9NV8PXT",
                accessTokenSecret : "Qcx4LmyTqaWZ8sUoZ1e10hqlqVs",
                serviceProvider : {
                    signatureMethod : "HMAC-SHA1"
                }
            };

            var terms = loc.name;
            var near = loc.city;
            console.log("terms is " + terms);
            var accessor = {
                consumerSecret : auth.consumerSecret,
                tokenSecret : auth.accessTokenSecret
            };
            var parameters = [];
            parameters.push(['term', terms]);
            parameters.push(['location', near]);
            parameters.push(['callback', 'cb']);
            parameters.push(['oauth_consumer_key', auth.consumerKey]);
            parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
            parameters.push(['oauth_token', auth.accessToken]);
            parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

            var message = {
                'action' : 'http://api.yelp.com/v2/search',
                'method' : 'GET',
                'parameters' : parameters
            };

            OAuth.setTimestampAndNonce(message);
            OAuth.SignatureMethod.sign(message, accessor);

            var parameterMap = OAuth.getParameterMap(message.parameters);
            var contentString;

            $.ajax({
                'url' : message.action,
                'data' : parameterMap,
                'dataType' : 'jsonp',
                'jsonpCallback' : 'cb',
				'success' : function(data) {
    				contentString = '<div id="content">' +
                    	'<h1>' + data.businesses[0].name + '</h1>' +
                    	'<h3> Rating: <img src="' + data.businesses[0].rating_img_url + '"</h3>' +
                    	'<h3> Phone: ' + data.businesses[0].phone + '</h3>' +
                    	'<h3> Address: ' + data.businesses[0].location.display_address + '</h3>' +
                    	'</div>';
                    // We now set the infoWindow content
          			infoLoc.setContent(contentString);
					infoLoc.open(map, loc.marker);
                },
                error: function () {
        			console.log("Error getting data from yelp API");
        		}
            });
}
ko.applyBindings(new ViewModel());