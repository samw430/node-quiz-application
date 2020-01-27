var http = require('http');
var url = require('url');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var ip = require("ip");

//Makes index.html default page
app.get('/', function(req, res) {
	res.sendFile(__dirname + "/public/index.html");
});

//Allows host to access past session names when recalling a session
app.get('/session_names', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	var files = fs.readdirSync(__dirname + '/public/quizzes/');
	console.log("Recalled past sessions");
	res.end(JSON.stringify({ "sessions": files }));
});

//End point for user to get the questions for the current session
app.get('/session_questions', function(req, res){
	var session_name = req.query.session;
	console.log("Requested questions from " + session_name);

	var url_query = url.parse(req.url, true).query["session"];	
	try{
		var file_path = "./public/quizzes/" + url_query;
		console.log(file_path);
		var quiz_contents = fs.readFileSync(file_path);
		quiz_contents = JSON.parse(quiz_contents);
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify({ "questions": quiz_contents["Questions"] }));
	} catch (err) {
		console.log("Invalid quiz requested");
		res.sendStatus(404);
	}

});

//End point for user to get the current question for their session
app.get('/current_question', function (req, res){
	var session_name = req.query.session;
	console.log("Requested current question from " + session_name);

	var url_query = url.parse(req.url, true).query["session"];
	try {
		var file_path = "./public/quizzes/" + url_query;
		console.log(file_path);
		var quiz_contents = fs.readFileSync(file_path);
		quiz_contents = JSON.parse(quiz_contents);
		res.setHeader('Content-Type', 'application/json');
		var currentQIndex = quiz_contents["Current Question"];
		res.end(JSON.stringify({ "Question": quiz_contents["Questions"][currentQIndex] }));
	} catch (err) {
		console.log("Invalid quiz requested");
		res.sendStatus(404);
	}
});

//Allow for html files to be accessed through IPAddress/desired-filename
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//End point for host to post session when it is complete
app.post('/session_save', function(req, res) {
	var url_query = url.parse(req.url, true).query["session"];

	var stream = fs.createWriteStream("./public/quizzes/" + url_query);
	stream.once("open", function(fd){
		stream.write(JSON.stringify(req.body));
		stream.end();
	});
	res.sendStatus(200);
});

//End point for participants to post answers to live questions
app.post('/submit_answer', function(req, res){
	var session_nickname = req.body["Session"];
	var user_nickname = req.body["User"];
	var answer = req.body["Answer"];

	console.log(req.body);
	try {
		var file_path = "./public/quizzes/" + session_nickname;
		console.log("Recieved answer for " + file_path);
		quiz_contents = fs.readFileSync(file_path);
		quiz_contents = JSON.parse(quiz_contents);

		var current_question = quiz_contents["Current Question"];
		if(current_question in quiz_contents["Answers"]){
			quiz_contents["Answers"][current_question][user_nickname] = answer;
		}else{
			quiz_contents["Answers"][current_question] = {};
			quiz_contents["Answers"][current_question][user_nickname] = answer;
		}

		var stream = fs.createWriteStream(file_path);
		stream.once("open", function(fd) {
			stream.write(JSON.stringify(quiz_contents));
			stream.end();
		});
		res.sendStatus(200);
	} catch (err) {
		console.log(err);
		console.log("Invalid quiz requested");
		res.sendStatus(404);
	}
});

//End point for host to set the current live question
app.post('/set_current_question', function(req, res){
	var url_query = url.parse(req.url, true);
	var session_nickname = url_query.query["session"];
	var current_question = url_query.query["question"];

	try {
		var file_path = "./public/quizzes/" + session_nickname;
		console.log("Set current question for " + file_path);
		quiz_contents = fs.readFileSync(file_path);
		quiz_contents = JSON.parse(quiz_contents);
		quiz_contents["Current Question"] = current_question;

		var stream = fs.createWriteStream(file_path);
		stream.once("open", function(fd) {
			stream.write(JSON.stringify(quiz_contents));
			stream.end();
		});
		res.sendStatus(200);
	} catch (err) {
		console.log("Invalid quiz requested");
		res.sendStatus(404);
	}
});

//End point for deleting previous sessions
app.post('/delete_session', function(req, res){
	var url_query = url.parse(req.url, true);
	var session = url_query.query["session"];

	var file_path = "./public/quizzes/" + session;
	console.log("Deleting session " + file_path);
	fs.unlink(file_path, function(err){
		if(err){
			console.log("Delete failed ", err);
			res.sendStatus(400);
		}else{
			console.log("Deletion Succesful");
			res.sendStatus(200);
		}
	});
});

//Starts node server on port 8080
app.listen(8080, '0.0.0.0', function(){
	console.log("Access sites using", ip.address(), "on port 8080");
});



