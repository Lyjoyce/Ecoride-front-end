//LOGIN expliquer la f, ses paramètres,types, ce qu'elle renvoie
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
        window.location.href="/frontend_ecoride/index.html"
    }else{
        alert("nom d'utilisateur ou mot de pass incorrect")
    }
}
function checkAuth(){
    const isAuthenticated =localStorage.getItem("isAuthenticated")
    if(isAuthenticated !== "true"){
        alert("Veuillez vous connecter") 
        window.location.href="/frontend_ecoride/login.html"
    }
}
function showFirstnameMenu(firstname){
    const firstnameDisplay= document.getElementById("firstname-display")
    firstnameDisplay.textContent= firstname
}

//Unefois le DOM chargé, la fonction récupère l'username ()=>
    document.addEventListener("DOMContentLoaded", function(){
        const storedFirstname= localStorage.getItem("firstname")
        const isAuthenticated= localStorage.getItem("isAuthenticated")

        if(storedFirstname && isAuthenticated === "true"){
            /*const firstnameDisplay= document.getElementById("firstname-display")
            firstnameDisplay.textContent= firstname */
            showFirstnameMenu(storedFirstname)

        }else{
            window.location.href="/frontend_ecoride/login.html"
        }
    })
// Gérer la déconnexion

document.getElementById("logout-btn").addEventListener("click", function(){
    localStorage.removeItem("firstname")
    localStorage.removeItem("password")
    localStorage.setItem("isAuthenticated", false)
    window.location.href= "login.html"
})
