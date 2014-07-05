var express = require('express')
  , mongoskin = require('mongoskin')
  , bodyParser = require('body-parser')

var http = require("http"),
     path = require("path");
     
var session = require("express-session");
var cookieParser = require("cookie-parser"); 
var MongoStore = require('connect-mongo')(session);
var passwordHash = require('password-hash');

var app = express();

app.use(bodyParser());
app.use(cookieParser());
app.use(session( {"secret":"this is a secret",
					   saveUninitialized: true,
	                   resave: true,
	                   maxAge: 108000,
	                   store: new MongoStore({
	                    db: 'test',
	                    host: '127.0.0.1',
	                    port: 27017,
	                    collection: 'session',
	                    auto_reconnect:true
	                   }) } ));
app.use(express.static(path.join(__dirname,"public")));

app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
    });


var db = mongoskin.db('mongodb://@localhost:27017/mydb', {safe:true});



app.get("/htmlContent",function(req,res,next){
    var html=["<h1>Displaying Header H1</h1>",
              "<p>ExpressJs wonderful</p>"].join("\n");
    res.send(html);
});



app.post("/login",function(req,res,next){
	if(checkCredentials(req)){
		req.session.regenerate(function(){
			req.session.username=req.body.username;
			res.send(req.session);
		});
	}
	else{
		res.send("Username and Password is wrong");
	}
});

app.get("/logout",function(req,res,next){
	if(req.session){
		req.session.destroy();
		res.redirect("/login.html");
	}
	else{
		res.redirect("/login.html");
	}
	
});

var validationError = "";

app.post("/signup",function(req,res,next){
	if(validate(req)){
		req.collection = db.collection("profile");
		req.body.password = passwordHash.generate(req.body.password);
		req.collection.find({$or: [{ mobilenumber: req.body.mobilenumber},{emailid:req.body.emailid}]}).toArray(function(e, result){
		    if (e) return next(e);
		    if(Object.keys(result).length===0){
				    req.collection.insert(req.body, {} ,function(e, results){
					    if (e) return next(e);
					    res.send(results);
		   		});
	   		}
	   		else{
	   			res.send("already exists");
	   		}
		});
		
	 }
	 else{
	 	res.send(validationError);
	 }
});
// app.get("/hello",function(req,res,next){
	// console.log(req.session.username);
	// res.send(req.session.username);
// });

function validate(req){
	var mobExp = /[1-9]{1}[0-9]{9}$/;
	var alphaExp = /^[a-zA-Z]+$/;
	var emailExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if(mobExp.test(req.body.mobilenumber)===false){
		validationError = "Mobile Number is invalid";
	}
	else if(alphaExp.test(req.body.fullname)===false){
		validationError = "Full name is invalid";
	}
	else if(emailExp.test(req.body.emailid)===false){
		validationError = "Email Id is invalid";
	}
	if(validationError===""){
		return true;
	}
	else{
	  return false;
	 }
}

function checkCredentials(req){
	if(req.body.username==="siva" && req.body.password==="siva"){
		return true;
	}
	return false;
}

app.listen(3002);
