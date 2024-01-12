import { useContext, useEffect,useState } from "react";
import axios from "axios"



export const useFtechRecipientUser = (chat,user)=>{
    const [recipientUser,setRecipientUser] = useState(null)
    const [error, setError] = useState(null);


    const idUser1 = chat?.idUser1
    const idUser2 = chat?.idUser2
    // console.log("user1",idUser1)
    // console.log("user2",idUser2)
    // console.log('user?.id',user?.id)
    let recipientId = null
   

    if(user?.id ==idUser1){
       recipientId = idUser2
    }else if(user?.id ==idUser2){
       recipientId = idUser1
    }
    
    useEffect(()=>{
        const getUser = async ()=>{
            if (!recipientId) return null;

            const response = await axios.get(`http://localhost:3000/Users/find/${recipientId}`,
            {
                headers: {
                  Authorization: `Bearer ${user?.token}`, // Assurez-vous d'avoir le token de l'utilisateur ici
                },
              });
            //   console.log(response.data)

            if(response.error){
                return setError(response.error)
            }
            setRecipientUser(response.data)
        };

        getUser();
    },[recipientId])

    return{recipientUser}
}