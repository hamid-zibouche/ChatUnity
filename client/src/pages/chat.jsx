import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, InputGroup, FormControl } from "react-bootstrap";
import Stack from 'react-bootstrap/Stack';
import { AuthContext } from "../context/AuthContext";
import UserChat from "../components/chat/UserChat";

import ChatBox from "../components/chat/ChatBox";
import SearchUsers from "../components/chat/SearchUsers"

const Chat = () => {
    const { userChats, isUserChatsLoading, userChatsError, updateCurrentChat, messages } = useContext(ChatContext)
    const { user } = useContext(AuthContext)
    // console.log(userChats)

    return (
        <Container>
            <SearchUsers />
            {userChats?.length < 1 ? null : (
                <Stack direction="horizontal" gap={4} className="align-items-start">
                    <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                        {userChats?.map((chat, index) => {
                            return (
                                <div
                                    key={index}
                                    onClick={() => updateCurrentChat(chat)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            updateCurrentChat(chat);
                                        }
                                    }}
                                    role="button"
                                    tabIndex="0"
                                >
                                    {console.log('--__--', chat)}
                                    <UserChat chat={chat} user={user} />
                                </div>
                            )
                        })}
                    </Stack>
                    <ChatBox />
                </Stack>
            )}

        </Container>
    )
};

export default Chat;