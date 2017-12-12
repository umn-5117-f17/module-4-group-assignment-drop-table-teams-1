var express = require('express');
var router = express.Router();

const checkJwt = require('../auth').checkJwt;
const fetch = require('node-fetch');

router.get('/', function(req,res) {
  console.log('hi');
  res.json({'message': 'something here...'});
});

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

// simple API call, no authentication or user info
router.get('/unprotected', function(req, res, next) {

  req.db.collection('max_todo').find().toArray(function(err, results) {
    if (err) {
      next(err);
    }

    res.json({
      todos: results
    });
  });

});

// checkJwt middleware will enforce valid authorization token
router.get('/protected', checkJwt, function(req, res, next) {

  req.db.collection('max_todo').find().toArray(function(err, results) {
    if (err) {
      next(err);
    }

    res.json({
      todos: results
    });
  });

  // the auth0 user identifier for connecting users with data
  console.log('auth0 user id:', req.user.sub);

  // fetch info about the user (this isn't useful here, just for demo)
  const userInfoUrl = req.user.aud[1];
  const bearer = req.headers.authorization;
  fetch(userInfoUrl, {
  	headers: { 'authorization': bearer },
  })
    .then(res => res.json())
    .then(userInfoRes => console.log('user info res', userInfoRes))
    .catch(e => console.error('error fetching userinfo from auth0'));

});

module.exports = router;
