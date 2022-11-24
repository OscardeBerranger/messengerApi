const baseURL = "https://b1messenger.tk"
let token;
let currenUserId;

const mainContainer = document.querySelector("#main");
const messagesPageButton = document.querySelector("#messagesPage");
const autrechoseButton = document.querySelector("#autrechose");
const signInPageButton = document.querySelector('#signInPage');
const myModal = document.querySelector('#myModal');
const closeModal = document.querySelector(".closeModal");
const toTheTop = document.querySelector('.toTheTop');
const editMe = document.querySelector('.edit')


messagesPageButton.addEventListener("click", ()=>{
    displayMessagesPage()
    document.querySelector('.containerMainTitle').style.opacity = 0
});
autrechoseButton.addEventListener("click", ()=>{
    displayRegisterPage()
    document.querySelector('.containerMainTitle').style.opacity = 0
});
signInPageButton.addEventListener('click', ()=>{
    displaySignInPage()
    document.querySelector('.containerMainTitle').style.opacity = 0
});
closeModal.addEventListener('click', ()=>{
    myModal.style.display = "none"
});
toTheTop.addEventListener('click', ()=>{
    window.scrollTo(0, 0)
});

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

    let template

    if (message.author.username == currenUserId){
        template =  `
                            <div class="row border border-dark">
                                <p>Author : ${message.author.username}</p>
                                <p> Sent  ${time} ago.</p>
                                <p>${message.content}<button class="btnMsg deleteMsg" id="${message.id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> </svg></button> <button class="btnMsg editMsg" id="${message.id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"> <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/> </svg></button></p>
                            </div>
                        `
    }else {template =  `
                            <div class="row border border-dark">
                                <p>Author : ${message.author.username}</p>
                                <p> Sent  ${time} ago.</p>
                                <button class="btnReply" id="${message.id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-reply-all" viewBox="0 0 16 16"> <path d="M8.098 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822.984.624 1.99 1.76 2.595 3.876-1.02-.983-2.185-1.516-3.205-1.799a8.74 8.74 0 0 0-1.921-.306 7.404 7.404 0 0 0-.798.008h-.013l-.005.001h-.001L8.8 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L4.114 8.254a.502.502 0 0 0-.042-.028.147.147 0 0 1 0-.252.497.497 0 0 0 .042-.028l3.984-2.933zM9.3 10.386c.068 0 .143.003.223.006.434.02 1.034.086 1.7.271 1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96v-.667z"/> <path d="M5.232 4.293a.5.5 0 0 0-.7-.106L.54 7.127a1.147 1.147 0 0 0 0 1.946l3.994 2.94a.5.5 0 1 0 .593-.805L1.114 8.254a.503.503 0 0 0-.042-.028.147.147 0 0 1 0-.252.5.5 0 0 0 .042-.028l4.012-2.954a.5.5 0 0 0 .106-.699z"/> </svg></button>
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
    let templateEdit = `
    
    `
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

//Creation de la template du formulaire edit/reply
function getEditorTemplate(type){
    let template
    if (type === "edit") {
        template =`
            <div class="editor">
                <input type="text" name="textEdit" id="textEdit" placeholder="edit">
                <button id="editMsgButton">Send</button>
            </div>
        `
    }else if (type === "reply"){
        template =`
            <div class="editor">
                <input type="text" name="textReply" id="textReply" placeholder="reply">
                <button id="replyMsgButton">Send</button>
            </div>
        `
    }
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

        const editBtns = document.querySelectorAll('.editMsg')
        editBtns.forEach(btn=>{
            btn.addEventListener('click',()=>{
                displayEditOrReplyArea("edit")
                let currentMsg = btn.id
                editMsg(currentMsg)
            })
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
                    displayMessagesPage()
            })
        })

        const replyBtn = document.querySelectorAll('.btnReply')
        replyBtn.forEach(btn=>{
            btn.addEventListener('click', ()=>{
                displayEditOrReplyArea("reply")
                let currentMsg = btn.id
                replyMsg(currentMsg)
            })
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

//Affiche le text area permettant d'éditer/reply à un message
function displayEditOrReplyArea(type){
    editMe.innerHTML = ""
    let template = getEditorTemplate(type)
    editMe.innerHTML = template
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
                if (typeof data == "string"){
                    myModal.style.display = "block";
                }
            })

}

//Permet d'éditer un message
function editMsg(message){
    let currentEditBtn = document.querySelector('#editMsgButton')
    currentEditBtn.addEventListener('click', ()=>{
        let url = `${baseURL}/api/messages/${message}/edit`
        let body = {
            content:document.querySelector('#textEdit').value
        }
        let bodySerialise = JSON.stringify(body)
        let fetchParams = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`

            },
            body: bodySerialise
        }
        fetch(url, fetchParams)
        displayMessagesPage()
        editMe.innerHTML = ""
    })
}

//Permet de répondre à un message
function replyMsg(message){
    let currentReplyBtn= document.querySelector('#replyMsgButton')
    currentReplyBtn.addEventListener('click', ()=>{
        let url = `${baseURL}/api/responses/${message}/new`
        let body = {
            content:document.querySelector('#textReply').value
        }
        let bodySerialise = JSON.stringify(body);
        let fetchParams = {
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body:bodySerialise
        }
        fetch(url, fetchParams)
        displayMessagesPage()
        editMe.innerHTML = ""
    })
}
