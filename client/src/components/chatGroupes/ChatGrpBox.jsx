import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";

import { ChatGrpContext } from "../../context/ChatGrpContext";
import { Stack } from "react-bootstrap";

import moment from "moment"
import InputEmoji from "react-input-emoji"
import { useState } from "react";

const ChatGrpBox = () => {
    console.log("__________")
    const { user } = useContext(AuthContext)
    const { currentChatGrp, messagesGrp, isMessagesGrpLoading, sendTextMessageGrp } = useContext(ChatGrpContext)

    console.log('--------------------------------------------',currentChatGrp)

    const [textMessage, setTextMessage] = useState("")
    const scroll = useRef();

    let dateActuelle = moment().format('MM/DD/YYYY HH:mm:ss')

    // Configurer le format personnalisé
    const formatPersonnalise = {
        sameDay: '[Aujourd\'hui à] HH:mm',
        lastDay: '[Hier à] HH:mm',
        lastWeek: 'DD/MM/YYYY [à] HH:mm',
        sameElse: 'DD/MM/YYYY [à] HH:mm',
    };

    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior:"smooth"})
    },[messagesGrp])

    if (!user) {
        return <p style={{ textAlign: "center", width: "100%" }}>
                    Loading user
                </p>
    }
    if (!currentChatGrp?.id) {
        return (
            <p style={{ textAlign: "center", width: "100%" }}>
                No Conversation selcted yet ...
            </p>
        )
    }
    if (isMessagesGrpLoading) {
        return (
            <p style={{ textAlign: "center", width: "100%" }}>
                Loanding Messages ...
            </p>
        )
    }
    console.log('------0000--',messagesGrp)
    return (
        <Stack gap={4} className="chat-box">
            <div className="chat-header">
                <strong>{currentChatGrp?.nom}</strong>
            </div>
            <Stack className="messages" gap={3} >
                {messagesGrp.map((message, index) => (
                  
                    <Stack
                        key={index}
                        className={`${message?.idUser == user?.id
                            ? "message self align-self-end flex-grow-0"
                            : "message align-self-start flex-grow-0"
                            }`}
                        ref={scroll}
                    >
                        <span>{message.contenu}</span>
                        <span className="message-footer">
                            {moment(message?.date).calendar(dateActuelle, formatPersonnalise)}
                        </span>
                    </Stack>
                ))}

            </Stack>
            <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
                <InputEmoji
                    value={textMessage}
                    onChange={setTextMessage}
                    fontFamily="nunito"
                    borderColor="rgba(72,112,223,0.2)"
                />
                <button className="send-btn" onClick={() => sendTextMessageGrp(textMessage, currentChatGrp, user, setTextMessage)} style={{ flexShrink: 0 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                    </svg>
                </button>
            </Stack>

        </Stack>
    )
}

export default ChatGrpBox;