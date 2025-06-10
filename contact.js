document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const responseMessage = document.getElementById("responseMessage");

    const contactData = { name, email, message };

    try {
        const response = await fetch("http://localhost:8082/api/contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contactData)
        });

        if (response.ok) {
            responseMessage.textContent = "Message envoyé avec succès ✅";
            responseMessage.style.color = "green";
            document.getElementById("contactForm").reset();
        } else {
            const errorData = await response.json();
            responseMessage.textContent = errorData.message || "Erreur lors de l'envoi ❌";
            responseMessage.style.color = "red";
        }

    } catch (error) {
        responseMessage.textContent = "Erreur réseau ou serveur indisponible ❌";
        responseMessage.style.color = "red";
        console.error(error);
    }
});