        function chargerConducteur() {
            const id = document.getElementById("actorId").value;
            fetch(`/api/actors/${id}`)
                .then(response => response.json())
                .then(data => {
                    const div = document.getElementById("infosConducteur");
                    div.innerHTML = `
                        <p><strong>Nom :</strong> ${data.firstname} ${data.lastname}</p>
                        <p><strong>Email :</strong> ${data.email}</p>
                        <p><strong>Note actuelle :</strong> ${data.note}</p>
                        <p><strong>Avis :</strong> ${data.avis}</p>
                    `;
                })
                .catch(error => {
                    alert("Conducteur introuvable !");
                    console.error(error);
                });
        }

        function envoyerAvis() {
            const id = document.getElementById("actorId").value;
            const avis = {
                note: document.getElementById("note").value,
                avis: document.getElementById("avis").value
            };

            fetch(`/api/actors/${id}/avis`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(avis)
            })
            .then(response => {
                if (response.ok) {
                    alert("Avis envoyé avec succès !");
                    chargerConducteur(); // Recharger les données
                } else {
                    alert("Erreur lors de l'envoi de l'avis.");
                }
            });
        }
   