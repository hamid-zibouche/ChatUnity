import React from 'react';
import { render } from '@testing-library/react';
import { ChatContext } from '../context/chatContext';
import { AuthContext } from '../context/AuthContext';
import Chat from './chat';

test('Le composant Chat rend correctement', () => {
  // Simuler le contexte de chat pour le test
  const chatContextValue = {
    userChats: [
      { id: 1, name: 'Chat1' },
      { id: 2, name: 'Chat2' },
    ],
    isUserChatsLoading: false,
    userChatsError: null,
    updateCurrentChat: jest.fn(),
    messages: [],
  };

  // Simuler le contexte d'authentification pour le test
  const authContextValue = {
    user: { username: 'JohnDoe' },
  };

  // Rendre le composant Chat avec les contextes simulés
  const { getByText } = render(
    <ChatContext.Provider value={chatContextValue}>
      <AuthContext.Provider value={authContextValue}>
        <Chat />
      </AuthContext.Provider>
    </ChatContext.Provider>
  );

  // Vérifier si les éléments attendus sont présents dans le rendu
  const chat1Element = getByText('Chat1');
  expect(chat1Element).toBeInTheDocument();

  const chat2Element = getByText('Chat2');
  expect(chat2Element).toBeInTheDocument();
});

