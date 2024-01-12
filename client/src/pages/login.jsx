import { useContext } from 'react';
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col,Alert } from 'react-bootstrap';
import {Link} from "react-router-dom"
import { AuthContext } from '../context/AuthContext';

const Login = () => {

  const {loginUser,updateLoginInfo,isLoginLoading,loginError,loginInfo,loginFacebook} = useContext(AuthContext)

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h2 className="text-center">Connexion</h2>
          <hr />
          <Form onSubmit={loginUser}>
            <Form.Group controlId="formUsername"className='mb-4'>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez votre nom d'utilisateur"
                value={loginInfo.username}
                onChange={(e) => updateLoginInfo({ ...loginInfo, username: e.target.value })}
                name="username"
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className='mb-4'>
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Entrez votre mot de passe"
                value={loginInfo.password}
                onChange={(e) => updateLoginInfo({ ...loginInfo, password: e.target.value })}
                name="password"
                required
              />
            </Form.Group>

            <div className="text-center mt-3">
              <Button variant="primary" type="submit">
                {isLoginLoading ? "Connexion ..." : "Connecter"}
              </Button>
            </div>

            <div className="text-center mt-3">
          <Link onClick={()=> loginFacebook()} to ="/login" className="">
            Se Connecter Avec Facebook
          </Link>
        </div>
           
            {loginError?.error && (
              <Alert variant="danger">
                <p>{loginError.error}</p>
              </Alert>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
