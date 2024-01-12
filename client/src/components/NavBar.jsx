import { useContext } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext";
import avatarUser from "../assets/avatarUser4.png"

import logout from "../assets/logout.png"

const NavBar = () => {
    const { user, logoutUser } = useContext(AuthContext)
    return (
        <Navbar bg="dark" className="mb-4" style={{ height: "3.75rem" }}>
            <Container> 
                <h2>
                    <Link to="/">ChatUnity</Link>
                </h2>
                {user && <span className="text-warning">
                    <Link to="/profil" className="text-decoration-none">
                        <img src={avatarUser} height="35px" />
                    </Link>{user?.username}</span>}
                <Nav>
                    <Stack direction="horizontal" gap="3">
                        {user && (<>
                            <Link to="/chat" className="text-decoration-none">
                                Messages
                            </Link>
                            <Link to="/chatGroupes" className="text-decoration-none">
                                Groupes
                            </Link>
                            <Link onClick={() => logoutUser()} to="/login" className="text-decoration-none">
                                <img src={logout} alt="logout" height="37px" />
                            </Link>

                        </>)}

                        {!user && (<>
                            <Link to="/login" className="text-decoration-none">
                                Login
                            </Link>

                            <Link to="/register" className="text-decoration-none">
                                Register
                            </Link>
                        </>)}

                    </Stack>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavBar;