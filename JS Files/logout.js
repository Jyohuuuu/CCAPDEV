document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    const logoutModal = document.getElementById("logoutModal");
    const confirmLogout = document.getElementById("confirmLogout");
    const cancelLogout = document.getElementById("cancelLogout");

    // Hide modal on page load
    logoutModal.style.display = "none";

    //Popup
    logoutBtn.addEventListener("click", () => {
        logoutModal.style.display = "flex";
    });

    cancelLogout.addEventListener("click", () => {
        logoutModal.style.display = "none"; // Hide the modal
    });

    //Log out logic
    confirmLogout.addEventListener("click", () => {
        logoutModal.style.display = "none";
        alert("Logged out successfully!");
        window.location.href = "index.html"; // Redirect to login page
    });

    // Close modal if user clicks outside of it
    window.addEventListener("click", (event) => {
        if (event.target === logoutModal) {
            logoutModal.style.display = "none";
        }
    });
});
