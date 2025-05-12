
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }
    return text.replace(/[&<>"']/g, (m) => map[m])
}//LOGIN expliquer la f, ses paramètres,types, ce qu'elle renvoie
function login(){
    const firstname= document.getElementById("login-actorname").value
    const lastname= document.getElementById("login-lastname").value
    const email= document.getElementById("login-email").value
    const password= document.getElementById("login-password").value

    const storedFirstname=localStorage.getItem("actorname")
    const storedLastname=localStorage.getItem("lastname")
    const storedEmail=localStorage.getItem("email")
    const storedPassword=localStorage.getItem("password")

    if(firstname===storedFirstname && lastname===storedLastname && email===storedEmail && password===storedPassword){
        localStorage.setItem("isAuthenticated", true)
        window.location.href="index.html"
    }else{
        alert("nom d'utilisateur ou mot de pass incorrect")
    }
}
function checkAuth(){
    const isAuthenticated =localStorage.getItem("isAuthenticated")
    if(isAuthenticated !== "true"){
        alert("Veuillez vous connecter") 
        window.location.href="login.html"
    }
}
function showFirstnameMenu(firstname){
    const firstnameDisplay= document.getElementById("firstname-display")
    firstnameDisplay.textContent= firstname
}
function showCredits(credits) {
    const creditsDisplay = document.getElementById("credits-display");
    creditsDisplay.textContent = `${credits} crédits`;
}

//Unefois le DOM chargé, la fonction récupère l'username ()=>
    document.addEventListener("DOMContentLoaded", function(){
        const storedFirstname= localStorage.getItem("firstname")
        localStorage.setItem("credits", data.credits);
        const isAuthenticated= localStorage.getItem("isAuthenticated")

        if(storedFirstname && storedCredits && isAuthenticated === "true"){
            showFirstnameMenu(storedFirstname)
            showCredits(storedCredits);
        }else{
            window.location.href="login.html"
        }
    })

//  Déconnexion
document.getElementById("logout-btn").addEventListener("click", function(){
    localStorage.removeItem("firstname")
    localStorage.removeItem("credits");
    localStorage.removeItem("password")
    localStorage.setItem("isAuthenticated", false)
    window.location.href= "login.html"
})
