// ----------------------------------------------------- //
// ---- // ---- // client-side variables // ---- // ---- //
// ----------------------------------------------------- //
var currentUser;

// ----------------------------------- //
// ---- // ---- // Vue // ---- // ---- //
// ----------------------------------- //

	// header
	Vue.component('vue-header', {
		template: '<div> \
					<div class="header"> \
						<div class="logo"><a href="/">TABLES ARE US</a></div> \
						<div class="buttons"> \
						  <button id="signInButton" onclick="signInButton()" class="displayNone">Sign in</button> \
						  <button id="signUpButton" onclick="signUpButton()" class="displayNone">Sign up</button> \
						  <p id="hello" class="displayNone">Hello, <span id="currentlySignedIn">USERNAME</span></p> \
						  <button class="displayNone" id="accountPageButton" onclick="userAccount()">Account</button>\
						  <button class="displayNone" id="signOutButton" onclick="signOutButton()">Sign Out</button> \
						</div> \
					</div> \
					<br/><br/><br/> \
				  </div>'
	});

	// footer
	Vue.component('vue-footer', {
		template:	'<div class="footer"> \
					  <br> \
					  <div class="floatLeft"> \
						<p>Made with love as a part of the Web and Database Course - University of Adelaide</p> \
						<p>Copyright &#169; The Cool Kids</p> \
						<button class="yellowButton pure-button" onclick="restSignUpButton()" type="button">Restaurant Sign Up</button> \
					  </div> \
					  <div class="floatRight"> \
						<img class="social" src="images/icon-facebook.png"> \
						<img class="social" src="images/icon-instagram.png"> \
						<img class="social" src="images/icon-twitter.png"> \
					  </div> \
					</div>'
	});
	
	// result element (used on results page)
	Vue.component('vue-result', {
		props: [ 'result' ],
		
		template: 	'<div class="result-box pure-u-1">' +
					  '<h3><a class="fontColour" v-bind:href="result.Link">{{ result.Name }}</a></h3>' +
					  '<a v-bind:href="result.Link"><img class="result-img pure-u-1-4 pure-img l-box" v-bind:src="result.Img" alt="REPLACE ME"></a>' +
					  '<div class="pure-u-1-2 l-box">' +
					    '<div v-for="result.Average_Rating">' +
					      '<img class="star-rating" src="images/gold_star.png" alt="star-rating">' +
					      '<img class="star-rating" src="images/gold_star.png" alt="star-rating">' +
					      '<img class="star-rating" src="images/gold_star.png" alt="star-rating">' +
					      '<img class="star-rating" src="images/gold_star.png" alt="star-rating">' +
					      '<img class="star-rating" src="images/grey_star.png" alt="star-rating">' +
					      '<span>({{ result.Average_Rating }} stars)</span>' +
					    '</div>' +
					    '<div>' +
					      '<i class="fas fa-map-marker-alt"></i>	<span> {{ result.Location }}</span></br>' +
					      '<i class="fas fa-utensils"></i>			<span> {{ result.Cuisine }}</span></br>' +
					      '<i class="fas fa-dollar-sign"></i>		<span> {{ result.Price }}</span>' +
					    '</div>' +
					  '</div>' +
					  '<div class="pure-u-1-4 l-box">' +
					  '</div>' +
					'</div>'
	});
	
	// trending element (used on index page)
	Vue.component('vue-trending', {
		props: [ 'result' ],
		
		template: 	'<div class="restaurant pure-u-1">' +
					  '<div class="photo">' +
						'<a v-bind:href="result.Link"><img class="image" v-bind:src="result.Img" alt="REPLACE ME"></a>' +
					  '</div>' +
					  '<div class="description">' +
						'<h4><a v-bind:href="result.Link">{{ result.Name }}</a></h4>' +
						'<img class="stars" src="images/stars.png">' +
						'<p>{{ result.Cuisine}} | {{ result.Price }} | {{ result.Location }}</p>' +
					  '</div>' +
					'</div>'					
	});
	
	// review element  for restaurant
	Vue.component('vue-review', {
		props: [ 'review' ],
		
		template: 	'<div class="pure-u-1">' +
						'<h4 style="padding: 1em 0em 0em 0em">{{review.UserName}}: Rating {{review.Ratings}}</h4>' +
						'<p style="margin: 0em 0em 0em 0em">{{review.Comments}}</p>' +
					'</div>'					
	});

	// active user's current bookings
	Vue.component('vue-cur-bookings', {
		props: [ 'bookings' ],

		template:     			'<div class="round">' +
    				'<p><b>Booking ID:</b> {{ bookings.Booking_ID }} <br><b>Restaurant:</b> {{ bookings.Restaurant_Name }} <br> <b>Address:</b> {{ bookings.Restaurant_Address }}<br> <b>Date:</b> {{ bookings.FormattedDate }} <br> <b>Time:</b> {{ bookings.Booking_Time }} <br> <b>No. of People:</b> {{ bookings.Party_size }}</p>' +
    				'<button class="pure-button">Cancel Booking</button>' +
    			'</div>'				
	});


	// active user's reviews
	Vue.component('vue-cur-reviews', {
		props: [ 'reviews' ],

		template:'<div class="round">' +
    				'<p><b>Restaurant:</b> {{ reviews.Restaurant_Name }} <br><b>Star Rating:</b> {{ reviews.Ratings }} <br> <b>Comments:</b> {{ reviews.Comments }}</p>' +
    			'</div>'				
	});

	var vueInstance = new Vue({
		el: "#vuemain",
		
		data: {
			// search/filter fields
				preferenceTime: 'null',
				preferenceGuest: 2,
				preferenceDate: '',
				preferenceCuisine: '',
				preferenceStars: 'all',
				
			// trending
				currentTrending: [],
				
			// results pages
				searchResultArray: [],
				
			// restaurant info
				restName: 'loading...',
				restText: 'loading...',
				restAddress: 'loading...',
				restCuisine: 'loading...',
				restCost: 'loading...',

			// review info
			reviewArray: [],

			// the closest restaurant to user
			closestRestaurant: 'loading...',
			
			// current user profile page
				currentUserBookings: [],
				currentUserReviews: [],
				currentUserNewPhone: '',
				currentUserNewEmail: '',
			
			//leaving a review fields
				reviewStars: 5,
				reviewText: '',
				
			// booking info
				currentBooking: { UserEmail:'', bookingID:'', Date:'', Time:'', RestName:'', RestAddress: '' },
		},
	

	});
	
// --------------------------------------------------------- //
// ---- // ---- // Cilent-Server Interaction // ---- // ---- //
// --------------------------------------------------------- //

	// upon page load of results page, populate it based on the search parameters
	function populateResults() {
	//	var URL_query = stringifySearchParameters();	// + "&loc=" + getUrlVars()["loc"]
		var URL_query = "?stars=" + getUrlVars()["stars"] + "&meal=" + getUrlVars()["meal"] +
			"&people=" + getUrlVars()["people"] + "&cuisine=" + getUrlVars()["cuisine"];

		// create AJAX request
		var xhttp = new XMLHttpRequest();
		
		// when server gives OK and ready
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				vueInstance.searchResultArray = JSON.parse(this.response);
				
				// convert num into string & convert Name into Link
				var temp;
				for(var i = 0; i < vueInstance.searchResultArray.length; i++) {
					vueInstance.searchResultArray[i].Link = '/restaurant.html?id=' + encodeURI(vueInstance.searchResultArray[i].Name);
					vueInstance.searchResultArray[i].Img = '/images/rest/' + vueInstance.searchResultArray[i].Name + '_01.jpg';
					
					// convert price int to string
						temp = vueInstance.searchResultArray[i].Price;
						vueInstance.searchResultArray[i].Price = '';
						for(var j = 0; j < temp; j++) {
							vueInstance.searchResultArray[i].Price = vueInstance.searchResultArray[i].Price + '$';
						}
				}
				
				// if there were no results, display the no results found message
				if(vueInstance.searchResultArray.length < 1) {
					vueInstance.noResultsFound = 'No Results found';
				}
			}
		};
		
		// open connection with server
		xhttp.open("GET", ("/getsearchresults" + URL_query), false);
		
		// set content type to JSON
		xhttp.setRequestHeader("Content-type", "application/json");
		// send request
		xhttp.send();
	}
	
	// upon page load of index page, populate it using random items
	function populateTrending() {
		var URL_query = stringifySearchParameters();

		// create AJAX request
		var xhttp = new XMLHttpRequest();
		
		// when server gives OK and ready
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				vueInstance.currentTrending = JSON.parse(this.response);
				
				// convert num into string & convert Name into Link
				var temp;
				for(var i = 0; i < vueInstance.currentTrending.length; i++) {
					vueInstance.currentTrending[i].Link = '/restaurant.html?id=' + encodeURI(vueInstance.currentTrending[i].Name);
					vueInstance.currentTrending[i].Img = '/images/rest/' + vueInstance.currentTrending[i].Name + '_01.jpg';
					
					// convert price int to string
						temp = vueInstance.currentTrending[i].Price;
						vueInstance.currentTrending[i].Price = '';
						for(var j = 0; j < temp; j++) {
							vueInstance.currentTrending[i].Price = vueInstance.currentTrending[i].Price + '$';
						}
				}
			}
		};
		
		// open connection with server
		xhttp.open("GET", "/gettrending", false);
		
		// set content type to JSON
		xhttp.setRequestHeader("Content-type", "application/json");
		// send request
		xhttp.send();
	}

	// upon page load of restaurant page, populate with the data back by querying rest name
	function populateRestaurantPage() {
		var URL_query = "?id=" + getUrlVars()["id"]; // grab restaurant's ID from link

		// create AJAX request
		var xhttp = new XMLHttpRequest();
		
		// when server gives OK and ready
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var restInfo = JSON.parse(this.response);
				
				// update vue variables
					vueInstance.restName = restInfo[0].Name;
					vueInstance.restText = 'Come on down to ' + restInfo[0].Name + '! Where we serve the best ' + restInfo[0].Cuisine.toLowerCase() + " food in South Australia. We're proud of our user's review score of " + restInfo[0].Average_Rating + ".";
					
					vueInstance.restAddress = restInfo[0].Location;
					vueInstance.restCuisine = restInfo[0].Cuisine;
					vueInstance.restCost = '';
					for(var i = 0; i < restInfo[0].Price; i++) {
						vueInstance.restCost = vueInstance.restCost + '$';
					}
				
				// update page's booking times
					populateOpeningTimes(restInfo[0].Opening_Time);
					
			}
		};
		
		// open connection with server
		xhttp.open("GET", "/getrestaurantinfo" + URL_query, false);
		
		// set content type to JSON
		xhttp.setRequestHeader("Content-type", "application/json");
		// send request
		xhttp.send();
	}
	
	// Get review and username to populate review fied on restaurant page
	function populateRestaurantReview(restaurant_name) {
		var URL_query = "?name=" + restaurant_name; // grab restaurant's ID from link

		// create AJAX request
		var xhttp = new XMLHttpRequest();
		
		// when server gives OK and ready
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				vueInstance.reviewArray = JSON.parse(this.response);

				if (vueInstance.reviewArray.length < 1) {
					vueInstance.reviewArray = [{
						UserName: 'No reviews available!' 
					}]
				}
			}
		};
		
		// open connection with server
		xhttp.open("GET", "/Reviewlookup" + URL_query, false);
		
		// set content type to JSON
		xhttp.setRequestHeader("Content-type", "application/json");
		// send request
		xhttp.send();
	}

	// connect to server to add a booking to the database, then go to confirmation page
	function makeBooking(timeslot) {
		// create AJAX request
		var xhttp = new XMLHttpRequest();
		
		var send_Date = vueInstance.preferenceDate;
		var send_Time = timeslot;
		var send_Guests = vueInstance.preferenceGuest;
		var send_RestName;
		if(timeslot == "Quick") {
			send_RestName = vueInstance.closestRestaurant;
		}
		else {
			send_RestName = getUrlVars()["id"];
		}

		
		// when server is ready
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4) {
				if(this.status == 200) {
					var URL_query = "?BookingID=" + (JSON.parse(this.response)).Booking_ID;
					window.location.assign("confirmation.html" + URL_query);
					
				}
				else if(this.status == 403) {
					alert("You need to be logged in to do this.");
				}
				else {
					console.log("unexpected server response " + this.status);
				}
			}
		};
		
		// open connection with server
		xhttp.open("POST","/insertBooking", true);
		
		// set content type to JSON
		xhttp.setRequestHeader("Content-type", "application/json");
		
		// send request
		var req_body = JSON.stringify({ Rest:send_RestName, Date:send_Date, Time:send_Time, Guests:send_Guests });
		xhttp.send(req_body);
	}

	// upon page load, booking confirmation populate page using booking ID
	function populateConfirmationPage() {
		var URL_query = "?BookingID=" + getUrlVars()["BookingID"];

		// create AJAX request
		var xhttp = new XMLHttpRequest();
		
		// when server gives OK and ready
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var bookingInfo = (JSON.parse(this.response))[0];
				// update vue variables
					var rawDate = new Date(bookingInfo.Booking_Date);
					vueInstance.currentBooking.Date = rawDate.getDate() + "-" + (rawDate.getMonth() + 1) + "-" + rawDate.getFullYear();
					vueInstance.currentBooking.Name = bookingInfo.FirstName + " " + bookingInfo.LastName;
					vueInstance.currentBooking.UserEmail = bookingInfo.Email;
					vueInstance.currentBooking.bookingID = bookingInfo.Booking_ID;
					vueInstance.currentBooking.Time = bookingInfo.Booking_Time;
					vueInstance.currentBooking.RestName = bookingInfo.Name;
					vueInstance.currentBooking.RestAddress = bookingInfo.Location;
			}
		};
		
		// open connection with server
		xhttp.open("GET", "/getbookingInfo" + URL_query, false);
		
		// set content type to JSON
		xhttp.setRequestHeader("Content-type", "application/json");
		// send request
		xhttp.send();
	}

	function testQuery() {
		var search_item = "R";		// the string you want to include via filter parameter on server
		
		// Create AJAX request
		var xhttp = new XMLHttpRequest();
		
		// when server gives OK and ready
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var ans = JSON.parse(this.response);
			}
		};
			
		// Open connection
		xhttp.open("GET",'/Restaurant.json?filter=' + search_item, true);
		
		// set content type to JSON
		xhttp.setRequestHeader("Content-type", "application/json");
		
		// Send request
		xhttp.send();
	}
// ------------------------------------------------------------------ //
// ---- // ---- //    Login - Client Side Functions   // ---- // ---- //
// ------------------------------------------------------------------ //

function loginForm() {

	var password1 = $("#password").val();
	var username1 = document.getElementById('username').value;

    authServer({username:username1, password:password1});
};

function loginOpenID(googleUser) {

    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    
    // Pass the token to auth function
    authServer({idtoken: id_token});
};

  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out successfully.');
    });
  }

// ------------------------------------------------------------------ //
// ---- // ---- // Login - Client/Server Interactions // ---- // ---- //
// ------------------------------------------------------------------ //

// Send login request to server
function authServer(params) {
 
	var response = document.getElementById('response');
	var para = document.createElement("p");
    
	while (response.firstChild) 
	{
		response.removeChild(response.firstChild);
	}
	
    var xhttp = new XMLHttpRequest();
    
    // Define behaviour for a response
    xhttp.onreadystatechange = function() {
    
        if (this.readyState == 4 && this.status < 400) {
            window.location.assign("index.html");
        } 
        else if (this.readyState == 4 && this.status == 401) {
            
            para.innerText = "Username and/or password incorrect";
            response.appendChild(para);
        }
    };
    
    // Initiate connection
    xhttp.open("POST", "/login", true);
    
    xhttp.setRequestHeader("Content-type","application/json");
    
    // Send request
    xhttp.send(JSON.stringify(params));
}

function getUser(){
	var returnValue = 1;
	// create AJAX request
	var xhttp = new XMLHttpRequest();
	
	// when server gives OK and ready
	xhttp.onreadystatechange = function() 
	{
		if (this.readyState == 4 && this.status == 200) 
		{
			currentUser = JSON.parse(this.response);
			returnValue = 0;
		}
	};
	
	// open connection with server
	xhttp.open("GET", "/getuser", false);
	
	// set content type to JSON
	xhttp.setRequestHeader("Content-type", "application/json");
	// send request
	xhttp.send();

	return returnValue;
}

function signOutButton(){

	//log them out in google
	// auth2 = gapi.load('auth2', signOut);
	signOut();

	//then open a connection and log them out on our end aswell
	var xhttp = new XMLHttpRequest();
    
    // Define behaviour for a response
    xhttp.onreadystatechange = function() {
    
        if (this.readyState == 4 && this.status < 400) {
        	currentUser = null;
            window.location.assign("index.html");
        } 
        else if (this.readyState == 4 && this.status == 401) {
            
            console.log("Sign out failed");
        }
    };
    
    // Initiate connection
    xhttp.open("POST", "/logout", true);
    
    xhttp.setRequestHeader("Content-type","application/json");
    
    // Send request
    xhttp.send();

}

// ------------------------------------------------ //
// ---- // ---- // Normal Functions // ---- // ---- //
// ------------------------------------------------ //

	// upon page load, if a user is logged in, update the header to reflect this
	function changeHeader()
	{
		var signInButton = document.getElementById('signInButton');
		var signUpButton = document.getElementById('signUpButton');
		//if no user is logged in, display sign in/sign up buttons
		if(getUser() === 1)
		{
			signInButton.setAttribute("class", "pure-button");
			signUpButton.setAttribute("class", "yellowButton pure-button pure-button-active");
			return;
		}


		var hello = document.getElementById('hello');
		var userCurrentlySignedIn = document.getElementById('currentlySignedIn');
		var signOutButton = document.getElementById('signOutButton');
		var accountPageButton = document.getElementById('accountPageButton');

		//dont display sign in / sign up buttons
		signInButton.setAttribute("class", "displayNone");
		signUpButton.setAttribute("class", "displayNone");

		//display info for a user
		hello.setAttribute("class", "displayHello");
		userCurrentlySignedIn.innerText = currentUser;
		accountPageButton.setAttribute("class", "pure-button");
		signOutButton.setAttribute("class", "yellowButton pure-button pure-button-active");

		return;
	}

	function getUrlVars() {
		// source: https://html-online.com/articles/get-url-parameters-javascript/
		var vars = {};
		
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
			vars[key] = value;
		});
		
		return vars;
	}

	function stringifySearchParameters() {
		var URL_parameters = "?stars=" + vueInstance.preferenceStars;

		// & meal=
			URL_parameters = URL_parameters + "&meal=";
			if(vueInstance.preferenceTime != '')
				URL_parameters = URL_parameters + vueInstance.preferenceTime;
			else
				URL_parameters = URL_parameters + 'null';
		// & people=
			URL_parameters = URL_parameters + "&people=";
			if(vueInstance.preferenceGuest != '')
				URL_parameters = URL_parameters + vueInstance.preferenceGuest;
			else
				URL_parameters = URL_parameters + 'null';
		// & cuisine=
			URL_parameters = URL_parameters + "&cuisine=";
			if(vueInstance.preferenceCuisine != '')
				URL_parameters = URL_parameters + vueInstance.preferenceCuisine;
			else
				URL_parameters = URL_parameters + 'null';
			
			
		return URL_parameters;
	}
	
	// helper to restaurant load - display options for times depending on opening time
	function populateOpeningTimes(openingTimes) {
		// function variables
			var hr = 0; 			var min = 0;
			var fulltime = '';		var maxItems = 4;
		
		// parent & child divs
			var parentDiv = document.getElementById("timeButtonDiv");
			var childDiv;
		
		// get substrings from openingTimes, if any match B/L/D, then display those buttons
			if(openingTimes.includes("Breakfast") == true) {
				hr = 7;		min = 15;
				for(var i = 0; i < maxItems; i++) {
					fullTime = hr.toString() + ":" + min.toString() + " AM";
					
					// create div
						childDiv = document.createElement("BUTTON");
						childDiv.setAttribute("onclick", "makeBooking(fullTime)");
						childDiv.setAttribute("name", "timeslot");
						childDiv.setAttribute("v-model", fullTime);
						childDiv.setAttribute("class", "pure-button pure-button-primary");
						childDiv.setAttribute("value", fullTime);
						childDiv.innerHTML = fullTime;
					
					// append div
						parentDiv.appendChild(childDiv);
					
					// update times for next loop
						min = min + 30;
						if(min >= 60) {
							min = min - 60;
							hr = hr + 1;
						}
				}
			}
			
			if(openingTimes.includes("Lunch") == true) {
				hr = 12;		min = 15;
				for(var i = 0; i < maxItems; i++) {
					fullTime = hr.toString() + ":" + min.toString() + " PM";
					
					// create div
						childDiv = document.createElement("BUTTON");
						childDiv.setAttribute("onclick", "makeBooking(fullTime)");
						childDiv.setAttribute("name", "timeslot");
						childDiv.setAttribute("v-model", fullTime);
						childDiv.setAttribute("class", "pure-button pure-button-primary");
						childDiv.setAttribute("value", fullTime);
						childDiv.innerHTML = fullTime;
					
					// append div
						parentDiv.appendChild(childDiv);
					
					// update times for next loop
						min = min + 30;
						if(min >= 60) {
							min = min - 60;
							hr = hr + 1;
							if(hr > 12) {
								hr = hr - 12;
							}
						}
				}
			}
		
			if(openingTimes.includes("Dinner") == true) {
				hr = 6;		min = 20;
				for(var i = 0; i < maxItems; i++) {
					fullTime = hr.toString() + ":" + min.toString() + " PM";
					
					// create div
						childDiv = document.createElement("BUTTON");
						childDiv.setAttribute("onclick", "makeBooking(fullTime)");
						childDiv.setAttribute("name", "timeslot");
						childDiv.setAttribute("v-model", fullTime);
						childDiv.setAttribute("class", "pure-button pure-button-primary");
						childDiv.setAttribute("value", fullTime);
						childDiv.innerHTML = fullTime;
					
					// append div
						parentDiv.appendChild(childDiv);
					
					// update times for next loop
						min = min + 30;
						if(min >= 60) {
							min = min - 60;
							hr = hr + 1;
						}
				}
			}

	}
	
		function saveData() 
	{
		var d = document.getElementById("prefDate").value;
		var t = document.getElementById("prefTime").value;
		var pp = document.getElementById("prefNoOfpeople").value;
		var c = document.getElementById("prefCus").value;

		//then open a connection and log them out on our end aswell
		var xhttp = new XMLHttpRequest();
	    
	    // Define behaviour for a response
	    xhttp.onreadystatechange = function() {
	    
	        if (this.readyState == 4 && this.status < 400) {
	        	// do nothing
	        } 
	    };
	    
	    // Initiate connection
	    xhttp.open("POST", "/saveSearch", true);
	    
	    xhttp.setRequestHeader("Content-type","application/json");

	    // Send request
	    var toSend = JSON.stringify({date1:d, time1:t, people1: pp, cuisine1:c});
	    xhttp.send(toSend);
	}

	// ----------- check if this is still used ------
	function changePreferences(){
		var prefs;

		var numberOfPeopleRestaurant = document.getElementById("numberOfPeopleRestaurant");
		var preferenceDateRestaurant = document.getElementById("preferenceDateRestaurant");

		//then open a connection and log them out on our end aswell
		var xhttp = new XMLHttpRequest();
	    
	    // Define behaviour for a response
	    xhttp.onreadystatechange = function() {
	    
	        if (this.readyState == 4 && this.status < 400) {
	        	prefs = JSON.parse(this.response);

	        	numberOfPeopleRestaurant.value = prefs[0].people;
	        	preferenceDateRestaurant.value = prefs[0].date;

	        } 
	    };
	    
	    // Initiate connection
	    xhttp.open("GET", "/getPreferences", true);
	    
	    xhttp.setRequestHeader("Content-type","application/json");

	    // Send request
	    xhttp.send();

	}

	// if logged in, keep current search parameters (no. people & date) in sync across pages
	function loadSearch() {
		var prefs;

		//then open a connection and log them out on our end aswell
		var xhttp = new XMLHttpRequest();
	    
	    // Define behaviour for a response
	    xhttp.onreadystatechange = function() {
	    
	        if (this.readyState == 4 && this.status < 400) {
	        	prefs = JSON.parse(this.response);

	        	vueInstance.preferenceGuest = prefs[0].people;
	        	vueInstance.preferenceTime = prefs[0].time;
	        	vueInstance.preferenceDate = prefs[0].date;
	        	vueInstance.preferenceCuisine = prefs[0].cuisine;

	        } 
	    };
	    
	    // Initiate connection
	    xhttp.open("GET", "/getPreferences", true);
	    
	    xhttp.setRequestHeader("Content-type","application/json");

	    // Send request
	    xhttp.send();

	}
	
// -------------------------------------------------- //
// ---- // ---- // Navigation Buttons // ---- // ---- //
// -------------------------------------------------- //

	function searchButton() {
		window.location.assign("results.html" + stringifySearchParameters());
	}

	function signUpButton() {
		window.location.assign("sign-up.html");
	}

	function restSignUpButton() {
		window.location.assign("rest-sign-up.html");
	}

	function signInButton() {
		window.location.assign("sign-in.html");
	}

	function userAccount() {
		window.location.assign("user-account.html");
	}

