import { useContext } from 'react';
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col,Alert } from 'react-bootstrap';

import { AuthContext } from '../context/AuthContext';

const Register = () => {

const {registerInfo,updateRegisterInfo,registerUser,registerError,isRegisterLoading} = useContext(AuthContext)

  return (
    <Container className="mt-5">
  <Row>
    <Col md={{ span: 6, offset: 3 }}>
      <h2 className='text-center'>Register</h2>
      <hr></hr>
      <Form onSubmit={registerUser}>
        <Form.Group controlId="formFirstName">
          <Form.Label>Prénom</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrez votre prénom"
            value={registerInfo.prenom}
            onChange={(e) => updateRegisterInfo({ ...registerInfo, prenom: e.target.value })}
            name="prenom"  // Ajoutez l'attribut name ici
            required
          />
        </Form.Group>

        <Form.Group controlId="formLastName">
          <Form.Label>Nom</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrez votre nom"
            value={registerInfo.nom}
            onChange={(e) => updateRegisterInfo({ ...registerInfo, nom: e.target.value })}
            name="nom"  // Ajoutez l'attribut name ici
            required
          />
        </Form.Group>

        <Form.Group controlId="formUsername">
          <Form.Label>Pseudo</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrez votre pseudo"
            value={registerInfo.pseudo}
            onChange={(e) => updateRegisterInfo({ ...registerInfo, pseudo: e.target.value })}
            name="pseudo"  // Ajoutez l'attribut name ici
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Adresse e-mail</Form.Label>
          <Form.Control
            type="email"
            placeholder="Entrez votre adresse e-mail"
            value={registerInfo.email}
            onChange={(e) => updateRegisterInfo({ ...registerInfo, email: e.target.value })}
            name="email"  // Ajoutez l'attribut name ici
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control
            type="password"
            placeholder="Entrez votre mot de passe"
            value={registerInfo.password}
            onChange={(e) => updateRegisterInfo({ ...registerInfo, mdp: e.target.value })}
            name="mdp"  // Ajoutez l'attribut name ici
            required
          />
        </Form.Group>

        <Form.Group controlId="formConfirmPassword">
          <Form.Label>Confirmation du mot de passe</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirmez votre mot de passe"
            name="confirmMdp"  // Ajoutez l'attribut name ici
            onChange={(e) => updateRegisterInfo({ ...registerInfo, confMdp: e.target.value })}
            required
          />
        </Form.Group>

        <div className="text-center mt-3">
          <Button variant="primary" type="submit">
            {isRegisterLoading ? "Creating your account" : "Register"}
          </Button>
        </div>

        {registerError?.error && (
          <Alert variant="danger">
            <p>{registerError.error}</p>
          </Alert>
        )}
      </Form>
    </Col>
  </Row>
</Container>
  );
};

export default Register;