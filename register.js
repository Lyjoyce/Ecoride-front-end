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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  const roleSelect = document.getElementById("role");
  const seatAvailableContainer = document.getElementById("seatAvailable-container");
  const passwordInput = document.getElementById("password");

  const letter = document.getElementById("letter");
  const capital = document.getElementById("capital");
  const number = document.getElementById("number");
  const length = document.getElementById("length");

  // Affichage dynamique du champ seatAvailable
  roleSelect.addEventListener("change", () => {
    if (roleSelect.value === "ROLE_PASSAGER") {
      seatAvailableContainer.style.display = "block";
      document.getElementById("seatAvailable").setAttribute("required", true);
    } else {
      seatAvailableContainer.style.display = "none";
      document.getElementById("seatAvailable").removeAttribute("required");
    }
  });

  // Validation dynamique du mot de passe
  passwordInput.addEventListener("input", () => {
    const value = passwordInput.value;

    letter.classList.toggle("valid", /[a-z]/.test(value));
    letter.classList.toggle("invalid", !/[a-z]/.test(value));

    capital.classList.toggle("valid", /[A-Z]/.test(value));
    capital.classList.toggle("invalid", !/[A-Z]/.test(value));

    number.classList.toggle("valid", /\d/.test(value));
    number.classList.toggle("invalid", !/\d/.test(value));

    length.classList.toggle("valid", value.length >= 14);
    length.classList.toggle("invalid", value.length < 14);
  });

  // Soumission du formulaire
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      firstname: form.firstname.value.trim(),
      lastname: form.lastname.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value,
      telephone: form.telephone.value.trim(),
      role: form.role.value,
    };

    if (form.role.value === "ROLE_PASSAGER") {
      data.seatAvailable = parseInt(form.seatAvailable.value);
    }

    // Validation basique email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert("Adresse email invalide.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8082/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        alert("Inscription réussie !");
        console.log("Token reçu :", result.token);
        localStorage.setItem("token", result.token);
        window.location.href = "login.html";
      } else {
        const errorText = await response.text();
        alert("Erreur : " + errorText);
      }
    } catch (err) {
      alert("Une erreur s’est produite : " + err.message);
      console.error("Erreur réseau :", err);
    }
  });
});
