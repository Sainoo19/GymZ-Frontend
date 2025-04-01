import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppAdmin from '../src/pages/admin/AppAdmin';
import App from '../src/pages/client/App';
import firebase from 'firebase/compat/app';
import { AuthProvider } from './pages/client/AuthContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <React.StrictMode>
      {/* <AppAdmin /> */}
      <App />
    </React.StrictMode>
  </AuthProvider>
);

