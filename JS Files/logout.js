document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (event) => {
            event.preventDefault(); 
            
            localStorage.clear(); 
            sessionStorage.clear();

            window.location.href = "../HTML Files/index.html"; 
        });
    }
});