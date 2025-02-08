import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppAdmin from '../src/pages/admin/AppAdmin';
import firebase from 'firebase/compat/app';


const firebaseConfig = {
  apiKey: "AIzaSyAfBwK1Ql-hoLh9P1yEdBP1bsqlhuNSUgc",
  authDomain: "gymz-image.firebaseapp.com",
  projectId: "gymz-image",
  storageBucket: "gymz-image.firebasestorage.app",
  messagingSenderId: "806728501409",
  appId: "1:806728501409:web:6ce5d335924fc3954d48e0",
  measurementId: "G-XZVSCDMH9V"
};

firebase.initializeApp(firebaseConfig);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppAdmin />
  </React.StrictMode>
);

