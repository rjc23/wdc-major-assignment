// ------------------------------------------- //
// ---- // ---- // Google Maps // ---- // ---- //
// ------------------------------------------- //
   // address of geocode lookup
   var addressLookup;

   // holds coordinates of user that is generated by geolocation
   var user_position = {
               lat: 0,
               lng: 0
            };

   // Closest restaurant. This is the defualt value used in findClosest function which is updated as the function is run
   // the number chosen is larger than the circumference of the earth
   var currentClosest = 50000000;

   // initialise google map on ElementID map
   function initMap() {
      var map, infoWindow,user_position;
      map = new google.maps.Map(document.getElementById('map'), {
         zoom: 13
      });

      // popup if error in geolocation process
      infoWindow = new google.maps.InfoWindow
      
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(function(position) {
            user_position = {
               lat: position.coords.latitude,
               lng: position.coords.longitude
            };
            map.setCenter(user_position);

            //create restuarant markers on map
            createMarker(user_position,map);
         }, 
         function() {
            handleLocationError(true, infoWindow, map.getCenter());
            //create restuarant markers on map
            createMarker(user_position,map);
         });
      } else {

         // Browser doesn't support Geolocation
         handleLocationError(false, infoWindow, map.getCenter());

         //create restuarant markers on map
         createMarker(user_position,map);
      }
   }

   function handleLocationError(browserHasGeolocation, infoWindow, user_position) {
      infoWindow.setPosition(user_position);
      infoWindow.setContent(browserHasGeolocation ?
         'Error: The Geolocation service failed.' :
         'Error: Your browser doesn\'t support geolocation.');
      infoWindow.open(map);
   }

   // gets restaurant coordinates based on address,
   // then uses inserCoordinates function to insert coords into database for relevant restaurant.
   function geocoding(address) {
      // create AJAX request
      var xhttp = new XMLHttpRequest();
      
      // when server gives OK and ready
      xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {      
            // create json object 
            addressLookup = JSON.parse(this.response);

            // takes coordinates and inserts into database
            insertCoordinates(addressLookup.results[0].geometry.location.lng, addressLookup.results[0].geometry.location.lat, address.Restaurant_ID);
         }
      };

      // this block of code takes address and returns cleaned string that will be used captures a restaurants coordinates
      var location = JSON.stringify(address);
      var string_start = location.indexOf(":")+2;
      var string_end = location.lastIndexOf("\"");
      location = location.slice(string_start,string_end);

      // open connection with server
      xhttp.open("GET","https://maps.googleapis.com/maps/api/geocode/json?address="+location+"&key=AIzaSyDHSI4KzoulBbnrXCiIiID4asbLxqVAyZE", true); 

      // send request
      xhttp.send();
   }

   // helper function to check distance between user location and a restuarant
   function restaurantNearby(restaurant, currentpos){

      // distance in which restaurants will be displayed. measured in metres.
      var threshold = 4000;

      //compute distance between locations
      if (google.maps.geometry.spherical.computeDistanceBetween(currentpos,restaurant) < threshold) {
         return true;
      }
      return false;
   }

   // creates markers that are within a certain radius of user
   function createMarker(user_position,map){
      // array to hold markers
      var markers = [];

      coordinateLookup(function(coordinateLookups){

         // create object containing users coords for comparison
         var origin = new google.maps.LatLng(user_position.lat,user_position.lng);

         // creates marker for each address in list of restaurant coordinates(coordinateLookups)
         // coordinateLookups also contains restaurant name
         coordinateLookups.forEach(function(lookup,element){

            // create object containing restaurantscoordinates for comparison
            var restaurant_location = new google.maps.LatLng(lookup.Longitude, lookup.Latitude);

            // if distance from user location to restaurant under threshold draw marker on map
            if (restaurantNearby(restaurant_location, origin)) {
               // create markers based on restaurant coordinate array
               markers[element] = new google.maps.Marker({
                  position: restaurant_location,
                  map: map,
                  title: lookup.Name
               });
               // Add on click event to marker
               markers[element].addListener('click', function() {
                  // real routes required. Below is placeholder
                  window.location.href = "restaurant.html?id=" + lookup.Name;
               });
            }
         });   
      });
   }

   // loops through each restaurant address in database and updates coordinates
   function getRestaurantAdresses() {
      // Create AJAX request
      var xhttp = new XMLHttpRequest();
      
      // when server gives OK and ready
      xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
            var addresses = JSON.parse(this.response);
            addresses.forEach(function(address){
               //takes address performs google lookup of address then uses nested insertCoordinates function to insert into database
               geocoding(address);
            });   
         }    
      };
         
      // Open connection
      xhttp.open("GET",'/Getrestaurantaddress.json', true);
      
      // set content type to JSON
      xhttp.setRequestHeader("Content-type", "application/json");
      
      // Send request
      xhttp.send();
   }

   //will lookup coordinates based on a restaurants address
   function coordinateLookup(callback) {
      // Create AJAX request
      var xhttp = new XMLHttpRequest();
      
      // when server gives OK and ready
      xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
            var lookups = JSON.parse(this.response);
            //running callback as function
            callback(lookups); 
         }    
      };
         
      // Open connection
      xhttp.open("GET",'/Coordinatelookup', true);
      
      // set content type to JSON
      xhttp.setRequestHeader("Content-type", "application/json");
      
      // Send request
      xhttp.send();
   }

   //This function will insert a restaurants coordinates into the database
   function insertCoordinates(latitude, longitude, Restaurant_ID) {
      // Create AJAX request
      var xhttp = new XMLHttpRequest();

      var URLquery = "?Longitude=" + longitude + "&Latitude=" + latitude + "&Restaurant_ID=" + Restaurant_ID;

      // when server gives OK and ready
      xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
            var addresses = JSON.parse(this.response);
         }    
      };
         
      // Open connection
      xhttp.open("GET",'/insertCoordinates' + URLquery, true);
      
      // set content type to JSON
      xhttp.setRequestHeader("Content-type", "application/json");

      
      // Send request
      xhttp.send();
   }

   //helper function to check if passed restaurant is closer than previous if so updates currentClosest global variable.
   function closestRestaurant(restaurant, currentpos){
      //retrieve distance between user and restaurant
      var distance = google.maps.geometry.spherical.computeDistanceBetween(currentpos,restaurant);

      //compute distance between locations
      if (distance < currentClosest) {

         currentClosest = distance;
         return true;
      }
      return false;
   }

   //creates markers that are within a certain radius of user
   function quickBooking(){
      var closest_restaurant;

      // Try HTML5 geolocation.
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(function(position) {
            user_position = {
               lat: position.coords.latitude,
               lng: position.coords.longitude
            };
         }, 
         function() {
            handleLocationError(true, infoWindow, map.getCenter());
         });
      } else {

         // Browser doesn't support Geolocation
         handleLocationError(false, infoWindow, map.getCenter());
      }

      // looks up restaurant coordinates in database and puts them in coordinateLookups callback variable.
      coordinateLookup(function(coordinateLookups){

         // create object containing users coords for comparison
         var origin = new google.maps.LatLng(user_position.lat,user_position.lng);

         // creates marker for each address in list of restaurant coordinates(coordinateLookups)
         // coordinateLookups also contains restaurant name
         coordinateLookups.forEach(function(lookup,element){

            // create object containing restaurantscoordinates for comparison
            var restaurant_location = new google.maps.LatLng(lookup.Longitude, lookup.Latitude);

            // if closest rstaurant to unser update closestRestaurant
            if (closestRestaurant(restaurant_location, origin)) {

               // updates the vueInstance variable of closestRestaurant
               vueInstance.closestRestaurant = lookup.Name;
            }
         });   
		 
	   // add booking to database (fuct. from entiresite.js)
	   makeBooking('Quick');
      });
   }

