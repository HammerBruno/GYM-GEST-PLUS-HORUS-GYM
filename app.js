const express = require ('express');
const cors = require ('cors');
const path = require ('path');
const db = require ('./db');
const { message } = require('statuses');
const bcrypt = require ('bcrypt');
const app = express();


app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname,'public')));




app.get('/api/saludo', (req, res)=>{
    res.json({ mensaje: 'hola'})
});

// login api//
app.post('/api/login',(req, res)=>{
    
    const {usuario,password}=req.body;
    if (!usuario||!password){
        return res.status(400).json({
            message: 'Todos lo campos tienen que ser obligatorios'
        });
    }
   
    const sql='SELECT * FROM entrenador WHERE username = ? ';

    db.query(sql,[usuario],(err,result)=>{
        if(err){
            console.error('Error al iniciar sesion',err);
            return res.status(500).json({
            message:'Error al iniciar sesion'
        });
        }
        
        
        const user= result[0];

        const isMatch= bcrypt.compare (password, user.password);

        if (!isMatch) return res.status(401).json({
            success: false,
            message: 'Contraseña incorrecta'
        });
        //console.log('registro correcto');
        res.status(201).json({
            message:'inicio correcto'
        });
    });
});

    
// registro api//

app.post('/api/registro',(req,res)=>{
    const {nombre,correo,usuario,password}=req.body;
    if(!nombre||!correo||!usuario||!password){
        return res.status(400).json({
            message:'Todos lo campos tienen que ser obligatorios'
        });
    }
    const encryptpass= bcrypt.hashSync(password,10);
    const sql='INSERT INTO entrenador (Nombre_Entrenador,Correo,username,password) VALUES(?,?,?,?)';
    db.query(sql,[nombre,correo,usuario,encryptpass],(err,result)=>{
        if(err){
            console.error('Error al registrar',err);
            return res.status(500).json({
            message:'Error al registrar el usuario'
        });
        }
        //console.log('registro correcto');
        res.status(201).json({
            message:'registro correcto'
        });
    });
});
app.listen(3000,()=>{
    console.log('el servidor esta corriendo en http://localhost:3000');
});
