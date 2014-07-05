var express = require('express')
  , mongoskin = require('mongoskin')
  , bodyParser = require('body-parser');

var app = express();
app.use(bodyParser());

app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8020");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
    });

var dbConnect = require('./config/dbConnect');

var db = mongoskin.db(dbConnect.url, {safe:true});

app.param('collectionName', function(req, res, next, collectionName){
  req.collection = db.collection(collectionName);
  return next();
});

app.get('/', function(req, res, next) {
  res.send('please select a collection, e.g., /collections/messages');
});

app.get('/collections/:collectionName', function(req, res, next) {
  console.log("collectionName"+req.collection);
  req.collection.find().toArray(function(e, results){
    if (e) return next(e);
    res.send(results);
  });
});

app.post('/collections/:collectionName', function(req, res, next) {
  req.collection.insert(req.body, {}, function(e, results){
    if (e) return next(e);
    res.send(results);
  });
});

app.get('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.findById(req.params.id, function(e, result){
    if (e) return next(e);
    res.send(result);
  });
});

app.put('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.updateById(req.params.id, {$set:req.body}, {safe:true, multi:false}, function(e, result){
    if (e) return next(e);
    res.send((result===1)?{msg:'success'}:{msg:'error'});
  });
});

app.del('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.removeById(req.params.id, function(e, result){
    if (e) return next(e);
    res.send((result===1)?{msg:'success'}:{msg:'error'});
  });
});

app.listen(3000);
