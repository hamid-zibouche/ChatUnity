import { useContext, useEffect,useState } from "react"
import { ChatContext } from "../context/ChatContext"

import axios from "axios"

export const useFetchLastestMessage = (chat,user)=>{
    const{newMessage,notification,messages} =useContext(ChatContext)
    const[lastestMessage,setLastestMessage] = useState(null)
 
    const idUser1 = chat?.idUser1
    const idUser2 = chat?.idUser2
    let recipientId = null
   

    if(user?.id ==idUser1){
       recipientId = idUser2
    }else if(user?.id ==idUser2){
       recipientId = idUser1
    }

    useEffect(()=>{
        const getMessage = async ()=>{
            const response = await axios.get(`http://localhost:3000/chat/messagesPrv/${recipientId}`,
            {
                headers: {
                  Authorization: `Bearer ${user?.token}`, // Assurez-vous d'avoir le token de l'utilisateur ici
                },
              });

            if (response.error){
                return console.log("Error getting messages...",response.error)
            }

            
            const lastMessage = response?.data[response?.data.length-1];
            
            setLastestMessage(lastMessage)
        }

        getMessage()
    },[newMessage,notification,messages])
    return {lastestMessage}
}