/* Hard Coded Users */
const users = [
    { email: "user1@gmail.com", password: "password1" },
    { email: "user2@gmail.com", password: "password2" },
    { email: "user3@gmail.com", password: "password3" },
    { email: "admin1@gmail.com", password: "adminpass1" },
    { email: "admin2@gmail.com", password: "adminpass2" },
];

function login(event) {
    event.preventDefault(); /* Prevent the from submitting and messing stuff up */

    const email = document.getElementById("email").value.trim(); /*Trim the white space */
    const password = document.getElementById("password").value.trim();
    const errorElement = document.getElementById("error");
    const user = users.find(user => user.email === email && user.password === password); /* Find a user with the correct fields*/

    if (user) {
        console.log("User found:", user);
        alert("Login successful!");
        window.location.href = "homigo_homepage.html";
    } else {
        if (errorElement) {
            errorElement.textContent = "Invalid email or password.";
        } else {
            alert("Invalid email or password.");
        }
    }
}

function signup_guest(event) {
    /* TBD when backend is implemented */
}

function signup_host(event) {
    /* TBD when backend is implemented */
}