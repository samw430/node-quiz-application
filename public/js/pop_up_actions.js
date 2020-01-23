document.getElementById('button').addEventListener("click", function () {
    document.querySelector('.bg-modal').style.display = "flex";
});
document.querySelector('.close').addEventListener("click", function () {
    document.querySelector('.bg-modal').style.display = "none";
});
document.getElementById('questionAddForm').addEventListener("submit", function () {
    var item = document.createElement("li");
    item.classList.add("quiz-question");
    var header = document.createElement("p");
    var close_button = document.createElement("div");

    item.appendChild(header);
    item.appendChild(close_button);

    close_button.classList.add("close");
    close_button.innerText = "+";
    close_button.addEventListener("click", function(){
        var parent = close_button.parentElement;
        parent.parentElement.removeChild(parent);
    });

    header.innerText = document.getElementById("question").value;
    var questionsList = document.getElementById("questions");
    questionsList.appendChild(item);
});
document.getElementById("questionType").addEventListener("change", function () {
    var dropDown = document.getElementById("questionType");
    var test = document.getElementById("test").innerText = dropDown.options[dropDown.selectedIndex].value;
});
