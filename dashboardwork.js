 // Onglets
    document.querySelectorAll(".tab-button").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
            document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));

            button.classList.add("active");
            document.getElementById(button.dataset.tab).classList.add("active");
        });
    });

    // Chargement messages de contact
    async function loadContacts() {
        const res = await fetch("http://localhost:8082/api/contacts");
        const contacts = await res.json();
        const select = document.getElementById("contactSelect");
        select.innerHTML = "";
        contacts.forEach(c => {
            const option = document.createElement("option");
            option.value = c.id;
            option.textContent = `${c.name} - ${c.email}`;
            select.appendChild(option);
        });
    }

    // Répondre à un contact
    async function sendReply() {
        const id = document.getElementById("contactSelect").value;
        const reply = document.getElementById("responseText").value;
        const status = document.getElementById("contactStatus");

        const res = await fetch(`http://localhost:8082/api/contacts/${id}/repondre`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reponse: reply })
        });

        if (res.ok) {
            status.textContent = "Réponse envoyée ✅";
            status.style.color = "green";
        } else {
            status.textContent = "Erreur lors de l'envoi ❌";
            status.style.color = "red";
        }
    }

    // Chargement des avis
    async function loadAvis() {
        const res = await fetch("http://localhost:8082/api/avis/pending");
        const avisList = await res.json();
        const container = document.getElementById("avisContainer");
        container.innerHTML = "";

        avisList.forEach(avis => {
            const div = document.createElement("div");
            div.className = "avis-item";
            div.innerHTML = `
                <p><strong>Nom conducteur :</strong> ${avis.conducteurName || 'N/A'}</p>
                <p><strong>Note :</strong> ${avis.note}</p>
                <p><strong>Avis :</strong> ${avis.commentaire}</p>
                <button class="action" onclick="validerAvis('${avis.id}')">✅ Valider</button>
            `;
            container.appendChild(div);
        });
    }

    // Valider un avis
    async function validerAvis(id) {
        const res = await fetch(`http://localhost:8082/api/avis/${id}/valider`, {
            method: "PUT"
        });
        const status = document.getElementById("avisStatus");
        if (res.ok) {
            status.textContent = "Avis validé ✅";
            status.style.color = "green";
            loadAvis();
        } else {
            status.textContent = "Erreur lors de la validation ❌";
            status.style.color = "red";
        }
    }

    window.onload = () => {
        loadContacts();
        loadAvis();
    };