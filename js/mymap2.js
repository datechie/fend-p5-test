/*infoLoc = new google.maps.InfoWindow({
			    content: ""
  			});*/


var infoLoc = new google.maps.InfoWindow({
    content: "",
    maxWidth: 200
});

function ViewModel (){
	var self = this;
	self.thaiRestaurants = [
		{
			name: "Simply Thai",
			street: "6295 Jarvis Ave",
			city: "Newark",
			state: "CA",
			position: {lat: 37.513370, lng: -122.019588},
			marker: null
		},
		{
			name: "Banh Thai Restaurant",
			street: "39060 Fremont Blvd",
			city: "Fremont",
			state: "CA",
			position: {lat: 37.560621, lng: -121.990357},
			marker: null
		},
		{
			name: "Sala Thai",
			street: "39170 State Street",
			city: "Fremont",
			state: "CA",
			position: {lat:  37.561213, lng: -121.999914},
			marker: null
		}
	]

	var map, marker;
  self.restaurant = ko.observableArray(self.thaiRestaurants);

	// moving initmap in view model
	function initMap() {
		var myLatLng = {lat: 37.529659, lng: -122.040240};

		var mapOptions = {
			disableDefaultUI: true,
			center: myLatLng,
			scrollwheel: false,
			zoom: 13
		};

		// Create a map object and specify the DOM element for display.
		map = new google.maps.Map(document.getElementById('map'), mapOptions);
		resMarkers = []; //array to show the place Markers on the map


		// Create a marker and set its position.
		for (var i = 0;i < self.restaurant().length; i++){
				var temp = self.restaurant()[i];
				console.log("Temp name is " + temp.name);
			//	debugger;

				marker = new google.maps.Marker({
					map: map,
					position: new google.maps.LatLng(temp.position),
					title: temp.name,
					draggable: true,
					animation: google.maps.Animation.DROP
				});
				marker.addListener('click',  toggleBounce);
				marker.addListener('click',  function(temp){
					yelpInfo(temp, map);
				});

        /*marker.addListener('click', function() {
    			//var marker = this;
    			console.log("index " + i + "info -  " + temp.name);
    			yelpInfo(temp, map);
    			//console.log("CS = " + contentString);
    			//console.log ("Yelp data is " + yelpData);
    			//infoLoc.setContent(contentString);
			    //infoLoc.open(map, marker);
  			});*/
  			// End of infoWindow function

				resMarkers.push(marker);
				temp.marker = marker;
  			/*console.log("I is " + i + " and restaurant is " + temp.name);
				infoLoc = new google.maps.InfoWindow({
			    content: "",
	        maxWidth: 200
  			});*/

				//marker.addListener('click', yelpInfo(temp, map));
		}
		var aLen = resMarkers.length;
		// Show the markers
	  for (var i = 0; i < resMarkers.length; i++) {
	  	//console.log("i is " + i);
      resMarkers[i].setMap(map);
	  }

		/*self.restaurant().forEach(function (loc) {
    	    google.maps.event.addListener(loc.marker, 'click', toggleBounce);
    			google.maps.event.addListener(loc.marker, 'click', yelpInfo(loc, map));
      });*/ // This function does not work

		// This function works for the infoWindow
		/*self.restaurant().forEach(function (loc) {
						var marker = loc.marker;
            google.maps.event.addListener(marker, 'click', function () {
                //bounces the marker when clicked on.
							  if (marker.getAnimation() !== null) {
							    marker.setAnimation(null);
							  } else {
							    marker.setAnimation(google.maps.Animation.BOUNCE);
							    setTimeout(function () {
							          marker.setAnimation(null);
							      }, 2000);
							  	}
                //we now use get the yelp api to generate the content and open the infowindow
                yelpInfo(loc, map);
            });
        })*/

		function toggleBounce() {
			var marker = this;
		  if (marker.getAnimation() !== null) {
		    marker.setAnimation(null);
		  } else {
		    marker.setAnimation(google.maps.Animation.BOUNCE);
		    setTimeout(function () {
		          marker.setAnimation(null);
		      }, 2000);
		  	}
				//yelpInfo(loc, map);
			}

	}

	google.maps.event.addDomListener(window, 'load', initMap);

}

function yelpInfo (loc, map){
         	var auth = {
                //
                // Update with your auth tokens.
                //
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

            var accessor = {
                consumerSecret : auth.consumerSecret,
                tokenSecret : auth.accessTokenSecret
            };
            parameters = [];
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

            $.ajax({
                'url' : message.action,
                'data' : parameterMap,
                'dataType' : 'jsonp',
                'jsonpCallback' : 'cb',
                //'success' : function(data, textStats, XMLHttpRequest) {
								'success' : function(data) {
                    //console.log(data);
                    //$("body").append(output);
                    console.log("Name " + data.businesses[0].name);
                    console.log("Phone " + data.businesses[0].phone);
                    console.log("Rating " +  data.businesses[0].rating);
            				contentString = '<div id="content">' +
                    '<h1>' + data.businesses[0].name + '</h1>' +
                    '<h3> Rating: <img src="' + data.businesses[0].rating_img_url + '"</h3>' +
                    '<h3> Phone: ' + data.businesses[0].phone + '</h3>' +
                    '<h3> Address: ' + data.businesses[0].location.display_address + '</h3>' +
                    '</div>';
                    //console.log ("From fn " + contentString);
                    //debugger;
              			infoLoc.setContent(contentString);
			    					infoLoc.open(map, loc.marker);
                },
                error: function () {
            			console.log("Error getting data from yelp API");
            		}
            });
}
ko.applyBindings(new ViewModel());