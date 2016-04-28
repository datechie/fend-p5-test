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
  //Adds onClick listener for each marker.
  /*self.animateMarker = function (item) {
      item.marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function () {
          item.marker.setAnimation(null);
      }, 2000);
      //generateContentString(item, map);
  };*/

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
    //var marker;
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
				//res.marker = marker;
      //google.maps.event.addListener(this.marker, 'click', toggleBounce);

		}
		var aLen = self.myMarkers.length;
		//console.log("Array Len is " + aLen);
		// Show the markers
	  for (var i = 0; i < self.myMarkers.length; i++) {
	  	console.log("i is " + i);
	  	//self.myMarkers[i].addListener('click', toggleBounce);
      self.myMarkers[i].setMap(map);
	  }

	self.res().forEach(function (item) {
        //google.maps.event.addListener(item.marker, 'click', toggleBounce);
        console.log("Test name is " + item.name);
        //google.maps.event.addListener(item.marker, 'click', toggleBounce);
        //item.marker.addListener('click', toggleBounce);
            //Sends each item(tacoPlace) to generateContentString with all its info
            //generateContentString(item, map);
        });
    //})
    //Adds onClick listener for each marker.
    /*self.res().forEach(function (item) {
        google.maps.event.addListener(item.marker, 'click', function () {
            //bounces the marker when clicked on.
            item.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                item.marker.setAnimation(null);
            }, 2000);
            //Sends each item(tacoPlace) to generateContentString with all its info
            //generateContentString(item, map);
        });
    });*/
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

	//} // end of initMap
	// End of original code
	google.maps.event.addDomListener(window, 'load', initMap);
  //Goes through the marker array and it shows on the map.

}
ko.applyBindings(new ViewModel());