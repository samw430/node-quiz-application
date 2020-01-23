//Logic to populate list depending on query parameters
var querystring = window.location.search.split("=")[1];
var questionType;

if (querystring != "null") {

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var current_question = JSON.parse(this.responseText)["Question"];

			var questionText = document.getElementById("question-text");
			questionText.innerText = "- " + current_question["Text"] + " -";

			questionType = current_question["Type"];
			if(questionType == "Numeric"){
				document.querySelector('.numeric').style.display = "flex";
			}else if(questionType == "Multiple Choice"){
				document.querySelector('.multipleChoice').style.display = "flex";

				var answer_options = current_question["Choices"];
				for (var i = 1; i < 5; i++){
					var option = document.getElementById("option" + i);
					option.innerText = answer_options[i - 1];
				}
			}else{
				document.querySelector('.trueFalse').style.display = "flex";
			}
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

for (var i = 1; i < 5;i++){
	var choice_button = document.getElementById("option" + i);
	choice_button.parentElement.addEventListener("click", function(){
		this.classList.toggle("clicked");
	});
}

document.getElementById("submitBtn").addEventListener("click", function(){
	// construct an HTTP request
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "submit_answer", true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

	// send the collected data as JSON
	var answerJSON = {};

	var userNickname = document.getElementById("user-nickname").value;
	var answer;

	if (questionType == "Numeric") {
		answer = document.getElementById("numericResponse").value;
	} else if (questionType == "Multiple Choice") {
		answer = document.getElementsByClassName("clicked")[0].innerText;
	} else {
		answer = document.getElementsByClassName("clicked")[0].innerText;
	}

	answerJSON["Session"] = querystring;
	answerJSON["User"] = userNickname;
	answerJSON["Answer"] = answer;
	xhr.send(JSON.stringify(answerJSON));
});
