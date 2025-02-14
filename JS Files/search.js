document.getElementById("toggle-options").addEventListener("click", function() {
    var options = document.getElementById("advanced-options");
    if (options.style.display === "none" || options.style.display === "") {
        options.style.display = "block";
        this.innerHTML = "Advanced Options ▲"; // Change text to collapse
    } else {
        options.style.display = "none";
        this.innerHTML = "Advanced Options ▼"; // Change text to expand
    }
});