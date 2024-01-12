import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { ChatContextProvider } from '../context/chatContext';
import App from './App';

test('Le composant App rend correctement', () => {
  // Simuler le contexte d'authentification pour le test
  const authContextValue = {
    user: null,
  };

  // Rendre le composant App avec le contexte d'authentification simulé
  const { getByText } = render(
    <MemoryRouter>
      <AuthContext.Provider value={authContextValue}>
        <App />
      </AuthContext.Provider>
    </MemoryRouter>
  );

  // Vérifier si les éléments attendus sont présents dans le rendu
  const loginTitle = getByText('Login');
  expect(loginTitle).toBeInTheDocument();

  const registerTitle = getByText('Register');
  expect(registerTitle).toBeInTheDocument();
});

