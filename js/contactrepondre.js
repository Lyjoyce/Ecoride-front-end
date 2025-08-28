async function loadContacts() {
    const res = await fetch("http://localhost:8082/api/contact");
    const contacts = await res.json();

    const select = document.getElementById("contactSelect");
    contacts.forEach(contact => {
        const option = document.createElement("option");
        option.value = contact.id;
        option.textContent = `${contact.name} - ${contact.email}`;
        select.appendChild(option);
    });
}

async function sendReply() {
    const contactId = document.getElementById("contactSelect").value;
    const responseText = document.getElementById("responseText").value;

    const res = await fetch(`http://localhost:8082/api/contacts/${contactId}/repondre`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(responseText)
    });

    const msg = document.getElementById("statusMsg");
    if (res.ok) {
        msg.textContent = "Réponse enregistrée ✅";
        msg.style.color = "green";
    } else {
        msg.textContent = "Erreur lors de l'envoi ❌";
        msg.style.color = "red";
    }
}

window.onload = loadContacts;
