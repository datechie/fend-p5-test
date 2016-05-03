function ViewModel (){
	var self = this;
	self.restaurants = [
		{
			name: "Simply Thai",
			street: "6295 Jarvis Ave",
			city: "Newar",
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
  self.res = ko.observableArray(self.restaurants);

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
		self.myMarkers = []; //array to show the place Markers on the map

    var myLen = self.res().length;
    console.log("Length is " + myLen);

		// Create a marker and set its position.
		for (var i = 0;i < self.res().length; i++){
				var temp = self.res()[i];
				console.log("Temp name is " + temp.name);
			//	debugger;
					console.log( "Test" );
				marker = new google.maps.Marker({
				map: map,
				position: new google.maps.LatLng(temp.position),
				title: temp.name,
				draggable: true,
				animation: google.maps.Animation.DROP
				});
				marker.addListener('click',  toggleBounce);
				self.myMarkers.push(marker);

		}
		var aLen = self.myMarkers.length;
		// Show the markers
	  for (var i = 0; i < self.myMarkers.length; i++) {
	  	//console.log("i is " + i);
      self.myMarkers[i].setMap(map);
	  }

	self.res().forEach(function (loc) {
        console.log("Test name is " + loc.name);
            //yelpInfo(loc, map);
        });

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
		}

	}

	google.maps.event.addDomListener(window, 'load', initMap);

}
ko.applyBindings(new ViewModel());