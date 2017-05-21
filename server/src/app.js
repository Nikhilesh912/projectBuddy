var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

//var urlencodedParser = bodyParser.urlencoded({
//  extended: true
//});
//
//var jsonParser = bodyParser.json();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/login/', function (req, res) {
    console.log('login GET')
    res.send('Yay')
})

app.post('/login/', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  console.log(req.body)
  userAuth(username, password,function(result){
    var resData = {}


    if(result == true){
      resData.login = "true"
      }
    else{
      resData.login = "false"
      }
      res.send(JSON.stringify(resData))
  })
});


app.post('/register/', function (req, res) {
  userCreation(req.body.username, req.body.password, req.body.email,
        function(success){
            var resData = {}
            if(success){
                resData.inserted = true
                res.send(JSON.stringify(resData))
            }
            else{
                resData.inserted = false
                res.send(JSON.stringify(resData))
            }
    })
});

app.listen(8081, function () {
  console.log('Example app listening on port 8081...!')
});


var url = 'mongodb://localhost:27017/projectBuddy';

var userAuth = function(username, password,callback){
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);

       var cursor = db.collection('users').find({"username" : username});
          cursor.each(function(err, doc) {
             assert.equal(err, null);
             if (doc != null) {
                console.log("document found");
                 if(doc.username == username && doc.password == password)
                   callback(true);
                 else
                  callback(false);
             } else {
                console.log("document");
             }
          });
      db.close();
    });
}

var userCreation = function(username, password, email, callback){
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
       db.collection('users').insert({"username": username, "password" : password, "email": email},
        function(err, doc) {
//          assert.equal(err, null);
             if (err) {
                console.log("insert unsuccessful");
                callback(false)
             }
             else{
                console.log("insert successful");
                callback(true);
             }
          });
      db.close();
    });
}
