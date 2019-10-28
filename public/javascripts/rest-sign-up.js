function restSignUp()
{
	//count errors, if exist, don't push information to the server. The response is the div where errors will appear
	var errors = 0;
	var response = document.getElementById('response');

	//clear response (incase they had previous errors)
	while (response.firstChild) 
	{
		response.removeChild(response.firstChild);
	}

	//paragraphs that we need
	var para = document.createElement("p");
	var para1 = document.createElement("p");
	var para2 = document.createElement("p");
	var para3 = document.createElement("p");
	var para4 = document.createElement("p");
	var para5 = document.createElement("p");
	var para6 = document.createElement("p");
	var para7 = document.createElement("p");
	var para8 = document.createElement("p");

	//getting the element from the page
	var name = document.getElementById('name').value;
	var cuisine = document.getElementById('cuisine').value;
	var address = document.getElementById('address').value;
	var email = document.getElementById('email').value;
	var opening = document.getElementById('opening').value;
	var price = document.getElementById('price').value;


	//checking that they have input a name
	if(name.length == 0)
	{
		para.innerText = "Please enter your Restaurant's Name";
		response.appendChild(para); 
		errors++;
	}

	if(cuisine.length == 0)
	{
		para1.innerText = "Please enter your Restaurant's Cuisine";
		response.appendChild(para1); 
		errors++;
	}

	if(address.length == 0)
	{
		para2.innerText = "Please enter your Restaurant's Address";
		response.appendChild(para2); 
		errors++;
	}

	if(email.length == 0)
	{
		para3.innerText = "Please enter your Restaurant's Email";
		response.appendChild(para3); 
		errors++;
	}

	//there is an email, check that it exists on the server, if not, don't bother checking as it is blank
	if(email.length > 0)
	{
		if(checkRestaurant() == 0)
		{
			para6.innerText = "We already have an account with that Email";
			response.appendChild(para6);
			errors++;
		}
	}

	if(opening.length == 0)
	{
		para7.innerText = "Please select the Restaurant's opening times";
		response.appendChild(para7);
		errors++;
	}

	if(price.length == 0)
	{
		para8.innerText = "Please select the Restaurant's Average Price for main meals";
		response.appendChild(para8);
		errors++;
	}

	//Password Checking
	var password = $("#passwordrest").val();
	var confirmPassword = $("#rpasswordrest").val();

	//Send error message if the password is less that 8 characters/symbols long
	if(password.length < 8)
	{
		para4.innerText = "Password must be 8 or more characters/symbols long";
		response.appendChild(para4);
		errors++;
	}

	//Send error message
	if (password != confirmPassword)
	{
		para5.innerText = "Your password's don't match!";
		response.appendChild(para5);
		errors++;
	}

	//if there are errors, don't post to the server
	if(errors > 0)
	{
		return;
	}

	//else, all is good, push it to the server
	addNewRestaurant()

	return;

}

function checkRestaurant() {

	var email = document.getElementById('email').value;
	console.log("email");
	var returnToSignUp = 1;

    var xhttp = new XMLHttpRequest();
    
    // Define behaviour for a response
    xhttp.onreadystatechange = function() {
    
    	//it found it
        if (xhttp.readyState == 4 && xhttp.status == 200) {
        	returnToSignUp = 0;
        } 
        //it didnt find it
        else if (xhttp.readyState == 4 && xhttp.status == 201)
        	returnToSignUp = 1;
    };
    
    // Initiate connection
    xhttp.open("POST", "/checkrestemail", false);
    
    xhttp.setRequestHeader("Content-type","application/json");
    
    // Send request
    xhttp.send(JSON.stringify({param1:email}));

    return returnToSignUp;
}

function addNewRestaurant() {

	//getting the element from the page
	var name = document.getElementById('name').value;
	var cuisine = document.getElementById('cuisine').value;
	var address = document.getElementById('address').value;
	var email = document.getElementById('email').value;
	var opening = document.getElementById('opening').value;
	var opening = document.getElementById('price').value;
	var price = document.getElementById('price').value;
	var password = $("#passwordrest").val();

	var response = document.getElementById('response');
	var para = document.createElement("p");

    var xhttp = new XMLHttpRequest();
    
    // Define behaviour for a response
    xhttp.onreadystatechange = function() {
    
        if (xhttp.readyState == 4 && xhttp.status == 200) {

        	para.innerText = "Success!";
        	response.setAttribute("class", "responseTextSuccess");
			response.appendChild(para); 
        } 
    };
    
    // Initiate connection
    xhttp.open("POST", "/addnewrestaurant", true);
    
    xhttp.setRequestHeader("Content-type","application/json");
    
    // Send request
    xhttp.send(JSON.stringify({name1:name, cuisine1:cuisine, address1:address, email1:email, opening1:opening, price1:price, password1:password}));

    return;

}


