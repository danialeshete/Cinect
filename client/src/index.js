import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import { HelmetProvider } from 'react-helmet-async';


ReactDOM.render(
  <Auth0Provider
    domain="cinect.eu.auth0.com"
    clientId="AlX2KdLFtnGo3ldVUxXAzz6ltJkgK4S1"
    redirectUri={window.location.origin}
  >
    <HelmetProvider>
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </HelmetProvider>
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
