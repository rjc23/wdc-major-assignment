// ------------------------------------------ //
// ---- // ---- // Sign In/Up // ---- // ---- //
// ------------------------------------------ //
	function signUp(){

		var cont = 0;

		var response = document.getElementById('response');

		//clear response (incase they had previous errors)
		while (response.firstChild) 
		{
    		response.removeChild(response.firstChild);
		}

		var para = document.createElement("p");
		var para1 = document.createElement("p");
		var para2 = document.createElement("p");
		var para3 = document.createElement("p");
		var para4 = document.createElement("p");
		var para5 = document.createElement("p");
		var para6 = document.createElement("p");

		var fname = document.getElementById('fname').value;
		var lname = document.getElementById('lname').value;
		var username = document.getElementById('username').value;
		var phone = document.getElementById('phonenum').value;
		var email = document.getElementById('email').value;

		if(fname.length == 0)
		{
			para.innerText = "Please enter your First Name";
			response.appendChild(para); 
			cont++;
		}

		if(lname.length == 0)
		{
			para1.innerText = "Please enter your Last Name";
			response.appendChild(para1); 
			cont++;
		}

		if(phone.length < 8)
		{
			para5.innerText = "Please enter a valid Phone Number";
			response.appendChild(para5); 
			cont++;
		}

		if(email.length == 0)
		{
			para6.innerText = "Please enter your Email";
			response.appendChild(para6); 
			cont++;
		}

		//if check username doesn't exist, keep going, else display message and return
		if(checkUsername() == 0){
			para2.innerText = "That username already exists";
			response.appendChild(para2);
			cont++;
		}

		//if passwords are the same, keep going, else display message and return
		var password = $("#password").val();
    	var confirmPassword = $("#rpassword").val();

    	if(password.length < 8)
    	{
    		para3.innerText = "Password must be 8 or more characters/symbols long";
			response.appendChild(para3);
			cont++;
    	}

    	if (password != confirmPassword)
    	{
    		para4.innerText = "Your password's don't match!";
		response.appendChild(para4);
		cont++;
    	}

    	//did we get an error? If so, DONT push the information to the server
    	if(cont > 0)
    		return;

    	addNewUser();

    	return;

	}

	function checkUsername() {

		var username = document.getElementById('username').value;
		var returnToSignUp = 1;

	    var xhttp = new XMLHttpRequest();
        
        // Define behaviour for a response
        xhttp.onreadystatechange = function() {
        
            if (xhttp.readyState == 4 && xhttp.status == 200) {
            	returnToSignUp = 0;
            } 
            else if (xhttp.readyState == 4 && xhttp.status == 201)
            	returnToSignUp = 1;
        };
        
        // Initiate connection
        xhttp.open("POST", "/checkusername", false);
        
        xhttp.setRequestHeader("Content-type","application/json");
        
        // Send request
        xhttp.send(JSON.stringify({param1:username}));

        return returnToSignUp;
	}

	function addNewUser() {

		var username = document.getElementById('username').value;
		var fname = document.getElementById('fname').value;
		var lname = document.getElementById('lname').value;
		var phone = document.getElementById('phonenum').value;
		var email = document.getElementById('email').value;
		var password = $("#password").val();

		var response = document.getElementById('response');
		var para = document.createElement("p");

	    var xhttp = new XMLHttpRequest();
        
        // Define behaviour for a response
        xhttp.onreadystatechange = function() {
        
            if (xhttp.readyState == 4 && xhttp.status == 200) {

            	para.innerText = "Success! Click the 'Sign In' button in the top right to sign in";
            	response.setAttribute("class", "responseTextSuccess");
				response.appendChild(para); 
            } 	
        };
        
        // Initiate connection
        xhttp.open("POST", "/addnewuser", true);
        
        xhttp.setRequestHeader("Content-type","application/json");
        
        // Send request
        xhttp.send(JSON.stringify({fname1:fname, lname1:lname, phonenum: phone, email1: email, username1:username, password1:password}));

        return;

	}
