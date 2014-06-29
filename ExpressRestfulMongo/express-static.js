var express = require('express')
  , mongoskin = require('mongoskin')
  , bodyParser = require('body-parser')

var http = require("http");
     path = require("path");
    

var app = express();

//app.set('views',__dirname+'/views');

app.use(express.static(path.join(__dirname,'public')));

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
})

app.listen(3001);
