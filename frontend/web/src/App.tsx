import React from 'react';

import { Router } from 'react-router-dom';

import AppContainer from './hooks';
import Routes, { history } from './routes';

import GlobalStyle from './styles/global';

function App() {
  return (
    <AppContainer>
      <Router history={history}>
        <GlobalStyle />
        <Routes />
      </Router>
    </AppContainer>
  );
}

export default App;
