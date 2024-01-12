import { Container, InputGroup, FormControl } from "react-bootstrap";
import Stack from 'react-bootstrap/Stack';
import search from "../../assets/search1.svg"
import coucou from "../../assets/coucou.png"
import { useState, useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";



const SearchUsers = () => {
    const [textSearch, setTextSearch] = useState("")
    const { searchUsers, usersRecherche, setUsersRecherche, sendCoucou } = useContext(ChatContext)
    const { user } = useContext(AuthContext)
    const handleInputChange = (e) => {
        setTextSearch(e.target.value);
    };

    useEffect(() => {
        if (textSearch.trim()) {
            searchUsers(textSearch, user, setTextSearch)
        } else {
            setTextSearch("")
            setUsersRecherche("")
        }
    }, [textSearch])

    return (
        <>
            <Stack>

                <InputGroup className="mb-3  w-1 mx-auto" >
                    <FormControl
                        placeholder="Rechercher des amis"
                        aria-label="Rechercher des amis"
                        value={textSearch}
                        onChange={handleInputChange}
                        className="form-control"
                        fontFamily="nunito"
                    />
                    <button className='send-btn d-flex align-items-center justify-content-center' onClick={() => searchUsers(textSearch, user, setTextSearch)}>
                        <img src={search} height="45px" alt="Search" />
                    </button>
                </InputGroup>
            </Stack>

            <Stack>
                {usersRecherche && usersRecherche.length > 0 && (
                    <div className="searchUsers-box">
                        {usersRecherche.map(utilisateur => (
                            <div key={utilisateur.id}>{utilisateur.pseudo}
                                <span onClick={() => sendCoucou(utilisateur.id, user)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            sendCoucou(utilisateur.id, user);
                                        }
                                    }}
                                    role="button"
                                    tabIndex="0"
                                    className="coucou"><img src={coucou} height="30px" /></span>
                            </div>
                        ))}

                    </div>
                )}
            </Stack>
        </>

    )
        ;
}

export default SearchUsers;