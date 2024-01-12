import { Stack } from "react-bootstrap";
import { useFtechRecipientUser } from "../../hooks/useFetchRecipient";
import avatarUser from "../../assets/groups.png"
import { useContext } from "react";
import { ChatGrpContext } from "../../context/ChatGrpContext";
import { unReadNotification } from "../../utils/unReadNotification";
import { getRecipientId } from "../../utils/recipientId";
import { useFetchLastestMessage } from "../../hooks/useFetchLastestMessage";
import moment from "moment";

const UserChatGroupes = ({ chat, user }) => {

    const {messagesGrp,  currentChatGrp } = useContext(ChatGrpContext)

console.log("--chatttgrp",chat)
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
                        {chat?.nom}
                    </div>
                    <div className="text">
                        contenu
                    </div>

                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">
                    date DD/MM/AAAA
                </div>
                <div className="this-user-notifications"></div>
                <span className="user-online"></span>
            </div>
        </Stack>
    )
}

export default UserChatGroupes;

