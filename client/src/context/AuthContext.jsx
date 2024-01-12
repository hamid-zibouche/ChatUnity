import { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios"; // Import Axios

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    nom: "",
    prenom: "",
    pseudo: "",
    email: "",
    mdp: "",
    confMdp:"",
  });
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
  });

  useEffect(()=>{
    let user = localStorage.getItem('User')
    setUser(JSON.parse(user))
  },[])
  // console.log('user',user)

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const registerUser = useCallback(async (e) => {
    e.preventDefault();
    setIsRegisterLoading(true);
    setRegisterError(null);

    try {
      // console.log(`${registerInfo.mdp} && ${registerInfo.confMdp}`)
      if(registerInfo.mdp != registerInfo.confMdp){
        setIsRegisterLoading(false);
        return setRegisterError({ error: "Mot de passe et la confirmation ne sont pas conforme" });
      }

      const response = await axios.post(`http://localhost:3000/register`, registerInfo);
      setIsRegisterLoading(false);
      // console.log(`hhhhhhh ${response.data}`)

      if (response.data.error) {
        return setRegisterError(response.data);
      }

      localStorage.setItem("User", JSON.stringify(response.data));
      setUser(response.data);
    } catch (error) {
      setIsRegisterLoading(false);
      setRegisterError({ error: "An error occurred while registering." });
      if (error.response) {
        // La requête a été faite, mais le serveur a répondu avec un code de statut différent de 2xx
        console.error('Réponse du serveur avec erreur:', error.response.data);
  
        // Vous pouvez ensuite accéder aux détails de l'erreur renvoyée par le serveur
        setRegisterError({ error: error.response.data || "Une erreur s'est produite lors de l'inscription." });
      } else if (error.request) {
        // La requête a été faite, mais aucune réponse n'a été reçue
        console.error('Aucune réponse reçue du serveur:', error.request);
        setRegisterError({ error: "Aucune réponse du serveur. Veuillez réessayer plus tard." });
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error('Erreur lors de la configuration de la requête:', error.message);
        setRegisterError({ error: "Une erreur s'est produite lors de la configuration de la requête." });
      }
    }
  }, [registerInfo]);

  // console.log("loginInfo", loginInfo);
  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  const loginUser = useCallback(async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError(null);

    try {
      const response = await axios.post(`http://localhost:3000/login`, loginInfo);
      setIsLoginLoading(false);

      if (response.data.error) {
        return setLoginError(response.data);
      }

      localStorage.setItem("User", JSON.stringify(response.data));
      setUser(response.data);
    } catch (error) {
      setIsLoginLoading(false);
      setLoginError({ error: "An error occurred while login." });
      if (error.response) {
        // La requête a été faite, mais le serveur a répondu avec un code de statut différent de 2xx
        console.error('Réponse du serveur avec erreur:', error.response.data);
  
        // Vous pouvez ensuite accéder aux détails de l'erreur renvoyée par le serveur
        setLoginError({ error: error.response.data || "Une erreur s'est produite lors de l'inscription." });
      } else if (error.request) {
        // La requête a été faite, mais aucune réponse n'a été reçue
        console.error('Aucune réponse reçue du serveur:', error.request);
        setLoginError({ error: "Aucune réponse du serveur. Veuillez réessayer plus tard." });
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error('Erreur lors de la configuration de la requête:', error.message);
        setLoginError({ error: "Une erreur s'est produite lors de la configuration de la requête." });
      }
    }
  }, [loginInfo]);

  const loginFacebook = useCallback(async (e) => {

    try {
      const response = await axios.get(`http://localhost:3000/login/facebook`);
      setIsLoginLoading(false);

      if (response.data.error) {
        return setLoginError(response.data);
      }

      localStorage.setItem("User", JSON.stringify(response.data));
      setUser(response.data);
    } catch (error) {
      setIsLoginLoading(false);
      if (error.response) {
        // La requête a été faite, mais le serveur a répondu avec un code de statut différent de 2xx
        console.error('Réponse du serveur avec erreur:', error.response.data);
  
        // Vous pouvez ensuite accéder aux détails de l'erreur renvoyée par le serveur
      } else if (error.request) {
        // La requête a été faite, mais aucune réponse n'a été reçue
        console.error('Aucune réponse reçue du serveur:', error.request);
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error('Erreur lors de la configuration de la requête:', error.message);
      }
    }
  },[])

  const logoutUser = useCallback(()=>{
    localStorage.removeItem('User')
    setUser(null)
  },[])


  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        loginUser,
        updateLoginInfo,
        isLoginLoading,
        loginError,
        loginInfo,
        logoutUser,
        loginFacebook,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
