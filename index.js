
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
                <button class="participate" type="button" onclick="submitAnswer()">Participer</button>
            </form>
        `;
    } else {
        showFinalResult();
    }
}
function submitAnswer() {
    const form = document.getElementById("quiz-form");
    const selectedOption = form.querySelector('input[name="answer"]:checked');

    if (!selectedOption) {
        alert("Veuillez sélectionner une réponse.");
        return;
    }

    const userAnswer = selectedOption.value;
    const correctAnswers = questions[currentQuestionIndex].answer;

    const resultContainer = document.getElementById("result");
    if (correctAnswers.includes(userAnswer)) {
        resultContainer.innerHTML = `<p>  ${userAnswer} Pour participer, veuillez vous connecter</p>`;
    } else {
        resultContainer.innerHTML = `<p class="error">❌ Mauvaise réponse. Réponses attendues : ${correctAnswers.join(", ")}</p>`;
    }
}
/*
    // Passer à la question suivante après 2 secondes
    setTimeout(() => {
        resultContainer.innerHTML = ""; // Nettoyer le message
        currentQuestionIndex++;
        showQuestion();
    }, 2000);
}





/*
function showFinalResult() {
    const quizContainer = document.getElementById("quiz-container")
    quizContainer.innerHTML = `
    <div id="result">
    <p>Pour réserver 1 place, vous devez vous connecter.</p>
    </div>
    `
}



/*
document.querySelectorAll(".region-btn").forEach((btn) =>{
    btn.addEventListener("click", function () {
        const level = btn.getAttribute("data-level")
        loadQuestions(level)
    })
})

let currentQuestionIndex =0
let questions = []
let selectedRegion = ""


//Chargement des questions en fonction du niveau sélectionné

//const URL= "https://46921d2a-73a6-436b-aca9-deb6e9823b49.mock.pstmn.io/api/AllQuestions"

async function loadQuestions(region){
    try{
        const response = await fetch("questionnaire.json")

        if (!response.ok){
            throw new Error(`Erreur HTTP: ${response.status}`)
        }
        const allQuestions = await response.json()
       
//Filtrer les questions par diff
        questions= allQuestions.filter((q) => q.region === region)
        selectedRegion = region
        currentQuestionIndex = 0

        startQuiz()
    }
    catch (error) {
        console.error("Erreur lors du chargement des questions", error)
    }
}

//Démarrer le quiz
function startQuiz() {
    document.querySelector(".region-selection").classList.add("hidden")
    document.getElementById("quiz-container").classList.remove("hidden")
    showQuestion()
}
//Afficher la question actuelle
function showQuestion() {
    if(currentQuestionIndex < questions.length) {
        console.log(questions)
        const questionData = questions[currentQuestionIndex]
        console.log( "question data" + questionData)
        const questionContainer= document.getElementById("quiz-container")

        questionContainer.innerHTML = `
        <div class="question">
        <p> ${questionData.question} </p>
        </div>
        <form id="quiz-form">
         ${questionData.options
         .map(
                (option, index)=> `
                <label class="option"> 
                    <input type="radio" name="answer" value="${option}">
                    <span class="custom-radio"></span>
                    ${option}
                </label>
                `
                )
            .join("")}
            <button class="participate" type="button" onclick="submitAnswer()">Participer</button>
        </form>
        `
        }else{
            showFinalResult()
        }
}

//Soumettre la réponse actuelle
function submitAnswer(){
    const form = document.getElementById("quiz-form")
    const selectAnswer = form.answer.value

    if (!selectAnswer){
        alert("Veuillez sélectionner une réponse")
        return
    }
    //Vérifier la réponse et passer à la question suivante
    checkAnswer(selectAnswer)
    nextQuestion()
}
function nextQuestion(){
    currentQuestionIndex++
    showQuestion()
}
// Vérifier si la réponse est correcte
function checkAnswer(selectAnswer) {
    const currentQuestion = questions[currentQuestionIndex]
    if (selectAnswer === currentQuestion.answer){
        incrementScore()
    }
}
//Incrémenter le score

let score = 0
function incrementScore() {
    score++
}
//Afficher le résultat final
function showFinalResult() {
    const quizContainer = document.getElementById("quiz-container")
    quizContainer.innerHTML = `
    <div id="result">
    <p>Pour réserver 1 place, vous devez vous connecter.</p>
    </div>
    `
}
//
function submitQuiz() {
    calculateScore(function(score) {
        displayResult(score, function() {
            handleMessage(score)
        })
    })
}
*/