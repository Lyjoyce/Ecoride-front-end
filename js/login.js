// Fonction pour échapper les caractères HTML (prévention XSS)
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

// Fonction asynchrone pour gérer la connexion
async function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8082/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || response.statusText;
      throw new Error(message);
    }

    const actor = await response.json();

    localStorage.setItem("firstname", actor.firstname);
    localStorage.setItem("credits", actor.credits);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("token", actor.token);
    localStorage.setItem("refreshToken", actor.refreshToken);

    window.location.href = "index.html";
  } catch (error) {
    console.error("Erreur :", error);
    alert("Erreur : " + error.message);
  }
}

// Ajout de l'écouteur d'événement sur le formulaire de connexion
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    login();
  });
}

// Affiche le prénom de l'utilisateur connecté dans le menu
function showUserMenu(firstname) {
  const firstnameDisplay = document.getElementById("actorname-display");
  if (firstnameDisplay) {
    firstnameDisplay.textContent = escapeHtml(firstname);
  }
}

// Gestion du bouton de déconnexion
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });
}

// Vérifie que l'utilisateur est authentifié avant accès aux pages protégées
function checkAuth() {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  if (isAuthenticated !== "true") {
    alert("Veuillez vous connecter");
    window.location.href = "login.html";
  }
}

// Fonction fetch avec gestion automatique du rafraîchissement du token JWT
async function fetchWithAutoRefresh(url, options = {}) {
  let token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  // Essai avec le token actuel
  let response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    }
  });

  // Si token expiré, tente le rafraîchissement
  if (response.status === 401 && refreshToken) {
    const refreshResponse = await fetch("http://localhost:8082/api/v1/auth/refresh", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + refreshToken
      }
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      localStorage.setItem("token", data.token);
      token = data.token;

      // Nouvelle requête avec le token rafraîchi
      response = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        }
      });
    } else {
      alert("Session expirée, veuillez vous reconnecter.");
      window.location.href = "login.html";
      return;
    }
  }

  if (!response.ok) {
    throw new Error("Erreur HTTP : " + response.status);
  }

  return response.json();
}
