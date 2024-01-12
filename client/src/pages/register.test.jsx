import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { AuthContext } from '../context/AuthContext';
import Register from './pages/register';

test('Le composant Register rend correctement', () => {
  // Simuler le contexte d'authentification pour le test
  const authContextValue = {
    registerInfo: {
      prenom: '',
      nom: '',
      pseudo: '',
      email: '',
      password: '',
      confMdp: '',
    },
    updateRegisterInfo: jest.fn(),
    registerUser: jest.fn(),
    registerError: null,
    isRegisterLoading: false,
  };

  // Rendre le composant Register avec le contexte d'authentification simulé
  const { getByLabelText, getByText } = render(
    <AuthContext.Provider value={authContextValue}>
      <Register />
    </AuthContext.Provider>
  );

  // Vérifier si les éléments attendus sont présents dans le rendu
  const prenomInput = getByLabelText('Prénom');
  expect(prenomInput).toBeInTheDocument();

  const nomInput = getByLabelText('Nom');
  expect(nomInput).toBeInTheDocument();

  const pseudoInput = getByLabelText('Pseudo');
  expect(pseudoInput).toBeInTheDocument();

  const emailInput = getByLabelText('Adresse e-mail');
  expect(emailInput).toBeInTheDocument();

  const passwordInput = getByLabelText('Mot de passe');
  expect(passwordInput).toBeInTheDocument();

  const confirmPasswordInput = getByLabelText('Confirmation du mot de passe');
  expect(confirmPasswordInput).toBeInTheDocument();

  const submitButton = getByText('Register');
  expect(submitButton).toBeInTheDocument();
});

test('Appelle la fonction registerUser lors de la soumission du formulaire', () => {
  // Simuler le contexte d'authentification pour le test
  const authContextValue = {
    registerInfo: {
      prenom: '',
      nom: '',
      pseudo: '',
      email: '',
      password: '',
      confMdp: '',
    },
    updateRegisterInfo: jest.fn(),
    registerUser: jest.fn(),
    registerError: null,
    isRegisterLoading: false,
  };

  // Rendre le composant Register avec le contexte d'authentification simulé
  const { getByLabelText, getByText } = render(
    <AuthContext.Provider value={authContextValue}>
      <Register />
    </AuthContext.Provider>
  );

  // Remplir les champs du formulaire
  const prenomInput = getByLabelText('Prénom');
  fireEvent.change(prenomInput, { target: { value: 'John' } });

  const nomInput = getByLabelText('Nom');
  fireEvent.change(nomInput, { target: { value: 'Doe' } });

  const pseudoInput = getByLabelText('Pseudo');
  fireEvent.change(pseudoInput, { target: { value: 'johndoe' } });

  const emailInput = getByLabelText('Adresse e-mail');
  fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

  const passwordInput = getByLabelText('Mot de passe');
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  const confirmPasswordInput = getByLabelText('Confirmation du mot de passe');
  fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

  // Soumettre le formulaire
  const submitButton = getByText('Register');
  fireEvent.click(submitButton);

  // Vérifier si la fonction registerUser a été appelée
  expect(authContextValue.registerUser).toHaveBeenCalledTimes(1);
});

