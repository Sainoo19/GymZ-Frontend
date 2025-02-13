import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppAdmin from '../src/pages/admin/AppAdmin';
import firebase from 'firebase/compat/app';

//Firebase của Huyền Thư
const firebaseConfig = {
  apiKey: "AIzaSyBmPJ_nXitVvPnxD67VtQF5F-vnzujiuNs",
  authDomain: "gymz-image-a912a.firebaseapp.com",
  projectId: "gymz-image-a912a",
  storageBucket: "gymz-image-a912a.firebasestorage.app",
  messagingSenderId: "1060870666319",
  appId: "1:1060870666319:web:7f94b5dc881bb1fbe1523a",
  measurementId: "G-YNKNCGY27P"
};
firebase.initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppAdmin />
  </React.StrictMode>
);

