var urlParams = new URLSearchParams(window.location.search);

var sessionNickname = urlParams.get('session');
var questionNumber = urlParams.get('question');


document.getElementById("session-nickname").innerText = "Answers for " + sessionNickname;

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var stored_answers = JSON.parse(this.responseText)["answers"];
		var answersList = document.getElementById("answers");

		console.log(this.responseText);
		var keys = Object.keys(stored_answers);
		console.log(keys);
		for (var i = 0; i < keys.length; i++) {
			var user_nickname = keys[i];
			var answer = stored_answers[user_nickname];
			var item = document.createElement("li");

			var header = document.createElement("p");
			header.innerText = user_nickname + " answered " + answer;
			item.appendChild(header);

			answersList.appendChild(item);
		}
	}
};
xhttp.open("GET", "question_answers?session=" + sessionNickname + "&question=" + questionNumber, true);
xhttp.send();
