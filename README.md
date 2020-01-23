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
## Running the Site
```
node server.js
```
First you launch the node server.  Then every site can be accessed through a web browser.  A host will generally go through the following work flow.  First they enter the index site through localhost:8080.  From there they can select to either start a new session or edit an existing one.  If they elect to start a new one they are brought to the session creation page where they name the session and write questions.  This URL is localhost:8080/create_session.html.  If they elect to choose an older session they go to localhost:8080/select_session.html.  When they choose a session there they are forwarded to localhost:8080/create_session.html?session=SESSION_NAME where SESSION_NAME is the one they selected.  This will give them the same UI as creating a new session but with the previously defined questions pre loaded.  From there they can make the session live.  This will take them to localhost:8080/live_session.html?session=SESSION_NAME and they can select a question to host live.  This action updates the database file for that session and sets the "Current Question" field with the corresponding number.  

Now a user can interact with the quiz application by opening IP_ADDR:8080/user_view.html?session=SESSION_NAME on their personal device.  This web page will show the current question and corresponding answer choices.  When a student answers the question and submits their answer it is posted to the server which saves it in the database.  

From this basic workflow an instructor can iterate through each question making them live and then viewing results from each question.  

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

