
//this function will submit a review to the database
//it gets the value of the stars and review from the input boxes
//it gets the value of the restaurant from the URL.
//it will then send a JSON object to the server
function submitReview()
{

	var stars1 = document.getElementById('reviewStars').value;
	var review1 = document.getElementById('reviewText').value;
	var restaurant1 = getUrlVars()["id"];

    var decode = decodeURI(restaurant1);


	var response = document.getElementById('response');
	var para = document.createElement("p");

	var xhttp = new XMLHttpRequest();
    
    // Define behaviour for a response
    xhttp.onreadystatechange = function() {
    
        if (this.readyState == 4 && this.status == 200) {
        	//your review has been submitted, thank you!
			while (response.firstChild) 
			{
    			response.removeChild(response.firstChild);
			}

			para.innerText = "Thanks for leaving your feedback!";
			response.appendChild(para);
        } 
        else if (this.readyState == 4 && this.status == 201)
        {
        	//clear response (incase they had previous errors)
			while (response.firstChild) 
			{
    			response.removeChild(response.firstChild);
			}

			para.innerText = "You've already left a review for this site";
			response.appendChild(para);
        }
	    
	else if(this.readyState == 4 && this.status == 403)
        {
            //clear response (incase they had previous errors)
            while (response.firstChild) 
            {
                response.removeChild(response.firstChild);
            }

            para.innerText = "You must be signed in to leave a review";
            response.appendChild(para);
        }
    };
    
    // Initiate connection
    xhttp.open("POST", "/insertReview", true);
    
    xhttp.setRequestHeader("Content-type","application/json");

    // Send request
    var toSend = JSON.stringify({stars:stars1, review:review1, restaurant:decode});
    xhttp.send(toSend);

}
