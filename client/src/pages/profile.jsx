import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";

const ProfilUtilisateurComponent = () => {
  const { user } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    prenom: '',
    nom: '',
    username: '',
    email: '',
    mdp: '',
  });
  const [isRegisterLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [message, setMessage] = useState('');

  const handleCancelEdit = () => {
    setEditMode(false);
    setRegisterInfo({
      prenom: userProfile.prenom,
      nom: userProfile.nom,
      pseudo: userProfile.pseudo,
      email: userProfile.email,
      mdp: '',
    });
  };
  
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users/profil',
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
      console.log('username :', response.data);
      setUserProfile(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const updateRegisterInfo = (newInfo) => {
    setRegisterInfo(newInfo);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {

      setRegisterLoading(true);

      const response = await axios.put('http://localhost:3000/users/profil',
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

      console.log(response);

      setMessage(response.data.infoUser || response.data.message);
      setRegisterLoading(false);
      setEditMode(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil utilisateur', error);
      setRegisterLoading(false);
      setRegisterError(error.response?.data || { error: 'Une erreur inattendue s\'est produite.' });
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h2 className='text-center'>Profil</h2>
          <hr />
          <Form onSubmit={handleUpdateProfile}>
            <Form.Group controlId="formFirstName">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                placeholder={userProfile.prenom}
                value={registerInfo.prenom}
                onChange={(e) => updateRegisterInfo({ ...registerInfo, prenom: e.target.value })}
                name="prenom"
                readOnly={!editMode}

              />
            </Form.Group>

            <Form.Group controlId="formLastName">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                placeholder={userProfile.nom}
                value={registerInfo.nom}
                onChange={(e) => updateRegisterInfo({ ...registerInfo, nom: e.target.value })}
                name="nom"
                readOnly={!editMode}

              />
            </Form.Group>

            <Form.Group controlId="formUsername">
              <Form.Label>username</Form.Label>
              <Form.Control
                type="text"
                placeholder={userProfile.username}
                value={registerInfo.username}
                onChange={(e) => updateRegisterInfo({ ...registerInfo, username: e.target.value })}
                name="username"
                readOnly={!editMode}

              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Adresse e-mail</Form.Label>
              <Form.Control
                type="email"
                placeholder={userProfile.email}
                value={registerInfo.email}
                onChange={(e) => updateRegisterInfo({ ...registerInfo, email: e.target.value })}
                name="email"
                readOnly={!editMode}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Entrez votre nouveau mot de passe"
                value={registerInfo.mdp}
                onChange={(e) => updateRegisterInfo({ ...registerInfo, mdp: e.target.value })}
                name="mdp"
                readOnly={!editMode}

              />
            </Form.Group>

            <div className="text-center mt-3">
              {editMode ? (
                <>
                  <Button variant="primary" type="submit" disabled={isRegisterLoading}>
                    {isRegisterLoading ? "Mise à jour en cours..." : "Enregistrer les modifications"}
                  </Button>
                  <Button variant="secondary" className="ml-2" onClick={() => window.location.href = '/profil'}>
                    Annuler
                  </Button>
                </>
              ) : (
                <Button variant="info" onClick={() => setEditMode(true)}>
                  Modifier le profil
                </Button>
              )}
            </div>

            {registerError?.error && (
              <Alert variant="danger" className="mt-3">
                <p>{registerError.error}</p>
              </Alert>
            )}
            {message && (
              <Alert variant="success" className="mt-3">
                <p>{message}</p>
              </Alert>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilUtilisateurComponent;
