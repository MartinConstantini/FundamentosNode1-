//import express from 'express'
//import bcrypt from 'bcrypt'
//import 'dotenv/config'
//import { initializeApp } from "firebase/app";
//import { getFirestore } from 'firebase/firestore'
//import {collection,doc,getDoc,getFirestore,setDoc} from 'firebase/firestore'
import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc,getDocs, setDoc,deleteDoc, updateDoc } from 'firebase/firestore';
import 'dotenv/config';

// Your web app's Firebase configuration
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
const firebase = initializeApp(firebaseConfig);
const db = getFirestore();
const corsOptions = {
    origin : '*',
    optionsSuccessStatus : 200
}
const app = express();
app.use(express.json());
app.use(cors(corsOptions))
app.get('/', (req, res) => {
    res.send('Respuesta de raiz Martin');
});

app.post('/signup', async (req, res) => {
    const { nombre, apaterno, amaterno, telefono, usuario, password } = req.body;

    if (nombre.length < 3) {
        return res.json({
            'alerta': 'El nombre debe tener al menos 3 letras'
        });
    } else if (!apaterno.length) {
        return res.json({
            'alerta': 'El apellido no puede ser vacío'
        });
    } else if (!usuario.length) {
        return res.json({
            'alerta': 'El usuario no puede ser vacío'
        });
    } else if (password.length < 6) {
        return res.json({
            'alerta': 'La contraseña requiere al menos 6 caracteres'
        });
    }

    try {
        const usuarios = collection(db, 'usuarios');
        const user = await getDoc(doc(usuarios, usuario));

        if (user.exists()) {
            return res.json({
                'alerta': 'Usuario ya existe'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        req.body.password = hash;

        await setDoc(doc(usuarios, usuario), req.body);

        res.json({
            'alert': 'success'
            //'registered': req.body
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            'alerta': 'Error interno del servidor'
        });
    }
});

app.post('/login', async (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario.length || !password.length) {
        return res.json({
            'alerta': 'Algunos campos están vacíos'
        });
    }

    try {
        const usuarios = collection(db, 'usuarios');
        const user = await getDoc(doc(usuarios, usuario));

        if (!user.exists()) {
            return res.json({
                'alerta': 'El usuario no existe'
            });
        }

        bcrypt.compare(password, user.data().password, (err, result) => {
            if (result) {
                const userFound = user.data();
                return res.json({
                    'alert': 'success',
                    'usuario': userFound
                });
            } else {
                return res.json({
                    'alerta': 'La contraseña no es válida'
                });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            'alerta': 'Error interno del servidor'
        });
    }
});

app.get('/get-all', async (req, res) => {
    const usuarios = collection(db, 'usuarios');
    const docsUsuarios = await getDocs(usuarios);
    const arrUsuarios = [];

    docsUsuarios.forEach((usuario) => {
        const obj = {
            nombre: usuario.data().nombre,
            apaterno: usuario.data().apaterno,
            amaterno: usuario.data().amaterno,
            usuario: usuario.data().usuario,
            telefono: usuario.data().telefono
        };
        arrUsuarios.push(obj);
    });

    if (arrUsuarios.length > 0) {
        res.json({
            'alerta': 'Success',
            'data': arrUsuarios
        });
    } else {
        res.json({
            'alerta': 'Success',
            'message': 'No hay usuarios en la base de datos'
        });
    }
});


app.post('/delete-user', async (req, res) => {
    const { usuario } = req.body;

    try {
        const usuarios = collection(db, 'usuarios');
        const userDoc = doc(usuarios, usuario);
        const user = await getDoc(userDoc);

        if (!user.exists()) {
            return res.json({
                'alerta': 'El usuario no existe en la base de datos'
            });
        }

        await deleteDoc(userDoc);

        res.json({
            'alerta': 'Usuario eliminado correctamente'
        });
    } catch (error) {
        console.error(error);
        res.json({
            'alerta': 'Fallo',
            'mesage': err
        });
    }
});

app.post('/update-user', async (req, res) => {
    const usuario = req.body;
    const { password } = req.body;

    try {
        const usuarios = collection(db, 'usuarios');
        const userDoc = doc(usuarios, usuario.usuario);
        const user = await getDoc(userDoc);

        if (!user.exists()) {
            return res.json({
                'alerta': 'El usuario no existe en la base de datos'
            });
        }

        // Encripta la nueva contraseña si se proporciona
        if (password && password.length >= 6) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            usuario.password = hash;
        }

        // Actualiza el documento de usuario con los campos proporcionados
        await updateDoc(userDoc, usuario);

        res.json({
            'alerta': 'Usuario actualizado correctamente'
        });
    } catch (error) {
        console.error(error);
        res.json({
            'alerta': 'Fallo al actualizar usuario',
            'message': error
        });
    }
});

const port = process.env.PORT || 6000;

app.listen(port, () => {
    console.log('Servidor escuchando en el puerto:', port);
});
