function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

async function login() {
    const firstname = document.getElementById("firstname").value.trim();
    const lastname = document.getElementById("lastname").value.trim();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!firstname || !lastname || !email || !password) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    try {
        console.log("Tentative de connexion avec :", firstname, lastname, email);

        const response = await fetch("http://localhost:8081/api/v1/actor/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstname, lastname, email, password }),
        });

        if (response.ok) {
            const actor = await response.json();

            localStorage.setItem("firstname", actor.firstname);
            localStorage.setItem("lastname", actor.lastname || lastname);
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

document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();
    login();
});


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

//  Déconnexion
/*
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.clear(); // Tout supprimer
            window.location.href = "login.html";
        });
    }

        document.getElementById("logout-btn").addEventListener("click", function(){
            localStorage.removeItem("firstname")
            localStorage.removeItem("password")
            localStorage.setItem("isAuthenticated", false)
            window.location.href= "login.html"
        })
   */
