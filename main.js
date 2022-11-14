const messagesContainer = document.querySelector(".messages")
const fetchMessagesButton = document.querySelector("#fetchMessages")
const messageField = document.querySelector("#messageField")
const sendButton = document.querySelector("#sendMessage")
const regUsername = document.querySelector("#regUsername")
const regPassword = document.querySelector("#regPassword")
const regButton = document.querySelector("#register")

sendButton.addEventListener("click", ()=>{
    sendMessage(messageField.value)
    fetchAllMessages()
    messageField.value = ""
})

regButton.addEventListener("click", ()=>{
    register(regUsername.value, regPassword.value)
})


let userId = 2

fetchMessagesButton.addEventListener("click", fetchAllMessages)

function fetchAllMessages(){
    let url = "https://localhost:8000/messages"

    fetch(url)
        .then(response=>response.json())
        .then(messages=>{
            clearMessages()
            messages.forEach(message=>{
                displayMessageTemplate(message)
            })

        })
}

function displayMessageTemplate(message){

        let template = `
                            <div class="row border border-dark">
                                <p>Author : ${message.author.username}</p>
                                <p><strong>${message.content}</strong></p>
                            </div>
                        `
    messagesContainer.innerHTML += template
}

function clearMessages(){
    messagesContainer.innerHTML = ""
}

function sendMessage(messageText){
    let url = `https://localhost:8000/messages/${userId}/new`
    let body = {
        content : messageText
    }


    let bodySerialise = JSON.stringify(body)

    let fetchParams = {
        method : "POST",
        body: bodySerialise

    }


    fetch(url, fetchParams)

}

function register(username, password){
    let url = `https://localhost:8000/register`
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
        .then(data=>console.log(data))
}

