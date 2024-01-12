import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Button, Container, Nav, Navbar, Stack } from "react-bootstrap";


const CreateServeur = () => {

    const { user } = useContext(AuthContext);

    const [nom, setNom] = useState("");

    useEffect(() => {
        console.log("-- Composant chargé");
    }, []);

    const handleCreateServeur = async () => {
        try {
            console.log("--- Envoie en cours");
            console.log("--- user : ", user);
            const response = await axios.post('http://localhost:3000/serveur/create', 
                nom
            );

            console.log("--- response : ", response);

        } catch (error) {
            console.log("erreur creation serveur : ", error);
        }
    }

    return (
        <form>
            <input type="text" placeholder="Nom Serveur" onChange={(e) => { setNom(e) }} />
            <Button onClick={() => { handleCreateServeur() }}>Ajouter Serveur</Button>
        </form>
    )


}

export default CreateServeur;