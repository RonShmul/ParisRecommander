var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var DButilsAzure = require('../DButils');


//get all categories
router.get('/getCategories', function (req, res){

    DButilsAzure.execQuery(`SELECT * FROM dbo.Categories`)
    .then((response, err) => {
        if(err)
            res.status(400).json({message: err.message});
        else{
            res.status(200).json({Categories: response});
            }
    })
    .catch(function(err) {
        res.status(400).json({message: err.message});
    });

});

//get all users############################################################################## maybe can be deleted
router.get('/getUsers', function (req, res){

    DButilsAzure.execQuery(`SELECT * FROM dbo.Users`)
    .then((response, err) => {
        if(err)
            res.status(400).json({message: err.message});
        else{
            res.status(200).json({Users: response});
            }
    })
    .catch(function(err) {
        res.status(400).json({message: err.message});
    });

});

//get all points of interests
router.get('/getAllSites', function (req, res){

    DButilsAzure.execQuery(`SELECT * FROM dbo.Points_of_interests order by Rate desc`)
    .then((response, err) => {
        if(err)
            res.status(400).json({message: err.message});
        else{
            res.status(200).json({Points_of_interests: response});
            }
    })
    .catch(function(err) {
        res.status(400).json({message: err.message});
    });

});

//get a specific site
router.get('/getSite/:PointName', function (req, res, next){

    DButilsAzure.execQuery(`SELECT * FROM dbo.Points_of_interests WHERE PointName = '` + req.params.PointName + "'")
    .then((response, err) => {
        if(err)
            res.status(400).json({message: err.message});
        else{
            req.numberOfViewers = response[0].numberOfViewers + 1;
            res.status(200).json({Points_of_interests: response});
            next();
            }
    })
    .catch(function(err) {
        res.status(400).json({message: err.message});
    });

}, function(req, res){
   
    DButilsAzure.execQuery(` UPDATE dbo.Points_of_interests SET numberOfViewers = '`+ req.numberOfViewers +`' WHERE PointName = '` + req.params.PointName + "'")
    .then((response, err) => {
        if(err)
            res.status(400).json({message: err.message});
        else{}
    })
    .catch(function(err) {
        res.status(400).json({message: err.message});
    });
});

//get 3 top rated points of interests
router.get('/getTop3PointsOfInterests', function (req, res){

    DButilsAzure.execQuery(`SELECT TOP (3) * from Points_of_interests order by Rate desc`)
    .then((response, err) => {
        if(err)
            res.status(400).json({message: err.message});
        else{
            res.status(200).json({Points_of_interests: response});
            }
    })
    .catch(function(err) {
        res.status(400).json({message: err.message});
    });

});

//get points of interests by category
router.get('/getPointsOfInterestsByCategory/:Category', function (req, res){

    DButilsAzure.execQuery(`SELECT  * from Points_of_interests WHERE Category ='`+ req.params.Category + "' order by Rate desc")
    .then((response, err) => {
        if(err)
            res.status(400).json({message: err.message});
        else{
            res.status(200).json({Points_of_interests: response});
            }
    })
    .catch(function(err) {
        res.status(400).json({message: err.message});
    });

});

/**************** Login and registrations methods*/

  //login
  const superSecret = "cKeyEasy"; // secret variable

  router.post('/login', (req, res) => {

      let user = {
          Username: req.body.Username, 
      }
      var Password = req.body.Password;
    DButilsAzure.execQuery(`SELECT * FROM dbo.Users WHERE Username = '`+ user.Username + `'`)
    .then((response, err) => {
        if(err)
            res.status(400).json({message: err.message});
        else{
            if(response.length > 0) {
                if(response[0].Password == Password) {
                    sendToken(user, res);
                }
                else {
                    res.status(400).json({message: 'Password is incorrect'});
                }
            }
            else {
                res.status(404).json({message: 'Username is not exist'});
            }
        }
    })
    .catch(function(err) {
        res.status(400).json({message: err.message});
    });

});

//register
router.post('/register', (req, res, next) => {

    let user = {
        Username: req.body.Username, 
    }

  DButilsAzure.execQuery(`SELECT * FROM dbo.Users WHERE Username = '`+ user.Username + `'`)
  .then((response, err) => {
      if(err)
          res.status(400).json({message: err.message});
      else{
          if(response.length == 0) {
              req.user = user;
                next();
          }
          else {
              res.status(400).json({message: 'Username is already exist'});
          }
      }
  })
  .catch(function(err) {
      res.status(400).json({message: err.message });
  });

}, function (req, res){

    DButilsAzure.execQuery("INSERT INTO dbo.Users (Username, FirstName, LastName, City, Country, Email, Password, SecurityAnswer1,SecurityAnswer2) VALUES ('"+req.body.Username+"', '"+req.body.FirstName+"', '"+req.body.LastName+"', '"+req.body.City+"', '"+req.body.Country+"', '"+req.body.Email+"', '"+req.body.Password+"', '"+req.body.SecurityAnswer1+"', '"+req.body.SecurityAnswer2+"')")
    .then((response, err) => {
        if(err)
            res.status(400).json({message: err.message});
        else{
            sendToken(req.user, res);
            next();
        }
    })
    .catch(function(err) {
        res.status(400).json({message: err.message});
    });
  

}, function (req, res){
    for(var i = 0; i < req.body.Categories.length; i++) {
        DButilsAzure.execQuery("INSERT INTO dbo.Users_Categories (Username, Category) VALUES ('"+req.body.Username+"', '"+req.body.Categories[i]+"')")
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                res.sendStatus(200);
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });
    }
});

//restore password
router.post('/restorePassword', (req, res) => {
    let username = req.body.Username;
    let answer1 = req.body.SecurityAnswer1;
    let answer2 = req.body.SecurityAnswer2;

  DButilsAzure.execQuery(`SELECT * FROM dbo.Users WHERE Username = '`+ username + `'`)
  .then((response, err) => {
      if(err)
          res.status(400).json({message: err.message});
      else{
          if(response.length > 0) {
              if(response[0].SecurityAnswer1 == answer1 && response[0].SecurityAnswer2 == answer2) {
                  res.status(200).json({Password: response[0].Password});
              }
              else {
                  res.status(400).json({message: 'Incorrect answer(s)'});
              }
          }
          else {
              res.status(404).json({message: 'Username is not exist'});
          }
      }
  })
  .catch(function(err) {
      res.status(400).json({message: err.message});
  });

});

 // FORMAT OF TOKEN
  // Authorization: Bearer <access_token>
  
  // Verify Token
 

  function sendToken(user, res) {

    var token = jwt.sign(user, superSecret, {
        expiresIn: "1d" // expires in 24 hours
    });

    // return the information including token as JSON
    res.json({
        success: true,
        token: token
    });

}

module.exports = router;