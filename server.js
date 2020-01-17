var http = require('http');
var url = require('url');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

app.get('/', function(req, res) {
	res.sendFile(__dirname + "/index.html");
});

app.get('/session_names', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	var files = fs.readdirSync(__dirname + '/quizzes/');
	console.log(files);
	res.end(JSON.stringify({ "sessions": files }));
});

app.get('/session_questions', function(req, res){
	var session_name = req.query.session;
	console.log("Requested questions from " + session_name);

	fs.readFile("./quizzes/")
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.post('/session_save', function(req, res) {
	console.log(req.body);
	var questionsJSON = req.body;
	var fileJSON = {};
	fileJSON["Questions"] = questionsJSON;
	var stream = fs.createWriteStream("./quizzes/quizzie");
	stream.once("open", function(fd){
		stream.write(JSON.stringify(fileJSON));
		stream.end();
	});
});

app.listen(8080, function(){
	console.log("Started on PORT 8080");
});



