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

    DButilsAzure.execQuery(`SELECT * FROM dbo.Points_of_interests WHERE dbo.Points_of_interests.PointName = '` + req.params.PointName + "'")
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
//get point's reviews
router.get('/getSiteReviews/:PointName', function (req, res, next){

    DButilsAzure.execQuery(`SELECT * FROM dbo.Users_Reviews WHERE dbo.Users_Reviews.PointName = '` + req.params.PointName + "'")
    .then((response, err) => {
        if(err)
            res.status(400).json({message: err.message});
        else{
            req.numberOfViewers = response[0].numberOfViewers + 1;
            res.status(200).json({reviews: response});
            next();
            }
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


 
module.exports = router;