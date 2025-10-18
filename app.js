require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const { message } = require('statuses');
const bcrypt = require('bcrypt');
const app = express();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

// ✅ AGREGAR ESTA LÍNEA - FALTABA
const mysql = require('mysql2/promise');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

/*correo*/
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// ======================================================
// CONFIGURACIÓN FORMULARIO INSCRIPCIÓN (NUEVO)
// ======================================================

// Configuración MySQL desde .env
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'gymgestplus',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para mapear plan a tabla
function mapPlanToTable(plan) {
    const planLower = plan.toLowerCase();
    if (planLower.includes('básico') || planLower.includes('basico')) return 'clientebasico';
    if (planLower.includes('acompañamiento') || planLower.includes('acompanamiento')) return 'clienteacom';
    if (planLower.includes('semi')) return 'clientesemi';
    if (planLower.includes('personalizado')) return 'clienteperso';
    return 'clientebasico'; // default
}

// Ruta para procesar inscripciones
app.post('/api/inscripcion', async (req, res) => {
    let connection;
    try {
        const { plan, nombre, email, edad, sexo, salud, objetivos } = req.body;

        // Validaciones básicas
        if (!nombre || !email || !plan || !sexo) {
            return res.status(400).json({ 
                success: false, 
                error: 'Faltan campos requeridos: nombre, email, plan y sexo' 
            });
        }

        // Determinar la tabla según el plan
        const tabla = mapPlanToTable(plan);
        
        // Conectar a la base de datos
        connection = await pool.getConnection();

        // Insertar en la tabla correspondiente
        let query, params;

        switch(tabla) {
            case 'clientebasico':
                query = `INSERT INTO clientebasico (name, email, edad, sexo, condicionesmedicas, trainingob, created_at) 
                         VALUES (?, ?, ?, ?, ?, ?, NOW())`;
                params = [nombre, email, edad, sexo, salud, objetivos];
                break;

            case 'clienteacom':
                query = `INSERT INTO clienteacom (name, email, edad, sexo, condicionesmedicas, trainingob, created_at) 
                         VALUES (?, ?, ?, ?, ?, ?, NOW())`;
                params = [nombre, email, edad, sexo, salud, objetivos];
                break;

            case 'clientesemi':
                query = `INSERT INTO clientesemi (name, email, edad, sexo, condicionesmedicas, trainingob, created_at) 
                         VALUES (?, ?, ?, ?, ?, ?, NOW())`;
                params = [nombre, email, edad, sexo, salud, objetivos];
                break;

            case 'clienteperso':
                query = `INSERT INTO clienteperso (name, email, edad, sexo, condicionesmedicas, trainingob, created_at) 
                         VALUES (?, ?, ?, ?, ?, ?, NOW())`;
                params = [nombre, email, edad, sexo, salud, objetivos];
                break;

            default:
                throw new Error('Tabla no válida');
        }

        // Ejecutar la inserción
        const [result] = await connection.execute(query, params);
        const idInscripcion = result.insertId;

        // Enviar correo electrónico
        try {
            const mailOptions = {
                from: `"Horus Gym" <${process.env.SMTP_USER}>`,
                to: process.env.MAIL_TO || process.env.SMTP_USER,
                subject: `Nueva Inscripción - Plan ${plan}`,
                html: `
                    <h2>Nueva Inscripción Recibida</h2>
                    <p><strong>Plan:</strong> ${plan}</p>
                    <p><strong>Nombre:</strong> ${nombre}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Edad:</strong> ${edad}</p>
                    <p><strong>Sexo:</strong> ${sexo}</p>
                    <p><strong>Condiciones médicas:</strong> ${salud || 'Ninguna'}</p>
                    <p><strong>Objetivos:</strong> ${objetivos || 'No especificado'}</p>
                    <p><strong>ID de inscripción:</strong> ${idInscripcion}</p>
                    <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log('Correo enviado correctamente');

        } catch (emailError) {
            console.error('Error enviando correo:', emailError);
            // No fallamos la petición si solo falla el correo
        }

        res.json({ 
            success: true, 
            message: 'Inscripción registrada correctamente',
            id: idInscripcion 
        });

    } catch (error) {
        console.error('Error en /api/inscripcion:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error interno del servidor: ' + error.message 
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// Ruta de prueba para verificar que el servidor funciona
app.get('/api/test', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        await connection.execute('SELECT 1');
        connection.release();
        
        res.json({ 
            success: true, 
            message: 'Servidor y base de datos funcionando correctamente' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Error conectando a la base de datos: ' + error.message 
        });
    }
});

// ======================================================
// RUTAS EXISTENTES (TUS RUTAS ORIGINALES)
// ======================================================

// Solicitud de recuperación de contraseña
app.post('/api/forgot', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'El campo email es obligatorio' });
  }

  const sql = 'SELECT * FROM entrenador WHERE Correo = ?';
  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.error('❌ Error en la consulta SQL', err);
      return res.status(500).json({ success: false, message: 'Error interno en la base de datos' });
    }

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'El correo no está registrado' });
    }

    // Generar token y guardar con fecha de expiración
    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 3600000); // +1 hora
    const mysqlDate = expiration.toISOString().slice(0, 19).replace('T', ' ');

    const updateSql = 'UPDATE entrenador SET reset_token = ?, token_expiry = ? WHERE Correo = ?';
    db.query(updateSql, [token, mysqlDate, email], (err) => {
      if (err) {
        console.error('❌ Error al guardar el token', err);
        return res.status(500).json({ success: false, message: 'No se pudo generar el enlace de recuperación' });
      }

      const resetLink = `http://localhost:3000/reset.html?token=${token}`;

      const mailOptions = {
        from: 'horusgymserviceemail@gmail.com',
        to: email,
        subject: 'Recuperación de contraseña',
        html: `
          <h2>Recuperación de contraseña</h2>
          <p>Haz clic en el siguiente enlace para restablecer tu contraseña (válido por 1 hora):</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>Si no solicitaste este cambio, ignora este mensaje.</p>
        `
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('❌ Error al enviar el correo', err);
          return res.status(500).json({ success: false, message: 'No se pudo enviar el correo de recuperación' });
        }

        console.log(`✅ Correo enviado a ${email} con token: ${token}`);
        res.status(200).json({ success: true, message: 'Correo de recuperación enviado correctamente' });
      });
    });
  });
});

// Restablecer contraseña con token
app.post('/api/reset/:token', (req, res) => {
  const { token } = req.params;
  const { nuevapassword, confirmpassword } = req.body;

  console.log('🔐 Token recibido:', token);
  console.log('📦 Body recibido:', req.body);

  if (!nuevapassword || !confirmpassword) {
    return res.status(400).json({ success: false, message: 'Ambas contraseñas son requeridas' });
  }

  if (nuevapassword !== confirmpassword) {
    return res.status(400).json({ success: false, message: 'Las contraseñas deben ser iguales' });
  }

  const sql = 'SELECT * FROM entrenador WHERE reset_token = ? AND token_expiry > NOW()';
  db.query(sql, [token], (err, results) => {
    if (err) {
      console.error('❌ Error en la consulta de token', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      console.log('⚠️ Token inválido o expirado');
      return res.status(400).json({ success: false, message: 'Token inválido o expirado' });
    }

    bcrypt.hash(nuevapassword, 10, (err, hash) => {
      if (err) {
        console.error('❌ Error al encriptar la contraseña', err);
        return res.status(500).json({ success: false, message: 'Error al encriptar la contraseña' });
      }

      const updateSql = `
        UPDATE entrenador 
        SET password = ?, reset_token = NULL, token_expiry = NULL 
        WHERE reset_token = ?
      `;
      db.query(updateSql, [hash, token], (err, result) => {
        if (err) {
          console.error('❌ Error al actualizar la contraseña', err);
          return res.status(500).json({ success: false, message: 'Error al actualizar la contraseña' });
        }

        if (result.affectedRows === 0) {
          return res.status(400).json({ success: false, message: 'No se pudo actualizar la contraseña' });
        }

        console.log('✅ Contraseña actualizada correctamente para el token:', token);
        res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
      });
    });
  });
});

// login api
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

        res.status(200).json({ success:true,
            user: {id: user.id_entrenador, nombre: user.Nombre_Entrenador}, message: 'Inicio correcto' });
    });
});

// registro api
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
        res.status(201).json({
            message:'registro correcto'
        });
    });
});

// Crear entrenador
app.post("/api/entrenadores", (req, res) => {
      const { agregarnombre, agregarcorreo, agregaruser, agregarpassword } = req.body;
    if (!agregarpassword || !agregarnombre || !agregarcorreo || !agregaruser) {
  return res.status(400).json({ success: false, message: "La contraseña es obligatoria" });
}

    const hashedPassword = bcrypt.hashSync(agregarpassword, 10);
  const sql = "INSERT INTO entrenador (Nombre_Entrenador, Correo, username, password) VALUES (?,?,?,?)";
  db.query(sql, [agregarnombre, agregarcorreo, agregaruser, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error al crear entrenador" });
    res.status(201).json({ success: true, message: "Entrenador creado", id_entrenador: result.insertId });
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
app.get("/api/entrenadores/:id_entrenador", (req, res) => {
  const { id_entrenador } = req.params;
  db.query("SELECT * FROM entrenador WHERE id_entrenador = ?", [id_entrenador], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Error al obtener entrenador" });
    res.json(results[0]);
  });
});

// Actualizar entrenador
app.put("/api/entrenadores/:id_entrenador", (req, res) => {
  const { id_entrenador } = req.params;
  const { editarnombrecompleto, editarcorreo, editaruser, editarpassword } = req.body;

  let sql, params;

  if (editarpassword && editarpassword.trim() !== "") {
    const hashedPassword = bcrypt.hashSync(editarpassword, 10);
    sql = "UPDATE entrenador SET Nombre_Entrenador = ?, Correo = ?, username = ?, password = ? WHERE id_entrenador = ?";
    params = [editarnombrecompleto, editarcorreo, editaruser, hashedPassword, id_entrenador];
  } else {
    sql = "UPDATE entrenador SET Nombre_Entrenador = ?, Correo = ?, username = ? WHERE id_entrenador = ?";
    params = [editarnombrecompleto, editarcorreo, editaruser, id_entrenador];
  }

  db.query(sql, params, (err) => {
    if (err) {
      console.error("Error al actualizar:", err);
      return res.status(500).json({ success: false, message: "Error al actualizar entrenador" });
    }
    res.json({ success: true, message: "Entrenador actualizado" });
  });
});

// Eliminar entrenador
app.delete("/api/entrenadores/:id_entrenador", (req, res) => {
  const { id_entrenador } = req.params;
  db.query("DELETE FROM entrenador WHERE id_entrenador = ?", [id_entrenador], (err) => {
    if (err) return res.status(500).json({ success: false, message: "Error al eliminar entrenador" });
    res.json({ success: true, message: "Entrenador eliminado" });
  });
});

// ======================================================
// INICIAR SERVIDOR
// ======================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor funcionando en http://localhost:3000 ${PORT}`);
    console.log(`📧 Correo configurado: ${process.env.SMTP_USER}`);
    console.log(`🗄️ Base de datos: ${process.env.DB_NAME}`);
});