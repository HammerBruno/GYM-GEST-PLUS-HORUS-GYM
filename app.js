/*el backend*/
const express = require ('express');
const cors = require ('cors');
const path = require ('path');
const db = require ('./db');
const { message } = require('statuses');
const bcrypt = require ('bcrypt');
const app = express();
const nodemailer = require('nodemailer');
const crypto = require('crypto');


app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname,'public')));
/*correo*/

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'horusgymserviceemail@gmail.com',
        pass: 'tztu zmay kswc jdwt' // usar app password
    }
});

/* Recuperar contraseña */
app.post('/api/forgot', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ 
            success: false, 
            message: 'El campo email es obligatorio' 
        });
    }

    const sql = 'SELECT * FROM entrenador WHERE Correo = ?';
    db.query(sql, [email], async (err, result) => {
        if (err) {
            console.error('Error en la consulta SQL', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Error interno en la base de datos' 
            });
        }

        if (result.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'El correo no está registrado' 
            });
        }

        // Generar token y guardar
        const token = crypto.randomBytes(32).toString('hex');
        const expiration = Date.now() + 3600000; // 1 hora
        const updateSql = 'UPDATE entrenador SET reset_token = ?, token_expiry = ? WHERE Correo = ?';

        db.query(updateSql, [token, expiration, email], (err) => {
            if (err) {
                console.error('Error al guardar el token', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'No se pudo generar el enlace de recuperación' 
                });
            }

            // Configurar correo
            const mailOptions = {
                from: 'horusgymserviceemail@gmail.com',
                to: email,
                subject: 'Recuperación de contraseña',
                html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                       <a href="http://localhost:3000/reset.html?token=${token}">Restablecer contraseña</a>`
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('Error al enviar el correo', err);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'No se pudo enviar el correo de recuperación' 
                    });
                }

                // ✅ Mensaje de éxito final
                return res.status(200).json({ 
                    success: true, 
                    message: 'Se ha enviado un correo con instrucciones para restablecer tu contraseña' 
                });
            });
        });
    });
});


    




app.get('/api/saludo', (req, res)=>{
    res.json({ mensaje: 'hola'})
});

// login api//
app.post('/api/login', async (req, res) => {
    const {usuario, password} = req.body;
    if (!usuario || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const sql = 'SELECT * FROM entrenador WHERE username = ?';
    db.query(sql, [usuario], async (err, result) => {
        if (err) {
            console.error('Error al iniciar sesión', err);
            return res.status(500).json({ message: 'Error al iniciar sesión' });
        }

        const user = result[0];
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }

        res.status(200).json({ message: 'Inicio correcto' });
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

// Registrar nuevo entrenador
app.post('/api/registro', (req, res) => {
  const { nombre, correo, usuario, password } = req.body;
  if (!nombre || !correo || !usuario || !password) {
    return res.status(400).json({
      message: 'Todos los campos son obligatorios'
    });
  }

  const encryptpass = bcrypt.hashSync(password, 10);
  const sql = 'INSERT INTO entrenador (Nombre_Entrenador, Correo, username, password) VALUES (?,?,?,?)';
  db.query(sql, [nombre, correo, usuario, encryptpass], (err, result) => {
    if (err) {
      console.error('Error al registrar', err);
      return res.status(500).json({ message: 'Error al registrar el usuario' });
    }
    res.status(201).json({ message: 'Registro correcto', id: result.insertId });
  });
});

// Crear entrenador (alias de registro, si quieres mantenerlo separado)
app.post("/api/entrenadores", (req, res) => {
  const { nombre, correo, usuario, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = "INSERT INTO entrenador (Nombre_Entrenador, Correo, username, password) VALUES (?,?,?,?)";
  db.query(sql, [nombre, correo, usuario, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error al crear entrenador" });
    res.status(201).json({ success: true, message: "Entrenador creado", id: result.insertId });
  });
});

// Leer todos los entrenadores
app.get("/api/entrenadores", (req, res) => {
  db.query("SELECT * FROM entrenador", (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Error al obtener entrenadores" });
    res.json(results);
  });
});

// Leer un entrenador por id
app.get("/api/entrenadores/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM entrenador WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Error al obtener entrenador" });
    res.json(results[0]);
  });
});

// Actualizar entrenador
app.put("/api/entrenadores/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, correo, usuario, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = "UPDATE entrenador SET Nombre_Entrenador = ?, Correo = ?, username = ?, password = ? WHERE id = ?";
  db.query(sql, [nombre, correo, usuario, hashedPassword, id], (err) => {
    if (err) return res.status(500).json({ success: false, message: "Error al actualizar entrenador" });
    res.json({ success: true, message: "Entrenador actualizado" });
  });
});

// Eliminar entrenador
app.delete("/api/entrenadores/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM entrenador WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ success: false, message: "Error al eliminar entrenador" });
    res.json({ success: true, message: "Entrenador eliminado" });
  });
});
app.listen(3000,()=>{
    console.log('el servidor esta corriendo en http://localhost:3000');
});
