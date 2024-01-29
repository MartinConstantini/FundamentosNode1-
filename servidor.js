const express = require ('express')
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const app = express()
const port = 6000
//conexion a la bd
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDj_1JF47_WYNjFkoww3LHTSVSFGq0NgNc",
  authDomain: "crud-practica1hm.firebaseapp.com",
  projectId: "crud-practica1hm",
  storageBucket: "crud-practica1hm.appspot.com",
  messagingSenderId: "309363429651",
  appId: "1:309363429651:web:a1ebdb4e2b0c68ffc84ae6",
  measurementId: "G-MJTK53JB72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


app.get('/',(req,res)=>{
    res.send('Respuesta de Raiz')
})

app.get('/contacto',(req,res)=>{
    res.send('Respuesta desde contacto')
})
