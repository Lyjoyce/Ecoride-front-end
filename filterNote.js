/*
//Vérifier l'authentification de l'utilisateur
document.addEventListener("DOMcontentLoaded", function () {
    const storedUsername = localStorage.getItem("username")
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (storedUsername && isAuthenticated === "true") {
        showUserMenu(storedUsername)
    } else {
        window.location.href = "login.html"
    }
})
//
function checkAuth(){
    const isAuthenticated =localStorage.getItem("isAuthenticated")
    if(isAuthenticated !== "true"){
        alert("Veuillez vous connecter") 
        window.location.href="login.html"
    }
}

// Afficher le menu utilisateur 
function showUserMenu(username) {
    const unsernameDisplay = document.getElementById("username-display")
    usernameDisplay.textContent = username
    }
// Gérer la déconnexion
document.getElementById("logout-btn").addEventListener("click", function(){
    localStorage.setItem("isAuthenticated", false)
    window.location.href = "login.html"
})

/**
 * cette function affiche username dans le span, le nom utilisateur du localStorage
 * @param {*} username 
 
function showUserMenu(username){
    const usernameDisplay= document.getElementById("username-display")
    usernameDisplay.textContent= username
}
//Unefois le DOM chargé, la fonction récupère l'username ()=>
document.addEventListener("DOMContentLoaded", function(){
    const storedUsername= localStorage.getItem("username")
    const isAuthenticated= localStorage.getItem("isAuthenticated")
    if(storedUsername && isAuthenticated === "true"){

        const usernameDisplay= document.getElementById("username-display")
        usernameDisplay.textContent= storedUsername 

        showUserMenu(storedUsername)

    }else{
        window.location.href="login.html"
    }
})

*/
//////////////////////////////////////////



//Choisir le niveau de note

document.querySelectorAll(".note-btn").forEach((btn) => {
    btn.addEventListener("click", function() {
        const level = btn.getAttribute("data-level")
        loadCarpools(level)
    })
})
let currentCarpoolIndex = 0
let carpools =[]
let selectedNote = ""

//Chargement des questions en fonction du niveau sélectionné
//const URL= "https://46921d2a-73a6-436b-aca9-deb6e9823b49.mock.pstmn.io/api/AllQuestions"

async function loadCarpools(note){
    try{
        const response = await fetch ("/frontend_ecoride/filterNote.json")

        if (!response.ok){
            throw new Error(`Erreur HTTP: ${response.status}`)
        }
        const allCarpools = await response.json()

//Filtrer les questions par diff
       carpools = allCarpools.filter((c) => c.note === note)
       selectedNote = note
       currentCarpoolIndex = 0

      startFilterNote()
    }
    catch (error) {
        console.error("Erreur lors du chargement des carpools", error)
    }
}

//Démarrer le quiz
function startFilterNote() {
    document.querySelector(".note-selection").classList.add("hidden")
    document.getElementById("filter-container").classList.remove("hidden")
    showCarpool()
}

//Afficher la question actuelle

function showCarpool() {
    if(currentCarpoolIndex < carpools.length) {
        const carpoolData = carpools[currentCarpoolIndex]
        const carpoolContainer= document.getElementById("filter-container")

        carpoolContainer.innerHTML = `
        <div class"carpool">
        <p> ${carpoolData.carpool} <p/>
        <div/>
        <form id="filter-form">
         ${carpoolData.options
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
    nextCarpool()
}
function nextCarpool(){
    currentCarpoolIndex++
    showCarpool()
}
// Vérifier si la réponse est correcte
function checkAnswer(selectAnswer) {
    const currentCarpool = carpools[currentCarpoolIndex]
    if (selectAnswer === currentCarpool.answer){
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
    const filterContainer = document.getElementById("filter-container")
    filterContainer.innerHTML = `
    <div id="result">
    <p>Votre score final est de ${score} sur ${carpools.length}.</p>
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
/*
function calculateScore(callback){
    const correctAnswers ={
        q1:"Paris",
        q2:"Mercure",
        q3:"Jupiter",
    }
    const form = document.getElementById("quiz-form")
    let score=0
    for(const question in correctAnswers){
        const userAnswers= form[question].value
        if(userAnswers===correctAnswers[question]){
            score++
        }
    }
    callback(score)
}
//une fonction qui a la responsabilité d'afficher un mss en f° du score

  /*
  @param {*int} score 
 */
/*
function handleMessage(score){
    const resultDIV = document.getElementById("result")

    //To clean the result on page
    resultDIV.classList.remove("excellent","good","try-again")
    if(score===10){
        resultDIV.innerHTML+=" <br>Excellent!"
        resultDIV.classList.add("excellent")
        }else if(score===7){
        resultDIV.innerHTML+=" <br>Bon travail, vous pouvez vous améliorer!"
        resultDIV.classList.add("good")
        }else{
        resultDIV.innerHTML+=" <br>Vous pouvez faire mieux!"
        resultDIV.classList.add("try-again")
    }
}
//COOKIE
document.cookie = "username=zaz; expires=Fri, 01 aout 2025 12:00:00 UTC";

*/