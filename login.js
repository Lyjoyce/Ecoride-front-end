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

    // Gestion des erreurs HTTP
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || response.statusText;
      throw new Error(message);
    }

    const actor = await response.json();

    localStorage.setItem("firstname", actor.firstname);
    localStorage.setItem("credits", actor.credits);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("token", actor.token); // accessToken
    localStorage.setItem("refreshToken", actor.refreshToken); // refreshToken
    console.log(actor)
    window.location.href = "index.html";

  } catch (error) {
    console.error("Erreur :", error);
    alert("Erreur : " + error.message);
  }
}

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    login();
  });
}

function showUserMenu(firstname) {
  const firstnameDisplay = document.getElementById("actorname-display");
  if (firstnameDisplay) {
    firstnameDisplay.textContent = escapeHtml(firstname);
  }
}

const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });
}

// Option : protection d'accès à certaines pages
function checkAuth() {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  if (isAuthenticated !== "true") {
    alert("Veuillez vous connecter");
    window.location.href = "login.html";
  }
}

const token = localStorage.getItem("token"); // Assure-toi qu’il est stocké


async function fetchWithAutoRefresh(url, options = {}) {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  // 1. Essai avec le token actuel
  let response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    }
  });

  // 2. Si 401 (Unauthorized), on tente le rafraîchissement
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

      // Réessai avec le nouveau token
      response = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          "Content-Type": "application/json",
          "Authorization": "Bearer " + data.token,
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

/*
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
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8081/api/v1/actor/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur de connexion.");
    }

    const actor = await response.json();
    localStorage.setItem("firstname", actor.firstname);
    localStorage.setItem("credits", actor.credits);
    localStorage.setItem("isAuthenticated", "true");

    window.location.href = "index.html";
  } catch (error) {
    console.error("Erreur :", error);
    alert("Erreur : " + error.message);
  }
}
// Gérer soumission du formulaire
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
/*
function checkAuth() {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated !== "true") {
        alert("Veuillez vous connecter");
        window.location.href = "login.html";
    }
}
*/

