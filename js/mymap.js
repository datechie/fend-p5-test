var map, marker;

var myPlaces = [
  {
    name: "Simply Thai",
    street: "6295 Jarvis Ave",
    city: "Newar",
    state: "CA",
    lat: 37.513370,
    long: -122.019588
  },
  {
    name: "Banh Thai Restaurant",
    street: "39060 Fremont Blvd",
    city: "Fremont",
    state: "CA",
    lat: 37.560621,
    long: -121.990357
  },
  {
    name: "Sala Thai",
    street: "39170 State Street",
    city: "Fremont",
    state: "CA",
    lat:  37.561213,
    long: -121.999914
  }
]

function initMap() {
  var myLatLng = {lat: 37.529659, lng: -122.040240};

  var mapOptions = {
    disableDefaultUI: true,
    center: myLatLng,
    scrollwheel: false,
    zoom: 14
  };

  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  // Create a marker and set its position.
    marker = new google.maps.Marker({
    map: map,
    position: myLatLng,
    title: 'Newark, CA',
    draggable: true,
    animation: google.maps.Animation.DROP
  });

  marker.addListener('click', toggleBounce);

  var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Newark, CA</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
      'sandstone rock formation in the southern part of the '+
      'Heritage Site.</p>'+
      '<p>Attribution: Newark, CA, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
      'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
      '(last visited June 22, 2009).</p>'+
      '</div>'+
      '</div>';

  var infowindow = new google.maps.InfoWindow({
    content: contentString,
    maxWidth: 200 // Check if we need this
  });
  //infoWindow: new google.maps.InfoWindow(),
  //  infoWindowContent: '',
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}

function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {
          marker.setAnimation(null);
      }, 2000);
  }
}