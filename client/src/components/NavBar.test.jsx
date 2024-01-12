import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { AuthContext } from '../context/AuthContext';
import NavBar from './components/Navbar';

test('Le composant NavBar rend correctement', () => {
  // Simuler un contexte d'authentification pour le test
  const authContextValue = {
    user: { username: 'JohnDoe' },
    logoutUser: jest.fn()
  };

  // Rendre le composant NavBar avec le contexte d'authentification simulé
  const { getByText } = render(
    <AuthContext.Provider value={authContextValue}>
      <NavBar />
    </AuthContext.Provider>
  );

  // Vérifier si le texte 'Chatbot' est présent
  const brandLink = getByText('Chatbot');
  expect(brandLink).toBeInTheDocument();

  // Vérifier si le texte 'Logged in as JohnDoe' est présent
  const loggedInUserText = getByText('Logged in as JohnDoe');
  expect(loggedInUserText).toBeInTheDocument();
});

test('Le bouton de déconnexion appelle la fonction logoutUser', () => {
  // Simuler un contexte d'authentification pour le test
  const authContextValue = {
    user: { username: 'JohnDoe' },
    logoutUser: jest.fn()
  };

  // Rendre le composant NavBar avec le contexte d'authentification simulé
  const { getByText } = render(
    <AuthContext.Provider value={authContextValue}>
      <NavBar />
    </AuthContext.Provider>
  );

  // Cliquer sur le lien "Logout"
  const logoutLink = getByText('Logout');
  fireEvent.click(logoutLink);

  // Vérifier si la fonction logoutUser a été appelée
  expect(authContextValue.logoutUser).toHaveBeenCalledTimes(1);
});