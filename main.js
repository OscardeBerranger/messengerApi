const baseURL = "https://172.104.149.64"
let token ;
let currenUserId;

const mainContainer = document.querySelector("#main")
const messagesPageButton = document.querySelector("#messagesPage")
const autrechoseButton = document.querySelector("#autrechose")
const signInPageButton = document.querySelector('#signInPage')
const myModal = document.querySelector('#myModal')
const closeModal = document.querySelector(".closeModal");
const toTheTop = document.querySelector('.toTheTop')


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
closeModal.addEventListener('click', ()=>{
    myModal.style.display = "none"
})
toTheTop.addEventListener('click', ()=>{
    window.scrollTo(0, 0)
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
            <span id="error">    </span>

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

    console.log(message)
    let template

    if (message.author.username == currenUserId){
        template =  `
                            <div class="row border border-dark">
                                <p>Author : ${message.author.username}</p>
                                <p> Sent  ${time} ago.</p>
                                <p>${message.content}<button class="deleteMsg" id="${message.id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> </svg></button></p>
                            </div>
                        `
    }else {template =  `
                            <div class="row border border-dark">
                                <p>Author : ${message.author.username}</p>
                                <p> Sent  ${time} ago.</p>
                            </div>
                        `}
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
        messagesTemplate+=getMessageTemplate(message)
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
                <span id="errorRegister" style="color: #8f0404"></span>

    `
    return template
}

//Supprime tout les messages de la page
function clearMainContainer(){
    mainContainer.innerHTML= ""
}

//Charge la page des messages
function loadForRegister(){
    const username = document.querySelector('#regUsername')
    const password = document.querySelector('#regPassword')
    console.log(password)
    if (password.value !== ""){
        fregister(username.value, password.value)
    }else {
        document.querySelector('#errorRegister').innerHTML = ""
        document.querySelector('#errorRegister').innerHTML += "Le mot de passe doit etre renseigné"
    }

    // fregister(username, password)
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

        const delBtns = document.querySelectorAll('.deleteMsg')
        delBtns.forEach(btn=>{
            btn.addEventListener('click',()=>{
                    let currentMsg = btn.id
                    let url = `${baseURL}/api/messages/delete/${currentMsg}`
                    let fetchParams = {
                        method : "DELETE",
                        headers : {'Authorization':`Bearer ${token}`,
                            'Content-Type':'application/json'},
                    }
                    fetch(url, fetchParams)
                        .then((response)=>response.json())
                        .then(response=>{
                            displayMessagesPage()
                        })
            } )
        })

        window.scrollTo(0, document.body.scrollHeight);
        toTheTop.style.display = "block"
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
function signIn(username, password) {
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
            if (data.token){
                token = data.token
                document.querySelector('.btnRegisterSignUp').innerHTML = `
            <p>${username}</p>
            <button class="button" id="logOut">Log Out <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg></button>
            `
                displayMessagesPage()
            }else document.querySelector('#error').innerHTML = "Password or username don't match"
            currenUserId = username

        })
        .then(()=>{
            document.querySelector('#logOut').addEventListener('click', ()=>{
                token = null
                displaySignInPage()
                document.querySelector('.btnRegisterSignUp').innerHTML = `
                        <button class="button" id="autrechose">Register</button>
                        <button class="button" id="signInPage">Sign In <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-log-in"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg></button></div>
                `
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
                if (typeof data == "string"){
                    myModal.style.display = "block";
                }
            })

}
