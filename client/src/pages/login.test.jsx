import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { AuthContext } from '../context/AuthContext';
import Login from './login';

test('Le composant Login rend correctement', () => {
  // Simuler le contexte d'authentification pour le test
  const authContextValue = {
    loginUser: jest.fn(),
    updateLoginInfo: jest.fn(),
    isLoginLoading: false,
    loginError: null,
    loginInfo: { username: '', password: '' },
    loginFacebook: jest.fn(),
  };

  // Rendre le composant Login avec le contexte d'authentification simulé
  const { getByLabelText, getByText } = render(
    <AuthContext.Provider value={authContextValue}>
      <Login />
    </AuthContext.Provider>
  );

  // Vérifier si les éléments attendus sont présents dans le rendu
  const usernameInput = getByLabelText('Username');
  expect(usernameInput).toBeInTheDocument();

  const passwordInput = getByLabelText('Mot de passe');
  expect(passwordInput).toBeInTheDocument();

  const submitButton = getByText('Connecter');
  expect(submitButton).toBeInTheDocument();
});

test('Appelle la fonction loginUser lors de la soumission du formulaire', () => {
  // Simuler le contexte d'authentification pour le test
  const authContextValue = {
    loginUser: jest.fn(),
    updateLoginInfo: jest.fn(),
    isLoginLoading: false,
    loginError: null,
    loginInfo: { username: '', password: '' },
    loginFacebook: jest.fn(),
  };

  // Rendre le composant Login avec le contexte d'authentification simulé
  const { getByLabelText, getByText } = render(
    <AuthContext.Provider value={authContextValue}>
      <Login />
    </AuthContext.Provider>
  );

  // Remplir les champs du formulaire
  const usernameInput = getByLabelText('Username');
  fireEvent.change(usernameInput, { target: { value: 'john.doe' } });

  const passwordInput = getByLabelText('Mot de passe');
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  // Soumettre le formulaire
  const submitButton = getByText('Connecter');
  fireEvent.click(submitButton);

  // Vérifier si la fonction loginUser a été appelée
  expect(authContextValue.loginUser).toHaveBeenCalledTimes(1);
});

