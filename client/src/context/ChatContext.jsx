import { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";

import { io } from "socket.io-client"
import { unReadNotification } from "../utils/unReadNotification";
import { getRecipientId } from "../utils/recipientId";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoanding] = useState(false);
  const [userChatError, setUserChatsError] = useState(null);
  const [currentChat, setCurrentChat] = useState(null)

  const [messages, setMessages] = useState([])
  const [isMessagesLoading, setMessagesLoading] = useState(false)
  const [messagesError, setMessagesError] = useState(null)
  const [sendTextMessageError, setSendTextMessageError] = useState(null)
  const [newMessage, setNewMessage] = useState(null)

  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])

  const [notification, setNotification] = useState([])

  const [usersRecherche,setUsersRecherche] = useState([])

  const [coucou, setCoucou] = useState("")
  const [userCoucou, setUserCoucou] = useState("")

  const usersUnReadNotification = unReadNotification(notification)

  console.log('notification unRead', usersUnReadNotification)
  console.log('notification', notification)
  console.log('onlineUsers', onlineUsers)

  // init socket
  useEffect(() => {
    const newSocket = io("http://localhost:4000")
    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [user])

  // add online users
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?.id)
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res)
    });

    return () => {
      socket.off("getOnlineUsers")
    }
  }, [socket])

  // sendMessage
  useEffect(() => {
    if (socket === null) return;
    const recipientId = getRecipientId(user,currentChat)

    socket.emit("sendMessage", { ...newMessage, recipientId })

  }, [newMessage])

    // sendCoucou
    useEffect(() => {
      if (socket === null) return;
      const recipientId = userCoucou;
  
      socket.emit("sendMessage", { ...newMessage, recipientId })
  
    }, [coucou])


  //receiveMessage and notification
  useEffect(() => {
    if (socket === null) return;
    const idUser1 = currentChat?.idUser1
    const idUser2 = currentChat?.idUser2
    let recipientId = null

    if (user?.id == idUser1) {
      recipientId = idUser2
    } else if (user?.id == idUser2) {
      recipientId = idUser1
    }

    socket.on("getMessage", (res) => {

      if (((currentChat?.idUser1 == res?.data.idUser1) && (currentChat?.idUser2 == res?.data.idUser2))
        || ((currentChat?.idUser2 == res?.data.idUser1) && (currentChat?.idUser1 == res?.data.idUser2)))
        setMessages((prev) => [...prev, res?.data])
      else return;

    });

    socket.on("getNotification", (res) => {
      console.log(res?.senderId ,'&&',recipientId)
      const isOpenChat = res?.senderId == recipientId

        if (isOpenChat){
          setNotification((prev) => [{...res,read:true}, ...prev])
        }
      else {
        setNotification((prev) => [{...res,read:false}, ...prev])
      };

    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket,currentChat])


  // avoir tout les chatsPrv
  useEffect(() => {
    const getUserChats = async () => {
      try {
        setIsUserChatsLoanding(true);

        const response = await axios.get("http://localhost:3000/chats", {
          headers: {
            Authorization: `Bearer ${user?.token}`, // Assurez-vous d'avoir le token de l'utilisateur ici
          },
        });

        setUserChats(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Si non autorisé, redirigez vers la page de connexion
          console.log('vous étes pas autorisé')

        } else {
          setUserChatsError(error.message || "Une erreur s'est produite lors de la récupération des chats.");
        }
      } finally {
        setIsUserChatsLoanding(false);
      }
    };

    getUserChats();
  }, [user,newMessage,notification]);

  // avoir tout les messages entre l'utilisateur courant et un autres utilisateur 
  useEffect(() => {
    const getMessages = async () => {
      setMessagesLoading(true)
      setMessagesError(null)

      const idUser1 = currentChat?.idUser1
      const idUser2 = currentChat?.idUser2
      let recipientId = null

      if (user?.id == idUser1) {
        recipientId = idUser2
      } else if (user?.id == idUser2) {
        recipientId = idUser1
      }

      const response = await axios.get(`http://localhost:3000/chat/messagesprv/${recipientId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setMessagesLoading(false)
      if (response.error) {
        return setMessagesError(response.data)
      }
      console.log('-_-_-_-_',response.data)

      setMessages(response.data)
    };
    getMessages();
  }, [currentChat])

// envoyer un message a un utilisateur
  const sendTextMessage = useCallback((textMessage, recipientUser, user, setTextMessage) => {
    if (!textMessage) return console.log("A toi de saisir");

    const contenu = { contenu: textMessage };

    const sendMessage = async () => {
      const response = await axios.post(`http://localhost:3000/send/messagesprv/${recipientUser?.id}`, contenu, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.error) {
        return setSendTextMessageError(response.data);
      }
      setNewMessage(response);
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setTextMessage("");
    };

    sendMessage();
  }, []);


  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat)
  }, [])


  //Search Users
  const searchUsers = useCallback((textSearch, user, setTextSearch) => {
    if (!textSearch) return console.log("A toi de saisir",setTextSearch(""));

    const pseudo = textSearch

    const search = async () => {
      try{
        console.log("--------",user?.token)
      const response = await axios.get(`http://localhost:3000/users/findByPseudo/${pseudo}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.data.error) {
        return console.log('error');
      }
       setUsersRecherche(response?.data);
      // setMessages((prevMessages) => [...prevMessages, response.data]);
      // setTextMessage("");
      console.log('-------->',response?.data)
    }
    catch(error){
      if (error.response) {
        // La requête a été faite, mais le serveur a répondu avec un code de statut différent de 2xx
        console.error('Réponse du serveur avec erreur:', error.response.data);

      } else if (error.request) {
        // La requête a été faite, mais aucune réponse n'a été reçue
        console.error('Aucune réponse reçue du serveur:', error.request);

      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error('Erreur lors de la configuration de la requête:', error.message);

      }
    }
  };

    search();
  }, []);


  //faire un coucou a un utilisateur a l'aide de la barre de recheche d'utilisateur
  const sendCoucou = useCallback((id,user) => {
    if (!id) return console.log("ya pas d'id d'utilisateur");

   
    const sendMessage = async () => {
      const contenu = {contenu :"👋"}
      console.log("___________oui",user.id)
      const response = await axios.post(`http://localhost:3000/send/messagesprv/${id}`, contenu, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.error) {
        return setSendTextMessageError(response.data);
      }
      setNewMessage(response);
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setUserCoucou(id)
      setCoucou(response)

    };

    sendMessage();
  }, []);



  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatError,
        updateCurrentChat,
        currentChat,
        messages,
        isMessagesLoading,
        sendTextMessage,
        onlineUsers,
        notification,
        searchUsers,
        usersRecherche,
        setUsersRecherche,
        sendCoucou,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
