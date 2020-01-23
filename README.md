# Quiz-Application
This is a quiz application meant to effectively replace classroom lecture clickers.  It allows an instructor to locally host quiz sessions on their computer and advertise a URL for students to respond.  These questions can be of three types: mutiple choice, true or false, or numeric.  Students can respond depending on question type and the instructor can then view responses to gauge student understanding and engagement with the material.

## Prerequisites
To run this application you will need an installation of Node.js and the necessary node packages.  
```
$ curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
$ sudo apt install nodejs
$ node --version
$ npm-install-all
```

## Architecture
The application runs on Node.js.  The server logic is handled within server.js.  The server presents static HTML files with dynamic Javascript for rendering questions on the fly.  

## Database Design
The underlying database is a simple file system where the server generates and manages a file corresponding to each quiz session. This file stores a stringified JSON corresponding to the following schema.  
```
{Questions: {Question Number: {Text: …, Type: Enum[Numeric, Multiple Choice, True or False], Choices: Only for multiple choice, list of answer options}},
Current Question: Question Number,
Answers: {Question Number: {User: Answer}, … }}
```
This schema is flexible and handled entirely through javascript logic in server.js.  All adjustments from the database result from POST requests made by users to the server.

