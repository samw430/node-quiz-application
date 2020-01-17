//Logic to save questions once host starts a session
var start_button = document.getElementById("startBtn");
start_button.addEventListener("click", function(){
	// construct an HTTP request
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "session_save", true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

	// send the collected data as JSON
	var questionsJSON = {};
	var string = "";
	var i = 0;
	document.querySelectorAll(".quiz-question").forEach( function(element){
		questionsJSON[i] = element.children[0].innerHTML;
		i++;
	});
	xhr.send(JSON.stringify(questionsJSON));
});

//Logic to populate list depending on query parameters
var querystring = window.location.search.split("=")[1];
console.log(querystring);

var strings = ["hello", "help", "please"];
var questionsList = document.getElementById("questions");
for (var _i = 0, strings_1 = strings; _i < strings_1.length; _i++) {
    var word = strings_1[_i];
    var item = document.createElement("li");
	item.classList.add("quiz-question");
    var header = document.createElement("p");
    item.appendChild(header);
    header.innerText = word;
    questionsList.appendChild(item);
}
