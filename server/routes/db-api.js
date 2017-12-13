var express = require('express');
var router = express.Router();

// const checkJwt = require('../auth').checkJwt;
const fetch = require('node-fetch');

// simple API call, no authentication or user info
// router.get('/unprotected', function(req, res, next) {
//
//   req.db.collection('max_todo').find().toArray(function(err, results) {
//     if (err) {
//       next(err);
//     }
//
//     res.json({
//       todos: results
//     });
//   });
//
// });

router.get('/', function(req, res, next) {
  res.json({'message': 'db api...'});
});

// checkJwt middleware will enforce valid authorization token
router.post('/newNote', function(req,res) {
  console.log("in new note server");
  console.log(req.body);
  var newItem = {
    photo: req.body.photo,
    english: req.body.original,
    translated: req.body.translated
  }
  console.log(newItem);
  req.db.collection('Notes').insertOne(newItem, function(err, results) {

  })
});

router.get('/picture/:picture', function(req, res){
  // console.log("in get picture");
  // assign the URL parameter to a variable
  var filename = req.params.picture;
  req.db.collection('Notes')
    .findOne({'_id': ObjectId(filename)}, function(err, results){
    // set the http response header so the browser knows this
    // is an 'image/jpeg' or 'image/png'
  //console.log("title = " + results.title);
  res.setHeader('content-type', 'image/jpeg');
    // send only the base64 string stored in the img object
    // buffer element
  res.send(results.photo);
  });
});

router.get('/notes', function(req, res){
  req.db.collection('Notes').find().toArray(function(err, results) {
    // console.log(results);
    res.send({noteList: results});
  });
})

// router.get('/protected', checkJwt, function(req, res, next) {
//
//   req.db.collection('max_todo').find().toArray(function(err, results) {
//     if (err) {
//       next(err);
//     }
//
//     res.json({
//       todos: results
//     });
//   });
//
//   // the auth0 user identifier for connecting users with data
//   console.log('auth0 user id:', req.user.sub);
//
//   // fetch info about the user (this isn't useful here, just for demo)
//   const userInfoUrl = req.user.aud[1];
//   const bearer = req.headers.authorization;
//   fetch(userInfoUrl, {
//   	headers: { 'authorization': bearer },
//   })
//     .then(res => res.json())
//     .then(userInfoRes => console.log('user info res', userInfoRes))
//     .catch(e => console.error('error fetching userinfo from auth0'));
//
// });

module.exports = router;
