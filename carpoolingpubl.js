document.getElementById("carpooling-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const actorId = localStorage.getItem("actorId"); // à stocker au login
    const itinerary = document.getElementById("itinerary").value;
    const date = document.getElementById("date").value;
    const nbplaces = document.getElementById("nbplaces").value;
    const depart = document.getElementById("depart").value;
    const arrivee = document.getElementById("arrivee").value;

    const carpooling = {
        actorId,
        itinerary,
        date,
        nbplaces,
        depart,
        arrivee
    };

    try {
        const response = await fetch("http://localhost:8081/api/v1/carpooling/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(carpooling)
        });

        if (response.ok) {
            alert("Trajet proposé avec succès !");
        } else {
            alert("Erreur lors de la publication du trajet.");
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
});
