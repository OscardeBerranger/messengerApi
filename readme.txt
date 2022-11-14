


///  Afficher tous les messages

//methode GET

      'http://192.168.12.246:8000/messages/'


///créer un message au nom de cet utilisateur

methode POST

// '2' est le numero (id) de l'utilisateur
//donc l'utilisateur doit etre créé avant

 "http://192.168.12.246:8000/messages/2/new"


///créer un nouvel utilisateur

url 'http://192.168.12.246:8000/register'
methode : POST
corps de requete : (dans postman, body : raw et JSON )

{
    "username":"unNouveauUsername",
    "password":"minimum6caracteres"
}

si envoyé correctement, la réponse enverra un objet utilisateur contenant l'id utilisateur
en attendant, il existe un utilisateur "luc" avec l'id 2