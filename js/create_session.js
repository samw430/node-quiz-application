//Logic to save questions once host starts a session
var start_button = document.getElementById("startBtn");
start_button.addEventListener("click", function(){
	//Get session nickname
	var sessionNickname = document.getElementById("session-nickname").value;

	// construct an HTTP request
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "session_save?session=" + sessionNickname, true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

	// send the collected data as JSON
	var questionsJSON = {};
	var string = "";
	var i = 0;
	document.querySelectorAll(".quiz-question").forEach( function(element){
		questionsJSON[i] = element.children[0].innerHTML;
		i++;
	});
	var finalJSON = {};
	finalJSON["Questions"] = questionsJSON;
	finalJSON["Current Question"] = "null";
	finalJSON["Answers"] = {};
	xhr.send(JSON.stringify(finalJSON));
});

//Logic to redirect to live quiz when start button is clicked
document.getElementById("startBtn").addEventListener("click", function(){
	var sessionNickname = document.getElementById("session-nickname").value;
	window.location.replace("live_session.html?session=" + sessionNickname);
});

//Logic to populate list depending on query parameters
var querystring = window.location.search.split("=")[1];
console.log(querystring);
if (querystring != "null") {

	document.getElementById("session-nickname").value = querystring;

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var stored_questions = JSON.parse(this.responseText)["questions"];
			var questionsList = document.getElementById("questions");
			var keys = Object.keys(stored_questions);
			for (var i = 0; i < keys.length; i++) {
				var question = stored_questions[i];
				var item = document.createElement("li");
				item.classList.add("quiz-question");
				var header = document.createElement("p");
				item.appendChild(header);
				header.innerText = question;

				var close_button = document.createElement("div");
				close_button.classList.add("close");
				close_button.innerText = "+";
				close_button.addEventListener("click", function() {
					var parent = close_button.parentElement;
					parent.parentElement.removeChild(parent);
				});

				item.appendChild(close_button);
				questionsList.appendChild(item);
			}
		}
	};
	xhttp.open("GET", "session_questions?session=" + querystring, true);
	xhttp.send();
}

//Logic to make pop up appear and disappear
document.getElementById('button').addEventListener("click", function() {
	document.querySelector('.bg-modal').style.display = "flex";
});
document.querySelector('.close').addEventListener("click", function() {
	document.querySelector('.bg-modal').style.display = "none";
});

//Logic to add question to list from pop up
document.getElementById('questionAddForm').addEventListener("submit", function() {
	var item = document.createElement("li");
	item.classList.add("quiz-question");
	var header = document.createElement("p");
	var close_button = document.createElement("div");

	item.appendChild(header);
	item.appendChild(close_button);

	close_button.classList.add("close");
	close_button.innerText = "+";
	close_button.addEventListener("click", function() {
		var parent = close_button.parentElement;
		parent.parentElement.removeChild(parent);
	});

	header.innerText = document.getElementById("question").value;
	var questionsList = document.getElementById("questions");
	questionsList.appendChild(item);
});

//TODO Expand logic for different question types
document.getElementById("questionType").addEventListener("change", function() {
	var dropDown = document.getElementById("questionType");
	var test = document.getElementById("test").innerText = dropDown.options[dropDown.selectedIndex].value;
});


