
document.querySelectorAll(".region-btn").forEach((btn) =>{
    btn.addEventListener("click", function () {
        const level = btn.getAttribute("data-level")
        loadQuestions(level)
    })
})

let currentQuestionIndex =0
let questions = []
let selectedRegion = ""

async function loadQuestions(region){
    try{
        const response = await fetch("carpoolings.json")

        if (!response.ok){
            throw new Error(`Erreur HTTP: ${response.status}`)
        }
        const allQuestions = await response.json()
       
//Filtrer les questions
        questions= allQuestions.filter((q) => q.region === region)
        selectedRegion = region
        currentQuestionIndex = 0

        startQuiz()
    }
    catch (error) {
        console.error("Erreur lors du chargement des questions", error)
    }
}
function startQuiz() {
    document.querySelector(".region-selection").classList.add("hidden")
    document.getElementById("quiz-container").classList.remove("hidden")
    showQuestion()
}

function showQuestion() {
    if (currentQuestionIndex < questions.length) {
        const questionData = questions[currentQuestionIndex];
        const questionContainer = document.getElementById("quiz-container");

        questionContainer.innerHTML = `
            <div class="question-info">
                <h2>Itinéraire : ${questionData.itinerary}</h2>
                <p><strong>Conducteur :</strong> ${questionData.conducteur}</p>
                <p><strong>Véhicule :</strong> ${questionData.marque} ${questionData.modele} (${questionData.couleur})</p>
                <p><strong>Note :</strong> ${questionData.note} / 5</p>
                <p><strong>Prix :</strong> ${questionData.price}</p>
                <p><strong>Durée :</strong> ${questionData.duree}</p>
                <p><strong>Départ :</strong> ${questionData.depart} à ${questionData["depart-hour"]}</p>
                <p><strong>Arrivée :</strong> ${questionData.arrived} à ${questionData["arrived-hour"]}</p>
                <p><strong>Nombre de places :</strong> ${questionData.nbplaces} / Places dispo : ${questionData.seatdispo}</p>
                <p><strong>Préférences :</strong> Animaux : ${questionData.animal} / Fumeur : ${questionData.nosmoke}</p>
            </div>

            <div class="question-lists">
                <h3>Options de trajet :</h3>
                <ul>
                    ${questionData.options.map(opt => `<li>${opt}</li>`).join("")}
                </ul>

                <h3>Types d'énergie :</h3>
                <ul>
                    ${questionData.energy.map(en => `<li>${en}</li>`).join("")}
                </ul>

                <h3>Jours de départ possibles :</h3>
                <ul>
                    ${questionData["depart-day"].map(j => `<li>${j}</li>`).join("")}
                </ul>

                <h3>Réponses acceptées :</h3>
                <ul>
                    ${questionData.answer.map(a => `<li>${a}</li>`).join("")}
                </ul>
            </div>

            <form id="quiz-form">
                <h3>Choisissez votre jour :</h3>
                ${questionData.answer.map(option => `
                    <label class="option">
                        <input type="radio" name="answer" value="${option}">
                        <span class="custom-radio"></span>
                        ${option}
                    </label>
                `).join("")}

                <form id="quiz-form">
   
    <h3>Choisissez une option de trajet :</h3>
    ${questionData.options.map(opt => `
        <label class="option">
            <input type="radio" name="option" value="${opt}">
            <span class="custom-radio"></span>
            ${opt}
        </label>
    `).join("")}

    <h3>Choisissez une énergie :</h3>
    ${questionData.energy.map(en => `
        <label class="option">
            <input type="radio" name="energy" value="${en}">
            <span class="custom-radio"></span>
            ${en}
        </label>
    `).join("")}

    <h3>Préférences :</h3>
    ${questionData.preferences.map(pref => `
        <label class="option">
            <input type="checkbox" name="preferences" value="${pref}">
            <span class="custom-checkbox"></span>
            ${pref}
        </label>
    `).join("")}

     
                <button class="participate" type="button" onclick="submitAnswer()">Participer</button>
            </form>
        `;
          
    } else {
        showFinalResult();
    }
}

function submitAnswer() {
    const form = document.getElementById("quiz-form");

    const selectedAnswer = form.querySelector('input[name="answer"]:checked');
    const selectedOption = form.querySelector('input[name="option"]:checked');
    const selectedEnergy = form.querySelector('input[name="energy"]:checked');
    const selectedPreferences = Array.from(form.querySelectorAll('input[name="preferences"]:checked')).map(input => input.value);

    if (!selectedAnswer || !selectedOption || !selectedEnergy) {
        alert("Veuillez sélectionner une réponse, une option de trajet et une énergie.");
        return;
    }

    const userAnswer = selectedAnswer.value;
    const userOption = selectedOption.value;
    const userEnergy = selectedEnergy.value;

    const questionData = questions[currentQuestionIndex];
    const correctAnswers = questionData.answer;

    const resultContainer = document.getElementById("result");

    let resultHTML = `<p><strong>Votre choix :</strong><br>
        Jour : ${userAnswer} <br>
        Option : ${userOption} <br>
        Énergie : ${userEnergy} <br>
        Préférences : ${selectedPreferences.join(", ") || "aucune"}
    </p>`;

    if (correctAnswers.includes(userAnswer)) {
        resultHTML += `<p class="success">✅Pour participer, veuillez vous connecter</p>`;
    } else {
        resultHTML += `<p class="error">❌ Mauvaise réponse. Réponses attendues : ${correctAnswers.join(", ")}</p>`;
    }
    resultContainer.innerHTML = resultHTML;
}
   


