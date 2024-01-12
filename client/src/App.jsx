import { Routes, Route, Navigate } from "react-router-dom"
import Chat from "./pages/chat"
import Login from "./pages/login"
import Register from "./pages/register"
import ChatGroupes from "./pages/chatGroupes"
import "bootstrap/dist/css/bootstrap.min.css"
import { Container } from "react-bootstrap"
import { AuthContext } from "./context/AuthContext"
import  ProfilUtilisateurComponent  from "./pages/profile"

import NavBar from "./components/NavBar"
import { useContext } from "react"
import { ChatContextProvider } from "./context/ChatContext"
import { ChatGrpContextProvider } from "./context/ChatGrpContext"
function App() {
  const { user } = useContext(AuthContext)
  return (<>

    <ChatContextProvider user={user}>
      <ChatGrpContextProvider user={user}>
        <NavBar />
        <Container className="">
          <Routes>
            <Route path="/" element={user ? <Chat /> : <Login />}></Route>
            <Route path="/login" element={user ? <Chat /> : <Login />}></Route>
            <Route path="/register" element={user ? <Chat /> : <Register />}></Route>
            <Route path="/chat" element={user ? <Chat /> : <Login />}></Route>
            <Route path="/chatGroupes" element={user ? <ChatGroupes /> : <Login />}></Route>
            <Route path="/profil" element = { user ? <ProfilUtilisateurComponent/> : <Register/>}></Route>
            <Route path="*" element={<Navigate to="/" />}></Route>
          </Routes>
        </Container>
      </ChatGrpContextProvider>
    </ChatContextProvider>

  </>)
}

export default App
