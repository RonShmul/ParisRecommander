//this is only an example, handling everything is yours responsibilty !

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
app.use(cors());
var DButilsAzure = require('./DButils');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//################################################################

//get all categories
app.get('/getCategories', function (req, res){

    DButilsAzure.execQuery(`SELECT * FROM dbo.Categories`)
    .then((response, err) => {
        if(err)
            res.status(400).json({message: err.message});
        else{
            //let jsonObject = JSON.parse(response);
            res.status(200).json({Categories: response});
            }
    })
    .catch(function(err) {
        res.status(400).json({message: err.message});
    });

});

//get all users
app.get('/getUsers', function (req, res){

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
app.get('/getAllSites', function (req, res){

    DButilsAzure.execQuery(`SELECT * FROM dbo.Points_of_interests`)
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
app.get('/getSite/:PointName', function (req, res){

    DButilsAzure.execQuery(`SELECT * FROM dbo.Points_of_interests WHERE PointName = '` + req.params.PointName + "'")
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

//get a specific user todo
app.get('/getSite/:id', function (req, res){

    DButilsAzure.execQuery(`SELECT * FROM dbo.Points_of_interests WHERE username = '` + req.params.id + "'")
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


//#################################################################
var port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
//-------------------------------------------------------------------------------------------------------------------


