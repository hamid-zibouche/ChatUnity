import { useContext } from "react";
import { ChatGrpContext } from "../context/ChatGrpContext";
import { Container, InputGroup, FormControl } from "react-bootstrap";
import Stack from 'react-bootstrap/Stack';
import { AuthContext } from "../context/AuthContext";
import UserChatGroupes from "../components/chatGroupes/UserChatGroupes";

import ChatGrpBox from "../components/chatGroupes/ChatGrpBox";

import SearchUsers from "../components/chatGroupes/SearchUsers"

const ChatGroupes = () => {
    const { grpChats, isGrpChatsLoading, grpChatsError,updateCurrentChatGrp, messages} = useContext(ChatGrpContext)
    // , updateCurrentChat, messages 
    const { user } = useContext(AuthContext)

    return (
        <Container>
            <SearchUsers />
            {grpChats?.length < 1 ? null : (
                <Stack direction="horizontal" gap={4} className="align-items-start">
                    <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                        {grpChats?.map((chat, index) => {
                            return (
                                <div
                                    key={index}
                                    onClick={() => updateCurrentChatGrp(chat)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            updateCurrentChatGrp(chat);
                                        }
                                    }}
                                    role="button"
                                    tabIndex="0"
                                >
                                    {console.log('--__--', chat)}
                                    <UserChatGroupes chat={chat} user={user} />
                                </div>
                            )
                        })}
                    </Stack>
                    <ChatGrpBox />
                </Stack>
            )}

        </Container>
    )
};

export default ChatGroupes;