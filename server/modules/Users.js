var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var DButilsAzure = require('../DButils');
const superSecret = "cKeyEasy";


/**************** Login and registrations methods*/

  //login
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

}, function (req, res, next){

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
/**************************************after the user is logged in ****************************/
router.use('/auth', function(req, res, next) {
    var token=req.body.token||req.query.token||req.headers['x-access-token'];
    if(token){
        jwt.verify(token,superSecret,function(err,decoded){
            if(err){
                return res.status(400).json({success: false, message:'Failed to authenticate token.='});
            }else{
                var decoded=jwt.decode(token, {complete:true});
                req.Username=decoded.payload.Username;
                next();
            }
        })
    }
});

//get user's chosen categories
router.post('/auth/getUserCategories', function (req, res){
   
    DButilsAzure.execQuery(`SELECT * FROM Users_Categories WHERE Username = '`+req.Username+`'`)
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

//save point of interest to user's favorites list
router.post('/auth/insertToFavorites', function (req, res, next){
    let poi = req.body.PointName;

    DButilsAzure.execQuery(`SELECT * FROM Users_Favorites WHERE PointName = '` + poi + `' AND Username = '` + req.Username +`'`)
    .then((response, err) => {
        if(err)
            res.status(400).json({message: err.message});
        else{
            if(response.length == 0) {
                next();
            }
            else {
                res.status(400).json({message: 'The point of interest is already in the favorites list'});
            }
    }
})
    .catch(function(err) {
        res.status(400).json({message: err.message});
    });

}, function(req, res, next){
    let poi = req.body.PointName;
    DButilsAzure.execQuery(`SELECT TOP (1) * FROM Users_Favorites WHERE Username = '` + req.Username +`' order by PriorityIndex desc`)
    .then((response, err) => {
        if(err)
            res.status(400).json({message: err.message});
        else{
            let newPriority = 1;
            if(response.length > 0)
                newPriority = response[0].PriorityIndex + 1;            
            req.PriorityIndex = newPriority;
            next();  
            }
    })
    .catch(function(err) {
        res.status(400).json({message: err.message});
    });
}, function(req, res){
        let poi = req.body.PointName;
        DButilsAzure.execQuery(`INSERT INTO Users_Favorites (Username, PointName, PriorityIndex) VALUES ('`+req.Username+`', '`+poi+`' , `+req.PriorityIndex+`)`)
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
});

//Delete a point from the user's favorites
router.delete('/auth/DeleteFromFavorites', function (req, res, next){
    let poi = req.body.PointName;
    DButilsAzure.execQuery(`SELECT * FROM Users_Favorites WHERE PointName = '` + poi + `' AND Username = '` + req.Username +`'`)
    .then((response, err) =>{
        if(err)
            res.status(400).json({message: err.message});
        else{            
            if(response.length == 0) {
                res.status(400).json({message: 'The point of interest is not in your favorites list'});                
            }
            else {
                next();
            }            
        }
    })
    .catch(function(err) {
        res.status(400).json({message: err.message});
    });

}, function(req, res){
    let poi = req.body.PointName;
    DButilsAzure.execQuery(`DELETE FROM Users_Favorites WHERE PointName = '` + poi + `' AND Username = '` + req.Username +`'`)
    .then((response, err) => {
        if(err)
            res.status(400).json({message: err.message});
        else{            
            res.status(200).json({message: "The Point of interest was deleted from your favorites"});            
        }
})
.catch(function(err) {
        res.status(400).json({message: err.message});
    });
});


//last two points that saved in the favorites
router.post('/auth/LastSaved', function (req, res, next){
    DButilsAzure.execQuery(`SELECT TOP (2) * FROM Users_Favorites as uf JOIN Points_of_interests as poi ON uf.PointName = poi.PointName AND Username = '`+ req.Username + `' order by SavedIndex desc`)
    .then((response, err) =>{
        if(err)
            res.status(400).json({message: err.message});
        else{            
            if(response.length == 0) {
                res.status(400).json({message: 'There is not last saved points'});
            }
            else {
                res.status(200).json({LastUserPointsOfInterests: response});               
            }            
        }
    })
    .catch(function(err) {
        res.status(400).json({message: err.message});
    });    
});


//Show favorites points of interest
router.post('/auth/FavoritePointsOfInterest', function (req, res, next){
    DButilsAzure.execQuery(`SELECT * FROM Users_Favorites WHERE Username = '`+ req.Username + `' order by PriorityIndex`)
    .then((response, err) =>{
        if(err)
            res.status(400).json({message: err.message});
        else{
            if(response.length == 0) {
                res.status(400).json({message: 'There is not saved points in favorites'});
            }
            else {
                res.status(200).json({FavoriteList: response});
            }            
        }
    })
    .catch(function(err) {
        res.status(400).json({message: err.message});
    });    
});


//Save favorites sorted by priority
router.post('/auth/SaveFavoritesList', function (req, res, next){
    for(var i = 1; i <= req.body.Points.length; i++) {
        DButilsAzure.execQuery(`UPDATE Users_Favorites SET PriorityIndex = `+i+` WHERE PointName = '`+ req.body.Points[i-1]+`'`)
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


//Add a review for point of interest
router.post("/auth/addReview", function(req, res){
    let username = req.Username;
    let Poi = req.body.PointName;
    let review = req.body.Review;

    DButilsAzure.execQuery(`SELECT * FROM Users_reviews WHERE Username = '`+ username +`' AND PointName ='`+ Poi + `'`)
    .then((response) =>{
        if(response.length == 0) {
            return insertReview(username, Poi, review);
        }
        else {
            return updateReview(username, Poi, review);
        }
    }).then(function(result) {
        res.send(result);
    })
    .catch(function(err) {
        res.status(400).json({message: err.message});
    });    
});

//return promise for insert review
function insertReview(username, Poi, Review){
    return new Promise(function(resolve , reject){
        
        DButilsAzure.execQuery(`INSERT INTO Users_reviews (Username, PointName, Review, DateReview) VALUES ('`+username+`', '`+Poi+`', '`+Review+`', GETDATE())`)
        .then(function(result){
            resolve(result);
        })
        .catch(function(err){
            reject(err);
        })
    });
}

//return promise for update review
function updateReview(username, Poi, Review){
    return new Promise(function(resolve , reject){
        if(Review != null)
            Review = `'`+Review+`'`;
        DButilsAzure.execQuery(`UPDATE Users_reviews SET Review = `+Review+` WHERE PointName ='`+ Poi + `' AND Username = '`+username+`'`)
        .then(function(result){
            resolve(result);
        })
        .catch(function(err){
            reject(err);
        })
    });
}
//delete review
router.delete("/auth/deleteReview", function(req, res){
    let username = req.Username;
    let Poi = req.body.PointName;

    DButilsAzure.execQuery(`SELECT * FROM Users_reviews WHERE Username = '`+ username +`' AND PointName ='`+ Poi + `'`)
    .then((response) =>{
        if(response.length == 0) {
            res.status(400).json({message: 'Review does not exist'});
        }
        else {
            return updateReview(username, Poi, null);
        }
    }).then(function(result) {
        res.send(result);
    })
    .catch(function(err) {
        res.status(400).json({message: err.message});
    });    
});

//Add a rate for point of interest
router.post("/auth/AddRate", function(req, res){
    let username = req.Username;
    let Poi = req.body.PointName;
    let rate = req.body.Rate;

    DButilsAzure.execQuery(`SELECT * FROM Users_reviews WHERE Username = '`+ username +`' AND PointName ='`+ Poi + `'`)
    .then((response) =>{
        if(response.length == 0) {
            return insertRate(username, Poi, rate);
        }
        else {
            return updateRate(username, Poi, rate);
        }
    }).then(function(result) {
        res.send(result);
    })
    .catch(function(err) {
        res.status(400).json({message: err.message});
    });    
});

//return promise for insert Rate
function insertRate(username, Poi, Rate){
    return new Promise(function(resolve , reject){
        
        DButilsAzure.execQuery(`INSERT INTO Users_reviews (Username, PointName, Rate, DateReview) VALUES ('`+username+`', '`+Poi+`', `+Rate+`, GETDATE())`)
        .then(function(result){
            resolve(result);
        })
        .catch(function(err){
            reject(err);
        })
    });
}

//return promise for update Rate
function updateRate(username, Poi, Rate){
    return new Promise(function(resolve , reject){

        DButilsAzure.execQuery(`UPDATE Users_reviews SET Rate = `+Rate+` WHERE PointName ='`+ Poi + `' AND Username = '`+username+`'`)
        .then(function(result){
            resolve(result);
        })
        .catch(function(err){
            reject(err);
        })
    });
}
//delete Rate
router.delete("/auth/deleteRate", function(req, res){
    let username = req.Username;
    let Poi = req.body.PointName;

    DButilsAzure.execQuery(`SELECT * FROM Users_reviews WHERE Username = '`+ username +`' AND PointName ='`+ Poi + `'`)
    .then((response) =>{
        if(response.length == 0) {
            res.status(400).json({message: 'Rate does not exist'});
        }
        else {
            return updateRate(username, Poi, null);
        }
    }).then(function(result) {
        res.send(result);
    })
    .catch(function(err) {
        res.status(400).json({message: err.message});
    });    
});
//send token to client side
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