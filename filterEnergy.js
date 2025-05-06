//Choisir le niveau de energy

document.querySelectorAll(".energy-btn").forEach((btn) => {
    btn.addEventListener("click", function() {
        const level = btn.getAttribute("data-level")
        loadCarpoolings(level)
    })
})
let currentCarpoolingIndex = 0
let carpoolings =[]
let selectedEnergy = ""

//Chargement des carpoolings en fonction du filtre
async function loadCarpoolings(energy){
    try{
        const response = await fetch ("/frontend_ecoride/filterEnergy.json")

        if (!response.ok){
            throw new Error(`Erreur HTTP: ${response.status}`)
        }
        const allCarpoolings = await response.json()

//Filtrer les 
       carpoolings = allCarpoolings.filter((c) => c.energy === energy)
       selectedEnergy = energy
       currentCarpoolingIndex = 0

      startFilterEnergy()
    }
    catch (error) {
        console.error("Erreur lors du chargement des carpoolings", error)
    }
}

//Démarrer le quiz
function startFilterEnergy() {
    document.querySelector(".energy-selection").classList.add("hidden")
    document.getElementById("filter-container").classList.remove("hidden")
    showCarpooling()
}

//Afficher 

function showCarpooling() {
    if(currentCarpoolingIndex < carpoolings.length) {
        const carpoolingData = carpoolings[currentCarpoolingIndex]
        const carpoolingContainer= document.getElementById("filter-container")

        carpoolingContainer.innerHTML = `
        <div class"carpooling">
        <p> ${carpoolingData.carpooling} <p/>
        <div/>
        <form id="filter-form">
         ${carpoolingData.options
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

//Soumettre le choix
function submitAnswer(){
    const form = document.getElementById("filter-form")
    const selectAnswer = form.answer.value

    if (!selectAnswer){
        alert("Veuillez sélectionner une réponse")
        return
    }
    //Vérifier la réponse et passer à la suivante
    checkAnswer(selectAnswer)
    nextCarpooling()
}
function nextCarpooling(){
    currentCarpoolingIndex++
    showCarpooling()
}
// Vérifier si la réponse est correcte
function checkAnswer(selectAnswer) {
    const currentCarpooling = carpoolings [currentCarpoolingIndex]
    if (selectAnswer === currentCarpooling.answer){
        incrementScore()
    }
}
//Incrémenter 

let score = 0
function incrementScore() {
    score++
}
//Afficher le résultat final
function showFinalResult() {
    const filterContainer = document.getElementById("filter-container")
    filterContainer.innerHTML = `
    <div id="result">
    <p>Votre score final est de ${score} sur ${carpoolings.length}.</p>
    </div>
    `
}
//
/*
function submitQuiz() {
    calculateScore(function(score) {
        displayResult(score, function() {
            handleMessage(score)
        })
    })
}
    */