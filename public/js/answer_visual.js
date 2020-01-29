var urlParams = new URLSearchParams(window.location.search);

var sessionNickname = urlParams.get('session');
var questionNumber = urlParams.get('question');


document.getElementById("session-nickname").innerText = "Answers for " + sessionNickname;

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var stored_answers = JSON.parse(this.responseText)["answers"];
		var answersList = document.getElementById("answers");

		var keys = Object.keys(stored_answers);
		var frequency_table = {};

		for (var i = 0; i < keys.length; i++) {
			var user_nickname = keys[i];
			var answer = stored_answers[user_nickname];
			var item = document.createElement("li");

			var header = document.createElement("p");
			header.innerText = user_nickname + " answered " + answer;
			item.appendChild(header);

			answersList.appendChild(item);

			if(!(answer in frequency_table)){
				frequency_table[answer] = 0;
			}
			frequency_table[answer] = frequency_table[answer] + 1;
		}

		data = [];
		var keys = Object.keys(frequency_table);

		for (var i = 0; i < keys.length; i++) {
			var answer = keys[i];
			var count = frequency_table[answer];

			data.push({ "answer": answer, "frequency": count });
		}

		// set the dimensions and margins of the graph
		var margin = {top: 20, right: 20, bottom: 30, left: 40},
			width = 960 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;
		
		// set the ranges
		var x = d3.scaleBand()
				  .range([0, width])
				  .padding(0.1);
		var y = d3.scaleLinear()
				  .range([height, 0]);
		//append the svg object to the body of the page
		// append a 'group' element to 'svg'
		// moves the 'group' element to the top left margin
		var svg = d3.select("body").append("svg").lower()
		.attr("class", "graph-svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
		// Scale the range of the data in the domains
		x.domain(data.map(function(d) { return d.answer; }));
	 	y.domain([0, d3.max(data, function(d) { return d.frequency; })]);
				  
		// append the rectangles for the bar chart
		svg.selectAll(".bar").data(data)
		.enter().append("rect").attr("fill", "steelblue")
		.attr("class", "bar")
	    .attr("x", function(d) { return x(d.answer); })
		.attr("width", x.bandwidth())
	    .attr("y", function(d) { return y(d.frequency); })
	    .attr("height", function(d) { return height - y(d.frequency); });
  
		// add the x Axis
		svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));
  
		// add the y Axis
		svg.append("g")
		.call(d3.axisLeft(y));
	  
	  
	}
};
xhttp.open("GET", "question_answers?session=" + sessionNickname + "&question=" + questionNumber, true);
xhttp.send();
