const baseURL = "https://192.168.12.246:8000"


const mainContainer = document.querySelector("#main")
const messagesPageButton = document.querySelector("#messagesPage")
const autrechoseButton = document.querySelector("#autrechose")
const signInPageButton = document.querySelector('#signInPage')
let currentUserI = 39


messagesPageButton.addEventListener("click", displayMessagesPage)
autrechoseButton.addEventListener("click", displayRegisterPage)
signInPageButton.addEventListener('click', displaySignInPage)

function clearMainContainer(){
    mainContainer.innerHTML= ""
}

function display(content){
    //vider la div principale
    clearMainContainer()
    //et y ajouter le contenu qu'elle recoit

    mainContainer.innerHTML=content
}

function getMessageTemplate(message){

    let template = `
                            <div class="row border border-dark">
                                <p>Author : ${message.author.username}</p>
                                <p><strong>${message.content}</strong></p>
                            </div>
                        `

    return template

}

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

function getRegisterTemplate(){
    let template =`
                <div class="loginForm">
                <h1>Sign Up</h1>
                <label for="logUsername">Username</label>
                <input type="text" name="username" id="regUsername" placeholder="Enter your new username">
                <label for="logPassword">Password</label>
                <input type="password" name="password" id="regPassword" placeholder="Enter your new password">
                <button id="register">Sign up</button>
</div>
    `
    return template
}

async function getMessagesFromApi(){

    let url = `${baseURL}/api/messages/`

  return await fetch(url)
        .then(response=>response.json())
        .then(messages=>{

           return messages

        })
}

function displayMessagesPage(){

    getMessagesFromApi().then(messages=>{

        display(
            getMessagesTemplate(messages)
            )
        document.querySelector('.send').addEventListener('click', ()=>{
            sendMessage(document.querySelector('#userMessage').value)
        })
        document.querySelector('.refresh').addEventListener('click', ()=>{
            clearMainContainer()
            displayMessagesPage()
        })


    })

}

function fregister(username, password) {
    let url = `${baseURL}/register`
    let body = {
        username: username,
        password: password
    }
    let bodySerialise = JSON.stringify(body)

    let fetchParams = {
        method : "POST",
        body: bodySerialise

    }


    fetch(url, fetchParams)
        .then(response=>response.json())
        .then(data=>{
            console.log(data)
            currentUserI = data.id
        })
}

function loadForRegister(){
    let username = document.querySelector('#regUsername').value
    let password = document.querySelector('#regPassword').value
    console.log(username, password)
    fregister(username, password)
}

function displayRegisterPage(){
    let registerPage = getRegisterTemplate()
    display(registerPage)
    let bouton = document.querySelector('#register')
    bouton.addEventListener('click', ()=>{
        loadForRegister()
    })
}

function sendMessage(userMessage){

    let url = `${baseURL}messages/${currentUserI}/new`

    let body = {
        content : userMessage
    }
    let bodySerialise = JSON.stringify(body)
    let fetchParam = {
        method : "POST",
        body:bodySerialise
    }
    fetch(url, fetchParam)
        .then(response=>response.json())
        .then(data=>console.log(data))

    clearMainContainer()
    displayMessagesPage()
}

function getSignInTemplate(){
    let template = `
            <h2>Sign In</h2>
            <label for="signInUserName"></label>
            <input type="text" name="signInUserName" id="signInUserName" placeholder="Username">
            <label for="signInPassword"></label>
            <input type="password" name="signInPassword" id="signInPassword" placeholder="password">

    `
    return template
}

function displaySignInPage(){
    let signInPage = getSignInTemplate()
    display(signInPage)
}
