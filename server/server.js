//this is only an example, handling everything is yours responsibilty !

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
app.use(cors());
var DButilsAzure = require('./DButils');

var Users = require('./modules/Users');
var POI = require('./modules/POI');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//################################################################
 
app.use('/poi', POI);
app.use('/users', Users);

//#################################################################
var port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
