//Logic to populate list depending on query parameters
var querystring = window.location.search.split("=")[1];
console.log(querystring);
if (querystring != "null") {

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var current_question = JSON.parse(this.responseText)["Question"];
			var questionText = document.getElementById("question-text");

			questionText.innerText = "- " + current_question + " -";
		}
	};
	xhttp.open("GET", "current_question?session=" + querystring, true);
	xhttp.send();
}

var true_button = document.getElementById("trueBtn");
var false_button = document.getElementById("falseBtn");

true_button.addEventListener("click", function(){
	true_button.classList.toggle("clicked");
});

false_button.addEventListener("click", function() {
	false_button.classList.toggle("clicked");
});

document.getElementById("submitBtn").addEventListener("click", function(){
	// construct an HTTP request
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "submit_answer", true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

	// send the collected data as JSON
	var answerJSON = {};

	var userNickname = document.getElementById("user-nickname").value;
	var answer = document.getElementsByClassName("clicked")[0].innerText;

	answerJSON["Session"] = querystring;
	answerJSON["User"] = userNickname;
	answerJSON["Answer"] = answer;
	xhr.send(JSON.stringify(answerJSON));
});
