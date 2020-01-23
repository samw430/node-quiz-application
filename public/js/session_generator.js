var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var quiz_files = JSON.parse(this.responseText)["sessions"];
		var sessionList = document.getElementById("sessions");

		for (var i = 0; i < quiz_files.length; i++) {
			var item = document.createElement("li");
			var inner = document.createElement("a");
			var session = quiz_files[i];
			item.setAttribute("id", session);
			inner.setAttribute("href", "create_session.html?session=" + session);
			item.appendChild(inner);
			inner.innerText = session;


			var close_button = document.createElement("div");
			item.appendChild(close_button);
			close_button.setAttribute("data-parent", session);
			close_button.classList.add("close");
			close_button.innerText = "+";
			close_button.addEventListener("click", function() {
				var parent = this.parentElement;

				// construct an HTTP request
				var xhr = new XMLHttpRequest();
				xhr.open("POST", "delete_session?session=" + parent.getAttribute("id"), true);
				xhr.send();

				parent.parentElement.removeChild(parent);
			});


			sessionList.appendChild(item);
		}
	}
};
xhttp.open("GET", "session_names", true);
xhttp.send();