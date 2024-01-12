import { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";

import { io } from "socket.io-client"
import { unReadNotification } from "../utils/unReadNotification";

export const ChatGrpContext = createContext();

export const ChatGrpContextProvider = ({ children, user }) => {

    const [grpChats, setGrpChats] = useState(null)
    const [isGrpChatsLoading, setIsGrpChatsLoading] = useState(false);
    const [grpChatsError, setGrpChatsError] = useState(null);
    const [currentChatGrp, setCurrentChatGrp] = useState(null);

    const [messagesGrp, setMessagesGrp] = useState([])
    const [isMessagesGrpLoading, setMessagesGrpLoading] = useState(false)
    const [messagesGrpError, setMessagesGrpError] = useState(null)

    const [sendTextMessageGrpError, setSendTextMessageGrpError] = useState(null)
    const [newMessageGrp, setNewMessageGrp] = useState(null)

    const [usersRecherche, setUsersRecherche] = useState([])

    const [isAdminCurrentGrp, setIsAdminCurrentGrp] = useState(false)

    const [addNewMember,setAddNewMember] = useState(null)
    const [addNewMemberError,setAddNewMemberError] = useState(false)
    const [addNewMemberLoading,setAddNewMemberLoading] = useState(false)

    useEffect(() => {
        const getGrpChats = async () => {
            try {
                setIsGrpChatsLoading(true);

                const response = await axios.get("http://localhost:3000/Groupe/mesGroupes", {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                });

                setGrpChats(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {

                    console.log('vous étes pas autorisé')

                } else {
                    setGrpChatsError(error.message || "Une erreur s'est produite lors de la récupération des chats.");
                }
            } finally {
                setIsGrpChatsLoading(false);
            }
        };

        getGrpChats();
    }, [user]);

    const updateCurrentChatGrp = useCallback((chat) => {
        console.log('111---->', chat)
        setCurrentChatGrp(chat)
    }, [])

    // avoir tout les message du groupes
    useEffect(() => {
        const getMessages = async () => {
            setMessagesGrpLoading(true)
            setMessagesGrpError(null)
            console.log('22222------>', currentChatGrp?.id)
            const idGroup = currentChatGrp?.id

            const response = await axios.get(`http://localhost:3000/messagesGrp/${idGroup}`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            setMessagesGrpLoading(false)
            if (response.error) {
                return setMessagesGrpError(response.data)
            }
            console.log('-_-_-_-_', response.data)

            if (currentChatGrp?.idAdmin == user?.id)
                setIsAdminCurrentGrp(true)
            else {
                setIsAdminCurrentGrp(false)
            }
            console.log(currentChatGrp?.idAdmin, ' vs ', user?.id)

            setMessagesGrp(response.data)
        };
        getMessages();
    }, [currentChatGrp])


    //envoyer un message dans un groupe
    const sendTextMessageGrp = useCallback((textMessage, cnt, user, setTextMessage) => {
        if (!textMessage) return console.log("A toi de saisir");

        const contenu = { contenu: textMessage };

        const sendMessage = async () => {
            const response = await axios.post(`http://localhost:3000/send/messagesGrp/${cnt?.id}`, contenu, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });

            if (response.error) {
                return setSendTextMessageGrpError(response.data);
            }
            setNewMessageGrp(response);
            setMessagesGrp((prevMessages) => [...prevMessages, response.data]);
            setTextMessage("");
        };

        sendMessage();
    }, []);

    //ajouter un membre au groupe

    const ajoutMembre = useCallback((setTextSearch,id, current, user) => {
        if (!id) return console.log("ya pas d'id d'utilisateur");


        const ajout = async () => {
            setAddNewMemberLoading(true)
            const idUser = { idUser: id }
            console.log("___________oui", current)
            const response = await axios.post(`http://localhost:3000/Group/${current?.id}/addMember`, idUser, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            setAddNewMemberLoading(false)

            if (response.error) {
                return setAddNewMemberError(true);
            }
            setAddNewMember(response.data);
        };

        ajout();
    }, []);

    //Search Users
    const searchUsers = useCallback((textSearch, user, cnt,isAdmin, setTextSearch) => {
        if (!textSearch) return console.log("A toi de saisir", setTextSearch(""));

        if(!isAdmin) return setUsersRecherche([{id:-1,pseudo:"Vous N'ete pas L'administarateur"}])

        const pseudo = textSearch

        const search = async () => {
            try {

                const response = await axios.get(`http://localhost:3000/groupe/${cnt?.id}/users/findByPseudo/${pseudo}`, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                });

                if (response.data.error) {
                    return console.log('error');
                }
                setUsersRecherche(response?.data);

            }
            catch (error) {
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

    return (
        <ChatGrpContext.Provider
            value={{
                grpChats,
                isGrpChatsLoading,
                grpChatsError,
                updateCurrentChatGrp,
                currentChatGrp,
                messagesGrp,
                messagesGrpError,
                isMessagesGrpLoading,
                sendTextMessageGrp,
                ajoutMembre,
                searchUsers,
                setUsersRecherche,
                usersRecherche,
                isAdminCurrentGrp,
                addNewMember,
                addNewMemberError,
                addNewMemberLoading,
            }}
        >
            {children}
        </ChatGrpContext.Provider>
    );
};
