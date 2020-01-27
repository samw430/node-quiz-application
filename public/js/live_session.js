//Logic to populate list depending on query parameters
var sessionNickname = window.location.search.split("=")[1];

if (sessionNickname != "null") {

	document.getElementById("session-nickname").innerText = sessionNickname + " is Live";

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var stored_questions = JSON.parse(this.responseText)["questions"];
			var questionsList = document.getElementById("questions");
			console.log(stored_questions);
			var keys = Object.keys(stored_questions);
			for (var i = 0; i < keys.length; i++) {
				var question = stored_questions[i];
				var item = document.createElement("li");
				item.classList.add("quiz-question");
				item.classList.add("index=" + i);
				var header = document.createElement("p");
				item.appendChild(header);
				header.innerText = question["Text"];

				item.addEventListener("click", function(){
					var index = "";
					var questionText = this.innerText;
					for (var i = this.classList.length - 1; i >= 0; i--) {
						var current = this.classList[i];
						if(current.includes("index=")){
							index = current.charAt(6).toString();
						}
					}

					document.getElementById("current-question").innerText = questionText + " is the Current Question";
					// construct an HTTP request
					var xhr = new XMLHttpRequest();
					xhr.open("POST", "set_current_question?session=" + sessionNickname + "&question=" + index, true);
					xhr.send();

				});

				questionsList.appendChild(item);
			}
		}
	};
	xhttp.open("GET", "session_questions?session=" + sessionNickname, true);
	xhttp.send();
}