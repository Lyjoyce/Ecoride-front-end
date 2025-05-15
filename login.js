
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }
    return text.replace(/[&<>"']/g, (m) => map[m])
}
async function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    try {
        console.log("Tentative de connexion avec :", email, password);

        const response = await fetch("http://localhost:8081/api/v1/actor/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const actor = await response.json();

            localStorage.setItem("firstname", actor.firstname);
            localStorage.setItem("credits", actor.credits);
            localStorage.setItem("isAuthenticated", "true");

            window.location.href = "index.html";
        } else {
            const errorMessage = await response.text();
            alert("Erreur de connexion : " + errorMessage);
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
        alert("Une erreur réseau s'est produite.");
    }
}

function showUserMenu(firstname) {
    const firstnameDisplay = document.getElementById("actorname-display");
    if (firstnameDisplay) {
        firstnameDisplay.textContent = escapeHtml(firstname);
    }
}

function checkAuth() {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated !== "true") {
        alert("Veuillez vous connecter");
        window.location.href = "login.html";
    }
}
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault(); 
    login(); 
});

