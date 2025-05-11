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
            <button type="button" onclick="submitAnswer()">Participer</button>
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
    <p>Pour réserver{score}1 place, vous devez vous connecter.</p>
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
