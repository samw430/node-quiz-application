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

	var url_query = url.parse(req.url, true).query["session"];	
	var quiz_contents;
	try{
		var file_path = "./quizzes/" + url_query;
		console.log(file_path);
		quiz_contents = fs.readFileSync(file_path);
		quiz_contents = JSON.parse(quiz_contents);
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify({ "questions": quiz_contents["Questions"] }));
	} catch (err) {
		console.log("Invalid quiz requested");
		res.sendStatus(404);
	}

});

app.get('/current_question', function (req, res){
	var session_name = req.query.session;
	console.log("Requested current question from " + session_name);

	var url_query = url.parse(req.url, true).query["session"];
	var quiz_contents;
	try {
		var file_path = "./quizzes/" + url_query;
		console.log(file_path);
		quiz_contents = fs.readFileSync(file_path);
		quiz_contents = JSON.parse(quiz_contents);
		res.setHeader('Content-Type', 'application/json');
		var currentQIndex = quiz_contents["Current Question"];
		res.end(JSON.stringify({ "Question": quiz_contents["Questions"][currentQIndex] }));
	} catch (err) {
		console.log("Invalid quiz requested");
		res.sendStatus(404);
	}
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.post('/session_save', function(req, res) {
	var url_query = url.parse(req.url, true).query["session"];

	var stream = fs.createWriteStream("./quizzes/" + url_query);
	stream.once("open", function(fd){
		stream.write(JSON.stringify(req.body));
		stream.end();
	});
});

app.post('/submit_answer', function(req, res){
	var session_nickname = req.body["Session"];
	var user_nickname = req.body["User"];
	var answer = req.body["Answer"];

	try {
		var file_path = "./quizzes/" + session_nickname;
		console.log("Recieved answer for " + file_path);
		quiz_contents = fs.readFileSync(file_path);
		quiz_contents = JSON.parse(quiz_contents);
		answers = quiz_contents["Answers"];
		answers[user_nickname] = answer;
		quiz_contents["Answers"] = answers;
		res.sendStatus(200);

		var stream = fs.createWriteStream(file_path);
		stream.once("open", function(fd) {
			stream.write(JSON.stringify(quiz_contents));
			stream.end();
		});
	} catch (err) {
		console.log("Invalid quiz requested");
		res.sendStatus(404);
	}
});

app.post('/set_current_question', function(req, res){
	var url_query = url.parse(req.url, true);
	var session_nickname = url_query.query["session"];
	var current_question = url_query.query["question"];

	try {
		var file_path = "./quizzes/" + session_nickname;
		console.log("Set current question for " + file_path);
		quiz_contents = fs.readFileSync(file_path);
		quiz_contents = JSON.parse(quiz_contents);
		quiz_contents["Current Question"] = current_question;
		res.sendStatus(200);

		var stream = fs.createWriteStream(file_path);
		stream.once("open", function(fd) {
			stream.write(JSON.stringify(quiz_contents));
			stream.end();
		});
	} catch (err) {
		console.log("Invalid quiz requested");
		res.sendStatus(404);
	}
});

app.listen(8080, function(){
	console.log("Started on PORT 8080");
});



