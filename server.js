var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var chalk = require('chalk');
var mongoose = require('mongoose');
var logger = require('winston');

var jwt = require("jsonwebtoken");
var bcrypt = require('bcrypt');
var multer = require('multer'); // for the file upload

var app = express()
var http = require('http').Server(app)
var bodyPaser = bodyParser.json()
const fs = require('fs');
var port = process.env.PORT || 8080;
var activeData = require(__dirname + '/server/Utils/database.js');

// Database connection: (Change this to what your database URL is!)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chatFactory',{ useNewUrlParser: true });
var db = mongoose.connection;
	require(__dirname + '/server/Utils/database.js')(chalk, db);


	// Models - database Schemas
	var models = {
		mongoose: mongoose,
		user: require(__dirname + '/server/models/users')(mongoose,bcrypt),
    group: require(__dirname + '/server/models/groups')(mongoose,bcrypt),
    channel: require(__dirname + '/server/models/channels')(mongoose,bcrypt),
    message: require(__dirname + '/server/models/messages')(mongoose,bcrypt)
	};
	//Controllers - database functions
	var controller = {
		user: require(__dirname + '/server/controllers/users')(models, logger,jwt,bcrypt,multer),
    group: require(__dirname + '/server/controllers/groups')(models, logger,jwt,bcrypt),
    channel: require(__dirname + '/server/controllers/channels')(models, logger,jwt,bcrypt),
    message: require(__dirname + '/server/controllers/messages')(models, logger,jwt,bcrypt)
	};


app.use(express.static(__dirname + '/dist/Chat-Factory'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyPaser);


var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Listening on %s", port)
})

var io = require('socket.io').listen(server);

require(__dirname + '/server/Utils/sockets')(models, controller, app, io)
require(__dirname + '/server/Utils/routes')(models, controller, app, express, io)

setupData();

// Adding a default user, this will run each time the server starts up, but wont add duplicates
async function setupData(){
    return await controller.user.createUser({_email:"super@gmail.com",_username:"super",_password:"Super",_role: "Super",_profileImage:"/server/uploads",_inChannel:[],_inGroup:[]})
}

module.exports = server;
