//Choisir le niveau de difficulté

document.querySelectorAll(".difficulty-btn").forEach((btn) => {
    btn.addEventListener("click", function() {
        const level = btn.getAttribute("data-level")
        loadQuestions(level)
    })
})
let currentQuestionIndex = 0
let questions =[]
let selectedDifficulty = ""

//Chargement des questions en fonction du niveau sélectionné
//const URL= "https://46921d2a-73a6-436b-aca9-deb6e9823b49.mock.pstmn.io/api/AllQuestions"

async function loadQuestions(difficulty){
    try{
        const response = await fetch ("/frontend_ecoride/questions.json")

        if (!response.ok){
            throw new Error(`Erreur HTTP: ${response.status}`)
        }
        const allQuestions = await response.json()

//Filtrer les questions par diff
        questions = allQuestions.filter((q) => q.difficulty === difficulty)
        selectedDifficulty = difficulty
        currentQuestionIndex = 0

        startQuiz()
    }
    catch (error) {
        console.error("Erreur lors du chargement des questions", error)
    }
}

//Démarrer le quiz
function startQuiz() {
    document.querySelector(".difficulty-selection").classList.add("hidden")
    document.getElementById("quiz-container").classList.remove("hidden")
    showQuestion()
}

//Afficher la question actuelle
function showQuestion() {
    if(currentQuestionIndex < questions.length) {
        const questionData = questions[currentQuestionIndex]
        const questionContainer= document.getElementById("quiz-container")

        questionContainer.innerHTML = `
        <div class"question">
        <p> ${questionData.question} <p/>
        <div/>
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
            <button type="button" onclick="submitAnswer()">Soumettre</button>
        </form>
        `
        }else{
            showFinalResult()
        }
}