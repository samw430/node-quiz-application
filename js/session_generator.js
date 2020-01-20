var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var quiz_files = JSON.parse(this.responseText)["sessions"];
		var sessionList = document.getElementById("sessions");
		console.log(quiz_files);
		console.log(typeof (quiz_files));
		for (var i = 0; i < quiz_files.length; i++) {
			var item = document.createElement("li");
			var inner = document.createElement("a");
			inner.setAttribute("href", "create_session.html?session=" + quiz_files[i]);
			item.appendChild(inner);
			inner.innerText = quiz_files[i];
			sessionList.appendChild(item);
		}
	}
};
xhttp.open("GET", "session_names", true);
xhttp.send();