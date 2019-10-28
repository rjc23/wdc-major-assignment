// ------------------------------------------------------- //
// ---- // ---- // server access variables // ---- // ---- //
// ------------------------------------------------------- //
var express = require('express');
var router = express.Router();

// -------------------------------------------------------- //
// ---- // ---- // for google login/signout // ---- // ---- //
// -------------------------------------------------------- //

var CLIENT_ID = '634525782579-m1jv4fs71n3nprika3kup2hg6kq4828m.apps.googleusercontent.com';
var {OAuth2Client} = require('google-auth-library');
var client = new OAuth2Client(CLIENT_ID);

// ----------------------------------------------------- //
// ---- // ---- // server-side variables // ---- // ---- //
// ----------------------------------------------------- //
var users = [
	{firstname:"Ryan", lastname: "Carmody", username:"Juan123", password:"coolsunit"}
	];

var restaurants = [];

var user;

var search_results = [
	{	Name:'Good Food',		Img:'images/sampleRestaurant01.jpeg',	Price:3,
		Cuisine:'Italian',		Location:'Adelaide CBD',						Average_Rating:4,
		Link: 'restaurant.html?id=GoodFood' },
	{	Name:'Divine Diner',	Img:'images/sampleRestaurant02.jpg',	Price:5,
		Cuisine:'Fish & Chips',		Location:'Adelaide CBD',					Average_Rating:5,
		Link: 'restaurant.html?id=FishAndChips' },
	{	Name:'Just Meh Cafe',	Img:'images/sampleRestaurant03.jpg',	Price:2,
		Cuisine:'Morning Tea',		Location:'Eastern Adelaide',				Average_Rating:3,
		Link: 'restaurant.html?id=MorningTea' },
	{	Name:'Jasmine Restautant',	Img:'images/sampleFood01.jpg',		price:4,
		Cuisine:'Indian',			Location:'Adelaide CBD',					Average_Rating:4,
		Link:'restaurant.html?id=JasmineRestaurant'
		},		
	{	Name:"Mama Bella's Pizzaria",	Img:'images/sampleFood02.jpg',		Price:2,
		Cuisine:'Italian',			Location:'Adelaide CBD',					Average_Rating:4,
		Link:'restaurant.html?id=MamaBellasPizzaria'
		},	
	{	Name:'The Burger Joint',	Img:'images/sampleFood03.jpg',		Price:2,
		Cuisine:'American',			Location:'Adelaide CBD',					Average_Rating:4,
		Link:'restaurant.html?id=TheBurgerJoint'
		},
	];

// --------------------------------------------- //
// ---- // ---- // server routes // ---- // ---- //
// --------------------------------------------- //

	//  GET home page
	router.get('/', function(req, res, next) {
		res.render('index', { title: 'Express' });
	});

	// GET search results - move results from server to client
	router.get('/getsearchresults', function(req, res, next) {
		// pull out parameters
			var query_cuisine = req.query.cuisine;
			var query_time = req.query.meal;
			var query_capacity = req.query.people

			var stars = req.query.stars;

		// transform parameters into appropriate form
			// transform stars into numeric form
			var query_stars;
			if(stars == "high") {
				query_stars = 4;
			}
			else {
				query_stars = 0;
			}

		// prepare query for database
			var query = "SELECT * FROM Restaurant " + 
						"WHERE Average_Rating >= ? AND No_Of_Bookings >= ?";
			var param = [ query_stars, query_capacity ];
			if(query_cuisine != 'null') {
				query = query + " AND Cuisine LIKE ?";
				
				param.push(query_cuisine);
			}
			if(query_time != 'null') {
				if(query_time == 'Breakfast')
					query = query + " AND Opening_Time LIKE '%Breakfast%'";
				else if(query_time == 'Lunch')
					query = query + " AND Opening_Time LIKE '%Lunch%'";
				else if(query_time == 'Dinner')
					query = query + " AND Opening_Time LIKE '%Dinner%'";
				
				param.push(query_time);
			}
			
			query = query + ";";
			
		// connect to database
			req.pool.getConnection(function(err, connection) {
				if(err) {
					throw err;
					res.json({});
				}
				
				connection.query(query, param, function(err, rows, fields) {
					connection.release();
					res.json(rows);
				});
				
			});
	});

	// GET trending (same as results)
	router.get('/gettrending', function(req, res, next) {
		
		// prepare query for database
			var query = "SELECT * FROM Restaurant;";
			var param = [];
			
		// connect to database
			req.pool.getConnection(function(err, connection) {
				if(err) {
					throw err;
					res.json({});
				}
				
				connection.query(query, param, function(err, rows, fields) {
					connection.release();
					// choose 3 random restaurants to send back
					var randomNum;
					var trending_results = [];
					var alreadyDisplayed = [-1, -1, -1];
					for(var i = 0; i < 3; i++) {
						randomNum = Math.floor(Math.random() * rows.length);
						
						// ensure all results are unqiue
						for(var j = 0; j < 3; j++) {
							while(alreadyDisplayed[j] == randomNum) {
								randomNum = Math.floor(Math.random() * rows.length);
							}
						}
						
						trending_results.push(rows[randomNum]);
						alreadyDisplayed[i] = randomNum;
						
					}
					res.json(trending_results);
				});
				
			});
	});

	// GET booking confirmation - (render confirmation page)
	router.get('/getbookingInfo', function(req, res, next) {
		// pull out parameters
			var query_bookingID = req.query.BookingID;
			
		// prepare commands for database
			var query = "SELECT * FROM Booking B INNER JOIN Restaurant R ON B.Restaurant_ID = R.Restaurant_ID INNER JOIN User U ON B.User_ID = U.User_ID WHERE Booking_ID = ?;";
			var param = [ query_bookingID ];
			
		// connect to database - find user ID, THEN find restID, THEN insert booking to DB
			req.pool.getConnection(function(err, connection) {
				if(err) {
					throw err;
					res.sendStatus(500);
				}
				
				// find userID
				connection.query(query, param, function(err, rows, fields) {
					connection.release();
					res.json(rows);
				});
			});
	});
	
	// POST booking confirmation - send to database
	router.post('/insertBooking', function(req, res, next) {
		if(req.session.user == null || req.session.user == undefined) {
			res.sendStatus(403);
		}
		else {
			// open up request body
				var query_User = req.session.user;
				var query_Rest = decodeURIComponent(req.body.Rest);
				var add_Date = req.body.Date;
				var add_Time = req.body.Time;
				var add_Guests = req.body.Guests;
				var add_User;
				var add_Rest;
			
			// prepare commands for database
				var query_userID = "SELECT User_ID FROM User WHERE UserName = ?;";
				var param_1 = [ query_User ];
				
				var query_restID = "SELECT Restaurant_ID, Opening_Time FROM Restaurant WHERE Name = ?;";
				var param_2 = [ query_Rest ];
				
				var insert_booking = "INSERT INTO Booking (Booking_Date, Booking_Time, Party_size, User_ID, Restaurant_ID) VALUES (?, ?, ?, ?, ?);";
				var param_3 = [ add_Date, add_Time, add_Guests ];
				
				var query_booking = "SELECT Booking_ID FROM Booking " +
					"WHERE Booking_Date = ? AND Booking_Time = ? AND Party_size = ? AND User_ID = ? AND Restaurant_ID = ?" + ";";
				// nb: param_4 is the same as param_3
				
			// connect to database - find user ID, THEN find restID, THEN insert booking to DB
				req.pool.getConnection(function(err, connection) {
					if(err) {
						throw err;
						res.sendStatus(500);
					}
					
					// find userID
					connection.query(query_userID, param_1, function(err, rows_1, fields) {
						connection.release();
						param_3.push(rows_1[0].User_ID);
						
						// re-connect to database
							req.pool.getConnection(function(err, connection) {
								if(err) {
									throw err;
									res.sendStatus(500);
								}
								
								// find restID
								connection.query(query_restID, param_2, function(err, rows_2, fields) {
									connection.release();
									param_3.push(rows_2[0].Restaurant_ID);
									
									// if we're using the Quick Booking, use the Opening_Time to get a slot
									if(add_Time == "Quick") {
										// set date to today
										var temp = new Date();
										param_3[0] = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate());
										
										// set time
										if(rows_2[0].Opening_Time.includes("Breakfast") == true) {
											param_3[1] = "9:00 AM";
										}
										else if(rows_2[0].Opening_Time.includes("Lunch") == true) {
											param_3[1] = "9:00 AM";
										}
										else if(rows_2[0].Opening_Time.includes("Dinner") == true) {
											param_3[1] = "9:00 AM";
										}
										else {
											res.sendStatus(400);
										}
										
										// set no. people to 2
										param_3[2] = 2;				
									}
									
									// re-connect to database
										req.pool.getConnection(function(err, connection) {
											if(err) {
												throw err;
												res.sendStatus(500);
											}
											
											// insert booking to database
											connection.query(insert_booking, param_3, function(err, rows_3, fields) {
												connection.release();
												
												// grab booking no.
													req.pool.getConnection(function(err, connection) {
														if(err) {
															throw err;
															res.sendStatus(400);
														}
														
														// insert booking to database
														connection.query(query_booking, param_3, function(err, rows_4, fields) {
															connection.release();
															res.json(rows_4[0]);
														});
													});
											});
										});
								});
							});
					});
				});	
		}
	});
	
	// POST booking confirmation - send to database
	router.post('/insertReview', function(req, res, next) 

	{
		if(req.session.user == null || req.session.user == undefined) {
			res.sendStatus(403);
		}
		else {
			// open up request body
				var query_User = req.session.user;
				var query_Rest = req.body.restaurant;
				var add_stars = req.body.stars;
				var add_review = req.body.review;
				var add_User;
				var add_Rest;
			
			// prepare commands for database
				var query_userID = "SELECT User_ID FROM User WHERE UserName = ?;";
				var param_1 = [ query_User ];
				
				var query_restID = "SELECT Restaurant_ID FROM Restaurant WHERE Name = ?;";
				var param_2 = [ query_Rest ];
				
				var insert_review = "INSERT INTO Reviews (Ratings, Comments, User_ID, Restaurant_ID) VALUES (?, ?, ?, ?);";
				var param_3 = [ add_stars, add_review ];
				
			// connect to database - find user ID, THEN find restID, THEN insert booking to DB
				req.pool.getConnection(function(err, connection) {
					if(err) {
						throw err;
						res.sendStatus(500);
					}
					
					// find userID
					connection.query(query_userID, param_1, function(err, rows_1, fields) {
						connection.release();
						param_3.push(rows_1[0].User_ID);
						
						// re-connect to database
							req.pool.getConnection(function(err, connection) {
								if(err) {
									throw err;
									res.sendStatus(500);
								}
								
								// find restID
								connection.query(query_restID, param_2, function(err, rows_2, fields) {
									connection.release();
									param_3.push(rows_2[0].Restaurant_ID);
									
									// re-connect to database
										req.pool.getConnection(function(err, connection) {
											if(err) {
												res.sendStatus(500);
											}
											
											connection.query(insert_review, param_3, function(err, rows_2, fields) {
											if(err) {
												res.sendStatus(201);
											}
												res.sendStatus(200);
											});
										});
								});
							});
					});
				});	
		}
	});



	// DEBUG - check booking table
	router.get('/checkBookings', function(req, res, next) {
		// prepare commands for database
			var query = "SELECT * FROM Booking;";
			var param = [ ];
			
		// connect to database - find user ID, THEN find restID, THEN insert booking to DB
			req.pool.getConnection(function(err, connection) {
				if(err) {
					throw err;
					res.sendStatus(500);
				}
				
				// find userID
				connection.query(query, param, function(err, rows, fields) {
					connection.release();
					res.sendStatus(200);
				});
			});
	});

	
	
	// GET restaurant page - navigate to page & populate with restaurant's database info
	router.get('/getrestaurantinfo', function(req, res, next) {
		// prepare query from database
			var query_name = req.query.id;
			var query = "SELECT * FROM Restaurant WHERE Name = ?;";
		
		// connect to database
			req.pool.getConnection(function(err, connection) {
				if(err) {
					throw err;
					res.json({});
				}
				
				connection.query(query, [query_name], function(err, rows, fields) {
					connection.release();
					res.json(rows);
				});
				
			});
	});
	
	// Get restaurant address
   	router.get('/Getrestaurantaddress.json', function(req, res, next) {
      var param = req.query.filter;
      var query = "SELECT Location, Restaurant_ID FROM Restaurant;";
      
      // connect to database
      req.pool.getConnection(function(err, connection) {
			if(err) {
				res.sendStatus(402);
				throw err;
				res.json({});
			}

			connection.query(query, [param], function(err, rows, fields) {
				connection.release();
				res.json(rows);
			});  
      	});
    });

   	// Get restaurant address
   	router.get('/Coordinatelookup', function(req, res, next) {
		var param = req.query.filter;
		var query = "SELECT Name,Latitude,Longitude FROM Restaurant;";

		// connect to database
		req.pool.getConnection(function(err, connection) {
			if(err) {
			    res.sendStatus(402);
			    throw err;
			    res.json({});
			}
		 
			connection.query(query, [param], function(err, rows, fields) {
			    connection.release();
			    res.json(rows);
			});  
		});
    });

    // insert coodinates into database
   	router.get('/insertCoordinates', function(req, res, next) {
   	  console.log("entered /insterCoordinates");
      var Longitude = req.query.Longitude;
      var Latitude = req.query.Latitude;
      var Location = req.query.Restaurant_ID;
      var query = "update Restaurant set Longitude = ?, Latitude = ? where Restaurant_ID = ?;";
      
		// connect to database
		req.pool.getConnection(function(err, connection) {
			if(err) {
			    res.sendStatus(402);
			    throw err;
			    res.json({});
			}
			 
			connection.query(query, [Longitude, Latitude, Location], function(err, rows, fields) {
			    connection.release();
			    res.json(rows);
			});  
		});
    });

           	// Coordinate Lookup
   	router.get('/Reviewlookup', function(req, res, next) {
		var name = req.query.name;

		var query = "SELECT u.UserName, r.Comments, r.Ratings\
					FROM Reviews r\
					JOIN User u\
					ON r.User_ID = u.User_ID\
					WHERE Restaurant_ID = (SELECT Restaurant_ID FROM Restaurant WHERE Name = ?);";

		// connect to database
		req.pool.getConnection(function(err, connection) {
			if(err) {
			    res.sendStatus(402);
			    throw err;
			    res.json({});
			}
		 
			connection.query(query, [name], function(err, rows, fields) {
			    connection.release();
			    res.json(rows);
			});  
		});
    });
	
           	// Coordinate Lookup
   	router.get('/Reviewlookup', function(req, res, next) {
		var name = req.query.name;

		var query = "SELECT u.UserName, r.Comments, r.Ratings\
					FROM Reviews r\
					JOIN User u\
					ON r.User_ID = u.User_ID\
					WHERE Restaurant_ID = (SELECT Restaurant_ID FROM Restaurant WHERE Name = ?);";

		// connect to database
		req.pool.getConnection(function(err, connection) {
			if(err) {
			    res.sendStatus(402);
			    throw err;
			    res.json({});
			}
		 
			connection.query(query, [name], function(err, rows, fields) {
			    connection.release();
			    res.json(rows);
			});  
		});
    });
    
   // insert review into database
   router.post('/insertReview', function(req, res, next) {
      
      var Restaurant_Name = req.body.restaurant;
      var Restaurant_ID;
      var query1 = 'SELECT Restaurant_ID FROM Restaurant WHERE Name = ?;';


      	// connect to database
		req.pool.getConnection(function(err, connection) {
			if(err) {
			    res.sendStatus(402);
			    throw err;
			    console.log("err:" + err);
			    res.json({});
			}
			 
			connection.query(query1, [Restaurant_Name], function(err, rows, fields) {
			    connection.release();
			    Restaurant_ID = rows[0].Restaurant_ID;
			    console.log(rows);

				var User_ID = req.body.user;
		      	var Comments = req.body.review;
		      	var Ratings = req.body.stars;

		      	    var query2 = "INSERT INTO Reviews (User_ID, Restaurant_ID, Comments, Ratings)\
					VALUES (?, ?, ?, ?);"
      
				// connect to database
				req.pool.getConnection(function(err, connection) {
					if(err) {
					    res.sendStatus(402);
					    throw err;
					    console.log("err:" + err);
					    res.json({});
					}
					 
					connection.query2(query, [User_ID, Restaurant_ID, Comments, Ratings], function(err, rows, fields) {
					    connection.release();
					    console.log(rows);
					    res.json(rows);
					});  
				});
			});  
		});

    });
	// test access database
	router.get('/Restaurant.json', function(req, res, next) {
		var param = req.query.filter;
		var query = "SELECT * FROM Restaurant;";
		
		// connect to database
		req.pool.getConnection(function(err, connection) {
			if(err) {
				throw err;
				res.json({});
			}
			
			connection.query(query, [param], function(err, rows, fields) {
				connection.release();
				res.json(rows);
			});
			
		});

	});	

// -------------------------------------------------------------//
// ---- // ---- // User Sign Up / Log-in routes // ---- // ---- //
// ------------------------------------------------------------ //
router.post('/checkusername', function(req, res, next){

	var query_name = req.query.id;
	var query = "SELECT * FROM User WHERE UserName = ?";
	var userNamesearch = req.body.param1;

// connect to database
	req.pool.getConnection(function(err, connection) {
		if(err) {
			throw err;
			res.json({});
		}
		
		connection.query(query, [userNamesearch], function(err, rows, fields) {
			connection.release();
			if(rows.length == 0)
			{
				res.sendStatus(201);
			}
			else
				res.sendStatus(200);
		});
	});
});

router.post('/addnewuser', function(req, res, next)
{
	// prepare query from database
	var query_name = req.query.id;
	var query = "insert into User (FirstName, LastName, Phone_No, Favourites, SocialMedia_ID, Password, UserName, Email) Values (?, ?, ?, null, 123, ?, ?, ?);";

	// var pass = req.body.password1;
	var hash = req.body.password1.hashCode();

	// connect to database
	req.pool.getConnection(function(err, connection) 
	{
		if(err) {
			throw err;
		}
		
		connection.query(query, [req.body.fname1, req.body.lname1, req.body.phonenum, hash, req.body.username1, req.body.email1], function(err, rows, fields) 
		{
			connection.release();
			res.send();
		});	
	});
});

router.get('/getusers', function(req, res, next) {
	res.json(users);
});



router.post('/login', async function(req, res) {
    
    user = null;
    
    // If valid session present
    if(req.session.user !== undefined) 
    {
        user = req.session.user;
    }
    // If login details present, attempt login 
    else if(req.body.username !== undefined && req.body.password !== undefined)
    {
        //search database
        var query_name = req.query.id;
		var query = "SELECT * FROM User WHERE UserName = ?";
		var un = req.body.username;
	
	// connect to database
		req.pool.getConnection(function(err, connection) {
			if(err) {
				throw err;
				res.json({});
			}
			
			connection.query(query, [un], function(err, rows, fields) {
				connection.release();
				if(rows.length == 0)
				{
					res.sendStatus(401);
				}
				else if (rows[0].Password == req.body.password.hashCode())
				{
	                req.session.user = rows[0].UserName;
	                req.session.name = rows[0].FirstName;
	                user = un;
	                res.sendStatus(200);
				}
				else if(rows[0].Password !== req.body.password)
				{
					res.sendStatus(401);
				}
			});
			
		});

        
    // If google login token present
    } 
    else if(req.body.idtoken !== undefined) {

    	var found = false;
    
        // Verify google ID token
        const ticket = await client.verifyIdToken({
            idToken: req.body.idtoken,
            audience: CLIENT_ID
        }).catch(console.error);
        
        // Get user data from token
        const payload = ticket.getPayload();
        
        // Get user's Google ID
        const userid = payload['sub'];

        //is the user in the database with that googleID?
        
	// prepare query from database
		var query_name = req.query.id;
		var query1 = "SELECT * FROM User WHERE SocialMedia_ID = ?";
		var userIDsearch = payload['sub'];
	
	// connect to database
		req.pool.getConnection(function(err, connection) {
			if(err) {
				throw err;
				res.json({});
			}
			
			connection.query(query1, [userIDsearch], function(err, rows, fields) {
				connection.release();
				if(rows.length !== 0)
				{
					found = true;

					//var storage = JSON.parse(row);
					req.session.user = rows[0].UserName;
					req.session.name = rows[0].FirstName;
					user = rows[0].UserName;
					res.sendStatus(200);
				}
				else
				{
					//three random numbers
		        	var item1 = Math.floor(Math.random() * 9);
					var item2 = Math.floor(Math.random() * 9);
					var item3 = Math.floor(Math.random() * 9);

					//email
					var fname = payload['given_name'];
					var lname = payload['family_name'];
					var usern =  fname+item1+item2+item3;
					var phonen = "0000000000";
					var passw = "SuperSecretPassword";
					var email = payload['email'];
					var userID = payload['sub'];
					console.log("USERID IS:"+ userID);

					// prepare query from database
					var query_name = req.query.id;
					var query = "insert into User (FirstName, LastName, Phone_No, Favourites, SocialMedia_ID, Password, UserName, Email) Values (?, ?, ?, null, ?, ?, ?, ?);";

					// connect to database
					req.pool.getConnection(function(err, connection) 
					{
						if(err) {
							throw err;
						}
						
						connection.query(query, [fname, lname, phonen, userID, passw.hashCode(), usern, email], function(err, rows, fields) 
						{
							connection.release();
						});	
					});

					req.session.user = usern;
					req.session.name = fname;
					user = usern;
					res.sendStatus(200);
				}
			});
		});
    }
});

router.post('/logout', function(req, res) {
    
    // If valid session present, unset user.
    if(req.session.user !== undefined) {
        delete req.session.user;
        user = undefined;
    }

    res.sendStatus(200);
    
});

// ------------------------------------------------------------------ //
// ---- // ---- // Restaurant Sign Up / Log-in routes // ---- // ---- //
// ------------------------------------------------------------------ //


router.post('/checkrestemail', function(req, res, next){

	var query_name = req.query.id;
	var query = "SELECT * FROM Restaurant WHERE Email = ?";
	var restEmail = req.body.param1;

// connect to database
	req.pool.getConnection(function(err, connection) {
		if(err) {
			throw err;
			console.log("err:" + err);
			res.json({});
		}
		
		connection.query(query, [restEmail], function(err, rows, fields) {
			connection.release();
			if(rows.length == 0)
			{
				//not found
				res.sendStatus(201);
			}
			else
			{
				res.sendStatus(200);
			}
		});
	});
});

router.post('/addnewrestaurant', function(req, res, next){

	var name = req.body.name1;
	var cuisine = req.body.cuisine1;
	var address = req.body.address1;
	var opening = req.body.opening1;
	var password = req.body.password1;
	var email = req.body.email1;
	var price = req.body.price1;
	// prepare query from database
	var query_name = req.query.id;
	var query = "INSERT INTO Restaurant (Name, Cuisine, Location, Average_Rating, No_Of_Bookings, Opening_Time, Password, Email, Price, Longitude, Latitude, Image_URL) Values (?, ?, ?, 5, 0, ?, ?, ?, ?, 0.0, 0.0, null);";

	// connect to database
	req.pool.getConnection(function(err, connection) 
	{
		if(err) {
			throw err;
		}
		
		connection.query(query, [name, cuisine, address, opening, password, email, price], function(err, rows, fields) 
		{
			connection.release();
			res.sendStatus(200);
		});	
	});
});

router.get('/getrestaurants', function(req, res, next) {
		var query_name = req.query.id;
		var query = "SELECT * FROM Restaurant";
		var userIDsearch;
	
	// connect to database
		req.pool.getConnection(function(err, connection) {
			if(err) {
				throw err;
				console.log("err:" + err);
				res.json({});
			}
			
			connection.query(query, [], function(err, rows, fields) {
				connection.release();
				res.json(rows);
			});
			
		});
});

// ------------------------------------------------------- //
// ---- // ---- // User Information Routes // ---- // ---- //
// ------------------------------------------------------- //

router.get('/getuser', function(req, res, next) {

	if(user !== undefined && user !== null)
		res.json(req.session.user);
	else
		res.sendStatus(201);
});

router.get('/getname', function(req, res, next) {

	if(user !== undefined && user !== null)
		res.json(req.session.name);
	else
		res.sendStatus(201);
});


//get info user info from dbase (this is for Ryan)
router.get('/getuserinfodbase', function(req, res, next) {
	// prepare query from database
		var query_name = req.query.id;
		var query = "SELECT * FROM User";
		var userIDsearch = "1234";
	
	// connect to database
		req.pool.getConnection(function(err, connection) {
			if(err) {
				throw err;
				res.json({});
			}
			
			connection.query(query, [userIDsearch], function(err, rows, fields) {
				connection.release();
				res.json(rows);
			});
			
		});
});

//get info user info from dbase (this is for Ryan)
router.get('/getuserbookings', function(req, res, next) {
	// prepare query from database
		var query_name = req.query.id;
		var query = "select Restaurant.Name As Restaurant_Name, Restaurant.Location as Restaurant_Address, Booking.Booking_ID, Booking.Booking_Date, Booking.Party_size, Booking.Booking_Time from Restaurant inner join Booking on Restaurant.Restaurant_ID = Booking.Restaurant_ID inner join User on User.User_ID = Booking.User_ID where UserName = ?;";
		var user1 = req.session.user;

	// connect to database
		req.pool.getConnection(function(err, connection) {
			if(err) {
				throw err;
				res.json({});
			}
			
			connection.query(query, [user1], function(err, rows, fields) {
				connection.release();
				
				if(rows.length == 0)
				{
					res.sendStatus(201);
				}
				else
				{
					res.json(rows);
				}
			});
		});
});

//get info user info from dbase (this is for Ryan)
router.get('/getuserreviews', function(req, res, next) {
	// prepare query from database
		var query_name = req.query.id;
		var query = "select Reviews.Comments, Reviews.Ratings, Restaurant.Name As Restaurant_Name from Restaurant inner join Reviews on Restaurant.Restaurant_ID = Reviews.Restaurant_ID inner join User on User.User_ID = Reviews.User_ID where User.UserName = ?;";
		var user1 = req.session.user;//req.session.user;

	// connect to database
		req.pool.getConnection(function(err, connection) {
			if(err) {
				throw err;
				res.json({});
			}
			
			connection.query(query, [user1], function(err, rows, fields) {
				connection.release();
				
				if(rows.length == 0)
				{
					res.sendStatus(201);
				}
				else
				{
					res.json(rows);
				}
			});
		});
});

/* // drop a booking
router.get('/dropBooking', function(req, res, next) {
	// prepare query from database
		var query_1 = "DELETE FROM Booking WHERE Booking_ID = ?;";
		var query_2 = "SELECT * FROM Booking WHERE Booking_ID = ?;";
		var param = [ req.query.id ];

	// connect to database
		req.pool.getConnection(function(err, connection) {
			if(err) {
				throw err;
				console.log("err:" + err);
				res.sendStatus(500);
			}
			
			connection.query(query_1, param, function(err, rows_1, fields) {
				connection.release();
				
				// re-connect to database
					req.pool.getConnection(function(err, connection) {
						if(err) {
							throw err;
							console.log("err:" + err);
							res.sendStatus(500);
						}
						
						connection.query(query_2, param, function(err, rows_2, fields) {
							connection.release();
							// send back current bookings
							res.json(rows_2);
						});
					});
			});
		});
}); */

// change personal details
router.post('/changeDetails', function(req, res, next){
	var query_1 = "UPDATE User SET Phone_No = ? WHERE UserName = ?;";
	var query_2 = "UPDATE User SET Email = ? WHERE UserName = ?;";
	var query_3 = "SELECT Phone_No, Email FROM User WHERE UserName = ?;";
	var user = req.session.user;
	
	// connect to database
		req.pool.getConnection(function(err, connection) {
			if(err) {
				throw err;
				res.json({});
			}
			
			connection.query(query_1, [req.body.Phone, user ], function(err, rows_1, fields) {
				connection.release();
				
				// re-connect to database
					req.pool.getConnection(function(err, connection) {
						if(err) {
							throw err;
							res.json({});
						}
						
						connection.query(query_2, [req.body.Email, user ], function(err, rows_2, fields) {
							connection.release();
							// get new details
								req.pool.getConnection(function(err, connection) {
									if(err) {
										throw err;
										res.json({});
									}
									
									connection.query(query_3, [ user ], function(err, rows_3, fields) {
										connection.release();
										res.json(rows_3)
									});
									
								});
						});
						
					});
			});
			
		});
});


router.post('/saveSearch', function(req, res, next) {

	req.session.date = req.body.date1;
	req.session.time = req.body.time1;
	req.session.people = req.body.people1;
	req.session.cuisine = req.body.cuisine1;

	res.send();
});

router.get('/getPreferences', function(req, res, next) {

	var arr = [];
	arr.push({
		date:req.session.date,
		time:req.session.time,
		people:req.session.people,
		cuisine:req.session.cuisine
	});
	res.json(arr);
});


// ---------------------------------------------------------- //
// ---- // ---- // Super Secret Hash Function // ---- // ---- //
// ---------------------------------------------------------- //

String.prototype.hashCode = function() {
    var hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}



// ----------------------------------------------- //
// ---- // ---- // end of index.js // ---- // ---- //
// ----------------------------------------------- //
module.exports = router;
