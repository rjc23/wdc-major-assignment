var currentUser;

function getUserAccount(){
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
	xhttp.open("GET", "/getname", false);
	
	// set content type to JSON
	xhttp.setRequestHeader("Content-type", "application/json");
	// send request
	xhttp.send();

	return returnValue;
}

function getCurrentBookings(){

	//delete all bookings
	var book = document.getElementById('currentBookings');

	//this will populate current user
	if(getUserAccount() == 1)
	{
		return;
	}
	var userCurrentlySignedIn = document.getElementById('popName');
	userCurrentlySignedIn.innerText = currentUser;
	//end get current user


	//get current bookings
	var xhttp = new XMLHttpRequest();
	
	// when server gives OK and ready
	xhttp.onreadystatechange = function() 
	{
		if (this.readyState == 4 && this.status == 200) 
		{
			vueInstance.currentUserBookings = JSON.parse(this.response);
			
			// transform dates into presentable strings
			var rawDate;
			for(var i = 0; i < vueInstance.currentUserBookings.length; i++) {
				rawDate = new Date(vueInstance.currentUserBookings[i].Booking_Date);
				vueInstance.currentUserBookings[i].FormattedDate = rawDate.getDate() + "-" + (rawDate.getMonth() + 1) + "-" + rawDate.getFullYear();
			}
		}
		else if(this.readyState == 4 && this.status == 201)
		{
			var element = document.getElementById('currentBookings');
				//clear response (incase they had previous errors)
			while (element.firstChild) 
			{
    			element.removeChild(element.firstChild);
			}

			console.log("it didn't find any bookings.");
			
			var div = document.createElement("div");
			var para = document.createElement("p");
			var button = document.createElement("button");
			para.innerText = "You don't have any bookings.";
			button.setAttribute("class", "pure-button");
			button.setAttribute("onclick", "home()");
			button.innerText = "Make a Booking!";
			div.appendChild(para);
			div.setAttribute("class", "round");
			div.appendChild(button);
			element.appendChild(div);
		}
	};
	
	// open connection with server
	xhttp.open("GET", "/getuserbookings", true);
	
	// set content type to JSON
	xhttp.setRequestHeader("Content-type", "application/json");
	// send request
	xhttp.send();

	return;

}

function getUserReviews() {

			//get current bookings
	var xhttp = new XMLHttpRequest();
	
	// when server gives OK and ready
	xhttp.onreadystatechange = function() 
	{
		if (this.readyState == 4 && this.status == 200) 
		{
			console.log("current user reviews entered");
			vueInstance.currentUserReviews = JSON.parse(this.response);
			console.log(vueInstance.currentUserReviews);
		}
		else if(this.readyState == 4 && this.status == 201)
		{
			var element = document.getElementById('currentReviews');
			//clear response (incase they had previous errors)
			while (element.firstChild) 
			{
    			element.removeChild(element.firstChild);
			}
			
			var div = document.createElement("div");
			var para = document.createElement("p");

			para.innerText = "You haven't left any reviews yet.";

			div.appendChild(para);
			div.setAttribute("class", "round");
			element.appendChild(div);
		}
	};
	
	// open connection with server
	xhttp.open("GET", "/getuserreviews", true);
	
	// set content type to JSON
	xhttp.setRequestHeader("Content-type", "application/json");
	// send request
	xhttp.send();
}
/*
function dropBooking(bookingID) {					// ---- //	CHANGED // ---- //
	// create AJAX request
	var xhttp = new XMLHttpRequest();
	
	// when server gives OK and ready
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			// update vue to display current bookings
			vueInstance.currentUserBookings = JSON.parse(this.response);
			
			// transform dates into presentable strings
			var rawDate;
			for(var i = 0; i < vueInstance.currentUserBookings.length; i++) {
				rawDate = new Date(vueInstance.currentUserBookings[i].Booking_Date);
				vueInstance.currentUserBookings[i].FormattedDate = rawDate.getDate() + "-" + (rawDate.getMonth() + 1) + "-" + rawDate.getFullYear();
			}
		}
	};
	
	// open connection with server
	xhttp.open("GET", "/dropBooking?id=" + booking_ID, false);
	
	// set content type to JSON
	xhttp.setRequestHeader("Content-type", "application/json");
	
	// send request
	xhttp.send();
}
*/
// update info
	function updateDetails() {
		// create AJAX request
		var xhttp = new XMLHttpRequest();
		
		// when server gives OK and ready
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var temp = JSON.parse(this.response);
				var ph = temp[0].Phone_No;
				var em = temp[0].Email;
			
				// create & append div 
					var parentDiv = document.getElementById("newDetailsPopUp");
					var childDiv = document.createElement("P");
					childDiv.innerHTML = 'Your details have been changed. Ph: ' + ph + ' Em: ' + em;
					parentDiv.appendChild(childDiv);
			}
		};
		
		// open connection with server
		xhttp.open("POST", "/changeDetails", false);
		
		// set content type to JSON
		xhttp.setRequestHeader("Content-type", "application/json");
		
		// send request
		var req_body = JSON.stringify({ Phone:vueInstance.currentUserNewPhone, Email:vueInstance.currentUserNewEmail });
		xhttp.send(req_body);

	}


