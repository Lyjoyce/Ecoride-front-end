document.getElementById('searchForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const fromCity = document.getElementById('fromCity').value.trim().toLowerCase();
  const toCity = document.getElementById('toCity').value.trim().toLowerCase();

  const departureDate = document.getElementById('departureDate').value;
  const departureTime = document.getElementById('departureTime').value;
  const arrivalDate = document.getElementById('arrivalDate').value;
  const arrivalTime = document.getElementById('arrivalTime').value;

  const minNote = parseInt(document.getElementById('minNote').value, 10);
  const energyType = document.getElementById('energyType').value.trim().toLowerCase();
  const maxPrice = parseInt(document.getElementById('maxPrice').value, 10);

  if (!fromCity || !toCity) {
    document.getElementById('result').innerText = "Veuillez au minimum renseigner la ville de départ et d'arrivée.";
    return;
  }

  fetch('search.json')
    .then(response => {
      if (!response.ok) throw new Error('Erreur lors du chargement du fichier JSON');
      return response.json();
    })
    .then(data => {
      const filtered = data.filter(trajet => {
        if (trajet.fromCity.toLowerCase() !== fromCity) return false;
        if (trajet.toCity.toLowerCase() !== toCity) return false;
        if (departureDate && trajet.departureDate !== departureDate) return false;
        if (departureTime && trajet.departureTime !== departureTime) return false;
        if (arrivalDate && trajet.arrivalDate !== arrivalDate) return false;
        if (arrivalTime && trajet.arrivalTime !== arrivalTime) return false;

        // Filtre note minimale
        if (!isNaN(minNote) && trajet.note) {
          if (parseInt(trajet.note, 10) < minNote) return false;
        }

        // Filtre énergie
        if (energyType && trajet.energy) {
          if (trajet.energy.toLowerCase() !== energyType) return false;
        }

        // Filtre prix max
        if (!isNaN(maxPrice) && trajet.price) {
          // On extrait la partie numérique du prix, exemple "6 credits"
          const priceNum = parseInt(trajet.price.replace(/\D/g, ''), 10);
          if (priceNum > maxPrice) return false;
        }

        return true;
      });

      if (filtered.length > 0) {
        let html = `<h3>Trajets trouvés (${filtered.length}) :</h3><ul>`;
        filtered.forEach(t => {
          html += `<li>
            <strong>De ${t.fromCity} à ${t.toCity}</strong><br>
            Départ : ${t.departureDate} à ${t.departureTime}<br>
            Arrivée : ${t.arrivalDate} à ${t.arrivalTime}<br>
            Option : ${t.option || "Non précisé"}<br>
            Énergie : ${t.energy || "Non précisé"}<br>
            Conducteur : ${t.conducteur || "Non précisé"}<br>
            Places dispo : ${t.seatAvailable || "Non précisé"}<br>
            Prix : ${t.price || "Non précisé"}<br>
            Note : ${t.note || "Non précisé"}<br>
            Durée : ${t.duree || "Non précisé"}<br>
            Jour : ${t.jour || "Non précisé"}
          </li><br>`;
        });
        html += '</ul>';
        document.getElementById('result').innerHTML = html;

        // Affiche les critères du premier trajet filtré (exemple)
        const t = filtered[0];
        const selectedData = {
          option: t.option,
          energy: t.energy,
          conducteur: t.conducteur,
          seatAvailable: t.seatAvailable,
          price: t.price,
          note: t.note,
          duree: t.duree,
          jour: t.jour
        };
        document.getElementById("critere").textContent = JSON.stringify(selectedData, null, 2);
      } else {
        document.getElementById('result').innerText = 'Aucun trajet ne correspond à votre recherche.';
        document.getElementById('critere').textContent = '';
      }
    })
    .catch(err => {
      document.getElementById('result').innerText = 'Erreur lors du chargement des trajets.';
      console.error(err);
    });
});

fetch("http://localhost:8082/api/v1/carpooling/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    fromCity: "Rouen",
    toCity: "Deauville",
    departureDate: "2025-06-30"
  })
})
  .then(response => response.json())
  .then(data => {
    console.log("Réponse backend :", data);
  })
  .catch(error => {
    console.error("Erreur : ", error);
  });



/*
fetchWithAutoRefresh("http://localhost:8082/api/v1/carpooling/create", {
  method: "POST",
  body: JSON.stringify({
    fromCity: "Rouen",
    toCity: "Deauville",
    departureDate: "2025-06-30"
  })
})
  .then(data => {
    console.log("Réponse backend :", data);
  })
  .catch(error => {
    console.error("Erreur : ", error);
  });
*/

