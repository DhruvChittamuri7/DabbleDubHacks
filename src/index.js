import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'
import Layout from './pages/Layout';
import NoPage from "./pages/NoPage";

import reportWebVitals from './reportWebVitals';
import firebase from 'firebase/compat/app';
import { initializeApp} from 'firebase/app'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Login/>} />
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

var firebaseConfig = {
  apiKey: "AIzaSyDcqMSqs0hAtKX4_7NHDMEabNkcKXDhnFo",
  authDomain: "dabble-c024e.firebaseapp.com",
  projectId: "dabble-c024e",
  storageBucket: "dabble-c024e.appspot.com",
  messagingSenderId: "1009792798284",
  appId: "1:1009792798284:web:8ac49fa0fbd8cba43c2ee9",
  measurementId: "G-85JSPP996L"
}

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore()
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
