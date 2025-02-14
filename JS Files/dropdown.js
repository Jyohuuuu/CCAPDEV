document.addEventListener("DOMContentLoaded", function () {
    // Create the dropdown menu HTML
    var dropdownHTML = `
        <div class="dropdown-menu" id="dropdownMenu">
            <ul>
                <li><a href="settings.html">Settings</a></li>
                <li><a href="logout.html">Logout</a></li>
            </ul>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", dropdownHTML);
});

function toggleMenu() {
    var menu = document.getElementById("dropdownMenu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

document.addEventListener("click", function (event) {
    var menu = document.getElementById("dropdownMenu");
    var menuButton = document.querySelector(".menu-icon");

    if (menu && !menu.contains(event.target) && (!menuButton || !menuButton.contains(event.target))) {
        menu.style.display = "none";
    }
});
