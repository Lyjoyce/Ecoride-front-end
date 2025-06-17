function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

document.getElementById("register-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const firstname = document.getElementById("firstname").value.trim();
    const lastname = document.getElementById("lastname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    
    if (!firstname || !lastname || !email || !password) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Adresse email invalide.");
        return;
    }

    const url = "http://localhost:8082/api/v1/actor/addNewActor";

    const userData = {
        firstname,
        lastname,
        email,
        password,
        credits: 20
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Utilisateur inscrit avec succès :", data);
            alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
            window.location.href = "login.html";
        } else {
            const errorData = await response.json().catch(() => ({}));
            const message = errorData.message || response.statusText;
            alert("Erreur lors de l'inscription : " + message);
            console.warn("Réponse erreur :", errorData);
        }

    } catch (error) {
        console.error("Erreur réseau :", error);
        alert("Une erreur réseau s'est produite. Veuillez réessayer plus tard.");
    }
});

function showUserMenu(firstname) {
    const firstnameDisplay = document.getElementById("actorname-display");
    if (firstnameDisplay) {
        firstnameDisplay.textContent = escapeHtml(firstname);
    }
}

const passwordInput = document.getElementById("password");
const letter = document.getElementById("letter");
const capital = document.getElementById("capital");
const number = document.getElementById("number");
const length = document.getElementById("length");

passwordInput.addEventListener("input", function () {
    const value = passwordInput.value;

    if (/[a-z]/.test(value)) {
        letter.classList.remove("invalid");
        letter.classList.add("valid");
    } else {
        letter.classList.remove("valid");
        letter.classList.add("invalid");
    }

    if (/[A-Z]/.test(value)) {
        capital.classList.remove("invalid");
        capital.classList.add("valid");
    } else {
        capital.classList.remove("valid");
        capital.classList.add("invalid");
    }

    if (/\d/.test(value)) {
        number.classList.remove("invalid");
        number.classList.add("valid");
    } else {
        number.classList.remove("valid");
        number.classList.add("invalid");
    }

    if (value.length >= 14) {
        length.classList.remove("invalid");
        length.classList.add("valid");
    } else {
        length.classList.remove("valid");
        length.classList.add("invalid");
    }
});
