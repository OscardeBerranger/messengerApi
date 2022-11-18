const baseURL = "https://139.162.156.85:8000"
let token ;

const mainContainer = document.querySelector("#main")
const messagesPageButton = document.querySelector("#messagesPage")
const autrechoseButton = document.querySelector("#autrechose")
const signInPageButton = document.querySelector('#signInPage')

messagesPageButton.addEventListener("click", ()=>{
    displayMessagesPage()
    document.querySelector('.containerMainTitle').style.opacity = 0
})

autrechoseButton.addEventListener("click", ()=>{
    displayRegisterPage()
    document.querySelector('.containerMainTitle').style.opacity = 0
})

signInPageButton.addEventListener('click', ()=>{
    displaySignInPage()
    document.querySelector('.containerMainTitle').style.opacity = 0
})


//Chargement des messages
async function getMessagesFromApi(){

    let url = `${baseURL}/api/messages`
    let fetchParam = {
        headers : {'Authorization':`Bearer ${token}`, 'Content-Type':'application/json'},
        method : "GET"
    }

    return await fetch(url, fetchParam)
        .then(response=>response.json())
        .then(messages=>{

            return messages

        })
}

//Creation de la template Pour Sign In
function getSignInTemplate(){
    let template = `
            <h2>Sign In</h2>
            <label for="signInUserName"></label>
            <input type="text" name="signInUserName" id="signInUserName" placeholder="Username">
            <label for="signInPassword"></label>
            <input type="password" name="signInPassword" id="signInPassword" placeholder="password">
            <button class="submitSignIn">Sign in</button>

    `
    return template
}

//Creation de la template d'un message
function getMessageTemplate(message){
    let currentDate = new Date()
    let messageDate = new Date(message.createdAt)
    let diffTime = Math.abs(currentDate - messageDate)
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let diffHours = Math.ceil(diffTime/(1000*60*60))
    let diffMin = Math.ceil(diffTime/(1000*60))
    let diffSec = Math.ceil(diffTime/1000)
    let time;

    if (diffDays > 1){
        time = diffDays + " days"
    }else if (diffHours > 1){
        time = diffHours + " hours"
    }else if (diffMin > 1){
        time = diffMin + " minutes"
    }else time = diffSec + " seconds"


    let template = `
                            <div class="row border border-dark">
                                <p>Author : ${message.author.username}</p>
                                <p> Sent  ${time} ago.</p>
                                <p><strong>${message.content}</strong></p>
                            </div>
                        `


    return template

}

//Assemblage des messages, retourne une template
function getMessagesTemplate(messages){

    let messagesTemplate = ""
    let template = `
        <label for="userMessage"></label>
        <input type="text" name="" id="userMessage" placeholder="your message">
        <button class="send">Send</button>
        <button class="refresh">refresh</button>
        `
    messagesTemplate+= template

    messages.forEach(message=>{



        messagesTemplate+=  getMessageTemplate(message)
    })

    return messagesTemplate

}

//Creation de la template register (Sign up)
function getRegisterTemplate(){
    let template =`
               
                <h1>Sign Up</h1>
                <input type="text" name="username" id="regUsername" placeholder="Enter your new username">
                <input type="password" name="password" id="regPassword" placeholder="Enter your new password">
                <button id="register">Sign up</button>

    `
    return template
}

//Supprime tout les messages de la page
function clearMainContainer(){
    mainContainer.innerHTML= ""
}

//Charge la page des messages
function loadForRegister(){
    let username = document.querySelector('#regUsername').value
    let password = document.querySelector('#regPassword').value
    fregister(username, password)
}

//Affiche sur la page une template donnée
function display(content){
    //vider la div principale
    clearMainContainer()
    //et y ajouter le contenu qu'elle recoit

    mainContainer.innerHTML=content
}

//Affiche la page des messages
function displayMessagesPage(){

    getMessagesFromApi().then(messages=>{

        display(
            getMessagesTemplate(messages)
            )
        document.querySelector('.send').addEventListener('click', ()=>{
            sendMessage(document.querySelector('#userMessage'))
        })
        document.querySelector('.refresh').addEventListener('click', ()=>{
            clearMainContainer()
            displayMessagesPage()
        })


    })

}

//Affiche la page pour se register(sign up), s'inscrire
function displayRegisterPage(){
    let registerPage = getRegisterTemplate()
    display(registerPage)
    let bouton = document.querySelector('#register')
    bouton.addEventListener('click', ()=>{
        loadForRegister()
    })
    if (!mainContainer.classList.contains("active")){
        mainContainer.classList.toggle('active')
    }}

//Affiche la page pour se connecter
function displaySignInPage(){
    let signInPage = getSignInTemplate()
    display(signInPage)
    const username = document.querySelector('#signInUserName')
    const password = document.querySelector('#signInPassword')
    const bouton = document.querySelector('.submitSignIn')
    bouton.addEventListener('click', ()=>{
        signIn(username.value, password.value)
    })
    if (!mainContainer.classList.contains("active")){
        mainContainer.classList.toggle('active')
    }
}

//Permet d'envoyer un message
function sendMessage(userMessage){

    let url = `${baseURL}/api/messages/new`
    let body = {
        content : userMessage.value
    }


    let bodySerialise = JSON.stringify(body)

    let fetchParams = {
        method : "POST",
        headers:{"Content-Type":"application/json",
            "Authorization": `Bearer ${token}`
        },
        body: bodySerialise

    }


    fetch(url, fetchParams)

    clearMainContainer()
    displayMessagesPage()
}

//Permet de se connecter
function signIn(username, password){
    let url = `${baseURL}/login`
    let body = {
        username: username,
        password: password
    }
    let bodySerialise = JSON.stringify(body)

    let fetchParams = {
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        method : "POST",
        body: bodySerialise

    }


    fetch(url, fetchParams)
        .then(response=>response.json())
        .then(data=>{
            token = data.token
            document.querySelector('.btnRegisterSignUp').innerHTML = `
            <p>${username}</p>
            <button class="button" id="logOut">Log Out <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg></button>
            `
            displayMessagesPage()
        })
        .then(()=>{
            document.querySelector('#logOut').addEventListener('click', ()=>{
                token = null
                window.location.reload()
            })
        })
}

//Permet de se register(sign up), s'inscrire
function fregister(username, password){
    let url = `${baseURL}/register`
    let body = {
        username : username,
        password : password
    }


    let bodySerialise = JSON.stringify(body)

    let fetchParams = {
        method : "POST",
        body: bodySerialise

    }


    fetch(url, fetchParams)
        .then(response=>response.json())
        .then(data=> {
            console.log(data)
        })
}
