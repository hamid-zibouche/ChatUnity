import { Container, InputGroup, FormControl } from "react-bootstrap";
import Stack from 'react-bootstrap/Stack';
import search from "../../assets/search1.svg"
import add from "../../assets/add.svg"
import { useState, useContext, useEffect } from "react";
import { ChatGrpContext } from "../../context/ChatGrpContext";
import { AuthContext } from "../../context/AuthContext";



const SearchUsers = () => {
    const [textSearch, setTextSearch] = useState("")

    const { ajoutMembre, currentChatGrp, searchUsers, usersRecherche, setUsersRecherche, isAdminCurrentGrp,addNewMember } = useContext(ChatGrpContext)
    const { user } = useContext(AuthContext)

    const handleInputChange = (e) => {
        if (currentChatGrp)
            setTextSearch(e.target.value);
    };

    useEffect(() => {
        if (textSearch.trim()) {
            searchUsers(textSearch, user, currentChatGrp, isAdminCurrentGrp, setTextSearch)
        } else {
            setTextSearch("")
            setUsersRecherche("")
        }
    }, [textSearch])
    useEffect(() => {
        setTextSearch("")
    }, [currentChatGrp])

    useEffect(() => {
        searchUsers(textSearch, user, currentChatGrp, isAdminCurrentGrp, setTextSearch)
    }, [addNewMember])

    return (
        <>
            {currentChatGrp && (
                <Container>
                    <Stack>

                        <InputGroup className="mb-3  w-1 mx-auto" >
                            <FormControl
                                placeholder="Ajouter Des Membres"
                                aria-label="Ajouter Des Membres"
                                value={textSearch}
                                onChange={handleInputChange}
                                className="form-control"
                                fontFamily="nunito"
                            />
                            <button className='send-btn d-flex align-items-center justify-content-center' onClick={() => searchUsers(textSearch, user, currentChatGrp, isAdminCurrentGrp, setTextSearch)}>
                                <img src={search} height="45px" alt="Search" />
                            </button>
                        </InputGroup>
                    </Stack>

                    <Stack>
                        {!isAdminCurrentGrp && currentChatGrp && textSearch && (
                            <div className="searchUsers-box d-flex align-items-center">
                                <strong className="text-center" style={{ color: 'red' }}>Vous devez être administrateur.</strong>
                            </div>
                        )}
                        {usersRecherche && usersRecherche.length > 0 && isAdminCurrentGrp && (
                            <div className="searchUsers-box">
                                {usersRecherche.map(utilisateur => (
                                    <div key={utilisateur.id}>{utilisateur.pseudo}
                                        <span onClick={() => ajoutMembre(setTextSearch,utilisateur.id, currentChatGrp, user)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    ajoutMembre(setTextSearch,utilisateur.id, currentChatGrp, user);
                                                }
                                            }}
                                            role="button"
                                            tabIndex="0"
                                            className="coucou"><img src={add} height="30px" /></span>
                                    </div>
                                ))}

                            </div>
                        )}
                    </Stack>
                </Container>
            )}
        </>

    )
        ;
}

export default SearchUsers;