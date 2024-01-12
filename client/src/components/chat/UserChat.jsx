import { Stack } from "react-bootstrap";
import { useFtechRecipientUser } from "../../hooks/useFetchRecipient";
import avatarUser from "../../assets/avatarUser4.png"
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unReadNotification } from "../../utils/unReadNotification";
import { getRecipientId } from "../../utils/recipientId";
import { useFetchLastestMessage } from "../../hooks/useFetchLastestMessage";
import moment from "moment";

const UserChat = ({ chat, user }) => {

    const { recipientUser } = useFtechRecipientUser(chat, user)
    const { onlineUsers, messages, notification, currentChat } = useContext(ChatContext)
    const { lastestMessage } = useFetchLastestMessage(chat, user)

    const usersUnReadNotification = unReadNotification(notification)
    let thisUserUnReadNotification = usersUnReadNotification?.filter((n) => n.senderId == recipientUser?.id)

    const chatOpenRecipinetId = getRecipientId(user, currentChat)

    if (thisUserUnReadNotification.length > 0) {
        notification.forEach((notification) => {
            if (notification.senderId == chatOpenRecipinetId) {
                console.log("---------", notification)
                notification.read = true
            }

        })
        thisUserUnReadNotification = usersUnReadNotification?.filter((n) => n.senderId == recipientUser?.id)
    }

    console.log('----dagui',thisUserUnReadNotification)

    const dateActuelle = moment().format('MM/DD/YYYY HH:mm:ss');

    // Configurer le format personnalisé
    const formatPersonnalise = {
        sameDay: '[Aujourd\'hui à] HH:mm',
        lastDay: '[Hier à] HH:mm',
        lastWeek: 'DD/MM/YYYY [à] HH:mm',
        sameElse: 'DD/MM/YYYY [à] HH:mm',
    };

    const truncateText = (text)=>{
        let shortText = text.substring(0, 20);

        if(text.length>20){
            shortText = shortText + "..."
        }
        return shortText
    }

    return (
        <Stack
            direction="horizontal"
            gap={3}
            className="user-card align-items-center p-2 justify-content-between"
            role="button"
        >
            <div className="d-flex">
                <div className="me-2">
                    <img src={avatarUser} height="35px" />
                </div>
                <div className="text-content">
                    <div className="name">
                        {recipientUser?.username}
                    </div>
                    <div className="text">
                        {chat?.contenu}
                    </div>

                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">
                    {moment(chat?.date).calendar(dateActuelle, formatPersonnalise)}
                </div>
                <div className={thisUserUnReadNotification?.length > 0 ? "this-user-notifications" : ""}>{thisUserUnReadNotification?.length > 0 ? thisUserUnReadNotification?.length : ""}</div>
                <span className={onlineUsers?.some((user) => user?.userId == recipientUser?.id) ? "user-online" : "user-offline"}></span>
            </div>
        </Stack>
    )
}

export default UserChat;
