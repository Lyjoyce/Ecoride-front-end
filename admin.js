document.getElementById('employeeForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('employeeName').value;
      const email = document.getElementById('employeeEmail').value;
      const password = document.getElementById('employeePassword').value;

      // Appel à ton backend ici
      fetch('/api/v1/admin/create-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      .then(response => response.ok ? alert("Employé créé !") : alert("Erreur création"))
      .catch(err => console.error(err));
    });

    // Fake Data – à remplacer par API backend
    const carpoolData = {
      labels: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
      datasets: [{
        label: 'Covoiturages',
        data: [5, 9, 7, 10, 6],
        backgroundColor: '#28a745'
      }]
    };

    const creditsData = {
      labels: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
      datasets: [{
        label: 'Crédits gagnés',
        data: [12, 15, 20, 18, 25],
        backgroundColor: '#17a2b8'
      }]
    };

    const totalCredits = creditsData.datasets[0].data.reduce((a, b) => a + b, 0);
    document.getElementById("totalCredits").innerText = totalCredits + " crédits";

    new Chart(document.getElementById("carpoolChart"), {
      type: 'bar',
      data: carpoolData
    });

    new Chart(document.getElementById("creditsChart"), {
      type: 'line',
      data: creditsData
    });

    // Liste des utilisateurs à afficher (FAKE DATA à remplacer)
    const users = [
      { name: "Jean Dupont", email: "jean@example.com", role: "ROLE_PASSAGER", active: true },
      { name: "Marie Curie", email: "marie@example.com", role: "ROLE_EMPLOYE", active: false },
    ];

    const tableBody = document.getElementById('userTable');
    users.forEach(u => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.role}</td>
        <td>${u.active ? 'Actif' : 'Suspendu'}</td>
        <td>
          <button onclick="toggleUser('${u.email}', ${u.active})">
            ${u.active ? 'Suspendre' : 'Réactiver'}
          </button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    function toggleUser(email, isActive) {
      // Appel à une route backend de suspension
      fetch('/api/v1/admin/toggle-user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, suspend: isActive })
      })
      .then(response => location.reload())
      .catch(err => console.error(err));
    }