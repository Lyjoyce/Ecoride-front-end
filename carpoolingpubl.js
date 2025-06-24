/*
const token = localStorage.getItem("token");

fetch("http://localhost:8082/api/v1/URL_SECURISEE", {
  method: "HTTP_METHOD", // "GET", "POST", "PUT", etc.
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  },
  body: JSON.stringify({
    // Ton corps JSON ici (si POST/PUT)
  })
})
  .then(response => {
    if (!response.ok) {
      throw new Error("Erreur " + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log("Réponse :", data);
    // Ajoute ici ce que tu veux faire avec les données
  })
  .catch(error => {
    console.error("Erreur :", error);
    alert("Erreur : " + error.message);
  });
*/


document.getElementById("carpooling-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const actorId = localStorage.getItem("actorId"); // à stocker au login
    const itinerary = document.getElementById("itinerary").value;
    const date = document.getElementById("date").value;
    const nbplaces = document.getElementById("nbplaces").value;
    const depart = document.getElementById("depart").value;
    const arrivee = document.getElementById("arrivee").value;

    /*
    {
  "fromCity": "Paris",
  "toCity": "Lyon",
  "departureLocation": "...",
  "arrivalLocation": "...",
  "departureDate": "2025-06-25",
  "departureTime": "08:00",
  "arrivalDate": "2025-06-25",
  "arrivalTime": "12:00",
  "price": 30,
  "seatAvailable": 3,
  "voitureId": 1
}
*/

    const carpooling = {
        actorId,
        fromCity,
        toCity,
        departureLocation,
        arrivalLocation,
        departureDate,
        departureTime,
        arrivalDate,
        arrivalTime,
        price,
        seatAvailable,
        voitureId
    };

    try {
        const response = await fetch("http://localhost:8082/api/v1/carpooling/create", {
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
