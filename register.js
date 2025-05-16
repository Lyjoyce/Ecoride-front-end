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

    // Validation de base
    if (!firstname || !lastname || !email || !password) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Adresse email invalide.");
        return;
    }

    const url = "http://localhost:8081/api/v1/actor/addNewActor";

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
