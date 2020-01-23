# Quiz-Application
This is a quiz application meant to effectively replace classroom lecture clickers.  It allows an instructor to locally host quiz sessions on their computer and advertise a URL for students to respond.  These questions can be of three types: mutiple choice, true or false, or numeric.  Students can respond depending on question type and the instructor can then view responses to gauge student understanding and engagement with the material.

## Architecture
The application runs on Node.js.  The server logic is handled within server.js.  The server presents static HTML files with dynamic Javascript for rendering questions on the fly.  

## Database Design
The underlying database is a simple file system where the server generates and manages a file corresponding to each quiz session.