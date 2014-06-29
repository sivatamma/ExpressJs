var express = require('express')
  , mongoskin = require('mongoskin')
  , bodyParser = require('body-parser')

var app = express()
app.use(bodyParser())

app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
    });

var db = mongoskin.db('mongodb://@localhost:27017/mydb', {safe:true})

app.param('collectionName', function(req, res, next, collectionName){
  console.log("db."+collectionName)
  req.collection = db.collection(collectionName);
  return next();
})

app.get('/', function(req, res, next) {
  res.send('please select a collection, e.g., /collections/messages')
})

app.get('/collections/:collectionName', function(req, res, next) {
  console.log("collectionName"+req.collection);
  req.collection.find().toArray(function(e, results){
    if (e) return next(e)
    res.send(results)
  })
})

app.post('/collections/:collectionName', function(req, res, next) {
  req.collection.insert(req.body, {}, function(e, results){
    if (e) return next(e)
    res.send(results)
  })
})

app.get('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.findById(req.params.id, function(e, result){
    if (e) return next(e)
    res.send(result)
  })
})

app.put('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.updateById(req.params.id, {$set:req.body}, {safe:true, multi:false}, function(e, result){
    if (e) return next(e)
    res.send((result===1)?{msg:'success'}:{msg:'error'})
  })
})

app.del('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.removeById(req.params.id, function(e, result){
    if (e) return next(e)
    res.send((result===1)?{msg:'success'}:{msg:'error'})
  })
})

var i,j,result;
/* search and filter app*/
app.route("/searchFilterApp")
.all(function(req,res,next){
	console.log("db.");
	req.usersCollection = db.collection("users");
	return next();
})
.get(function(req,res,next){
	result=[];
	req.usersCollection.find().toArray(function(e, results){
			if (e) return next(e)
		if(req.query.searchKey && req.query.filterKey){
			for(i=0,j=results.length;i<j;i++){
				 if((results[i].priority)===req.query.filterKey){
				 	 if((results[i].name).indexOf(req.query.searchKey)!=-1){
					 	result.push(results[i]);
					 }		
				 }
			}
		    res.send(result);
		}
		else if(req.query.filterKey){
			for(i=0,j=results.length;i<j;i++){
				 if((results[i].priority)===req.query.filterKey){
					 result.push(results[i]);			
				 }
			}
		    res.send(result);
		}
		else if(req.query.searchKey){
			for(i=0,j=results.length;i<j;i++){
				 if((results[i].name).indexOf(req.query.searchKey)!=-1){
					 result.push(results[i]);			
				 }
			}
		    res.send(result);
		}
		else{
		    res.send(results);
		}
	})
	
	
})	

app.listen(3000)