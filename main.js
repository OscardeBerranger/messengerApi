const baseURL = "https://139.162.156.85:8000/"


const mainContainer = document.querySelector("#main")
const messagesPageButton = document.querySelector("#messagesPage")
const autrechoseButton = document.querySelector("#autrechose")


messagesPageButton.addEventListener("click", displayMessagesPage)
autrechoseButton.addEventListener("click", displayAutreChose)


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

    messages.forEach(message=>{

      messagesTemplate+=  getMessageTemplate(message)
    })

    return messagesTemplate

}

function getRegisterTemplate(){
    let template = ``
    return template
}

async function getMessagesFromApi(){

    let url = `${baseURL}messages/`

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


    })

}

function displayAutreChose(){
    display("voila autrechose")
}

function displayRegisterPage(){
    display(getRegisterTemplate)
}