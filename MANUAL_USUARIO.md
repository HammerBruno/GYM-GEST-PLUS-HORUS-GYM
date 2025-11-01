<!-- Manual de usuario y guía técnica para GYM GEST PLUS (Horus Gym) -->

# Manual de usuario y guía técnica — GYM GEST PLUS (Horus Gym)

**Última actualización:** 2025-11-01

**Versión:** 1.1.0

## Resumen ejecutivo

GYM GEST PLUS es una aplicación web diseñada para gestionar clientes y entrenadores de un gimnasio. Proporciona funcionalidades para:

- Registro e inicio de sesión de entrenadores.
- Gestión CRUD de entrenadores y clientes por tipo de plan (Básico, Acompañamiento, Semi Personalizado, Personalizado).
- Inscripciones públicas mediante formulario web con notificación por correo.
- Recuperación de contraseña mediante token.

Este documento sirve tanto a usuarios operativos (administradores, entrenadores) como a personal técnico encargado del despliegue y mantenimiento.

## Audiencia

- Administradores del gimnasio (uso de paneles CRUD y gestión de usuarios).
- Operadores que registran o modifican clientes.
- Personal técnico que instalara, desplegará o dará soporte a la aplicación.

## Requisitos

- Node.js >= 16
- npm
- MySQL / MariaDB (compatible con `mysql2`)
- Servidor SMTP (por ejemplo Gmail con contraseña de aplicación o servicio SMTP empresarial)
- Puerto libre (por defecto 3000)

## Estructura del proyecto

- `app.js` — Servidor Express con todas las rutas API y lógica principal.
- `db.js` — Cliente/conexión MySQL.
- `gymgestplus.sql` — Volcado con el esquema de la base de datos.
- `public/` — Frontend estático (HTML/CSS/JS):
  - `index.html` — Login, registro y recuperación.
  - `inscripcion.html` — Formulario público para inscripciones.
  - `gym.html`, `crud*.html`, `dashboard-1.html` — Páginas administrativas.
  - `public/js/` — Scripts del cliente (`script.js`, `crud*.js`).
- `package.json` — Dependencias.

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables mínimas:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=gymgestplus
PORT=3000
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=tu_contraseña_de_aplicación
MAIL_TO=correo_destino_para_notificaciones  # opcional
```

- No almacenar credenciales reales en el repositorio.
- Si se usa Gmail, crear una contraseña de aplicación y usarla en `SMTP_PASS`.

## Instalación y puesta en marcha (desarrollo local)

1. Abrir PowerShell en la carpeta del proyecto.
2. Instalar dependencias:

```powershell
npm install
```

3. Crear la base de datos e importar `gymgestplus.sql`:

```powershell
# Crear DB si no existe
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS gymgestplus CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
# Importar esquema
mysql -u root -p gymgestplus < .\gymgestplus.sql
```

4. Crear `.env` con la configuración mostrada arriba.
5. Iniciar el servidor:

```powershell
node app.js
# o con nodemon durante desarrollo
# npx nodemon app.js
```

6. Abrir en el navegador: `http://localhost:3000`

## Despliegue en producción (recomendaciones)

- Ejecutar la aplicación detrás de un reverse proxy (nginx o Apache) y exponer solo el proxy al público.
- Usar PM2 o systemd para gestionar el proceso Node.
- Forzar HTTPS (Let's Encrypt u otro CA).
- Guardar secretos en un gestor de secretos (Azure Key Vault, AWS Secrets Manager, etc.) o variables de entorno del host.
- Restringir el acceso a la base de datos por IP y usar cuentas con privilegios mínimos.
- Habilitar monitorización y backups automáticos de la base de datos.

## Arquitectura y flujo

- El frontend en `public/` realiza peticiones HTTP (fetch/XHR) a la API REST definida en `app.js`.
- `app.js` utiliza `mysql2`/`mysql` (según la configuración) o el módulo `db.js` para comunicación con MySQL.
- Los correos se envían mediante `nodemailer` y la configuración SMTP del `.env`.

## Base de datos — resumen de tablas relevantes

- `entrenador` — usuarios del sistema (id_entrenador, Nombre_Entrenador, Correo, username, password (hash), reset_token, token_expiry, ...).
- `clientebasico` — clientes plan básico (id, name, email, edad, sexo, condicionesmedicas, trainingob, created_at).
- `clienteacom` — clientes plan acompañamiento (campos extendidos: antropometrics, trainingplan, assignedcoach).
- `clientesemi` — clientes semi personalizado (incluye peso, altura, eatplan).
- `clienteperso` — clientes personalizado (incluye drugplan y campos adicionales).

Revisar `gymgestplus.sql` para el DDL completo.

## Referencia de API (resumen)

Nota: Todas las peticiones que envían body JSON deben incluir el header `Content-Type: application/json`.

Autenticación: actualmente el proyecto valida credenciales y devuelve información del usuario; se recomienda implementar JWT o sesiones para proteger rutas administrativas.

Endpoints clave

- POST `/api/login`
  - Body: { usuario, password }
  - Respuesta (200): { success: true, user: { id, nombre }, message }

- POST `/api/registro`
  - Body: { nombre, correo, usuario, password }
  - Crea registro en `entrenador`.

- POST `/api/entrenadores` — Crear entrenador (admin)
- GET `/api/entrenadores` — Listar
- GET `/api/entrenadores/:id_entrenador` — Obtener
- PUT `/api/entrenadores/:id_entrenador` — Actualizar
- DELETE `/api/entrenadores/:id_entrenador` — Eliminar

CRUD clientes (por tipo de plan):
- `/api/clientebasico`, `/api/clienteacom`, `/api/clientesemi`, `/api/clienteperso` — soportan GET (lista), GET/:id, POST, PUT/:id, DELETE/:id

- POST `/api/inscripcion`
  - Body: { plan, nombre, email, edad, sexo, salud, objetivos }
  - Inserta en la tabla correspondiente y envía notificación por correo.

- POST `/api/forgot`
  - Body: { email }
  - Genera token, guarda `reset_token` y `token_expiry` en `entrenador` y envía correo con enlace de reseteo.

- POST `/api/reset/:token`
  - Body: { nuevapassword, confirmpassword }
  - Valida token, hashea nueva contraseña y la actualiza en la base de datos.

- GET `/api/test` — Endpoint de diagnóstico que verifica conectividad con DB.

Ejemplo de uso con curl (PowerShell)

```powershell
# Login
curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"usuario":"admin","password":"pass"}'

# Crear cliente básico
curl -X POST http://localhost:3000/api/clientebasico -H "Content-Type: application/json" -d '{"name":"Juan","email":"juan@ejemplo.com","sexo":"M"}'

# Inscripción pública
curl -X POST http://localhost:3000/api/inscripcion -H "Content-Type: application/json" -d '{"plan":"Básico","nombre":"Ana","email":"ana@ej.com","edad":28,"sexo":"F"}'
```

## Operación diaria (manual de usuario)

Inicio de sesión y registro

- Abrir `index.html`.
- En el formulario de login introducir `Usuario` y `Contraseña`.
- Para registro, ir a la pestaña de registro e introducir nombre, correo, usuario y contraseña.

Gestión de clientes y entrenadores (paneles CRUD)

- Acceder a las páginas `crud*.html` desde el menú o directamente.
- Listar, crear, editar y eliminar registros utilizando los formularios y tablas disponibles.

Inscripciones públicas

- Cualquier visitante puede completar `inscripcion.html` y elegir un plan. La app guardará la inscripción y enviará una notificación por correo.

Recuperación de contraseña

- El usuario podrá pedir recuperar su contraseña desde `forgot.html`. Recibirá un enlace por email válido por 1 hora.

## Troubleshooting / Errores comunes

- Error: `ECONNREFUSED` al conectar con MySQL
  - Asegurarse que el servicio MySQL está en ejecución.
  - Verificar credenciales en `.env` y que la base `gymgestplus` existe.

- Error: falló el envío de correo
  - Verificar `SMTP_USER` / `SMTP_PASS`.
  - Revisar logs y permisos en el proveedor SMTP (Gmail puede bloquear conexiones si no se configuran contraseñas de aplicación).

- Error 500 en endpoints POST/PUT
  - Revisar la consola del servidor para rastrear el stacktrace.
  - Confirmar que los datos enviados cumplen con las validaciones (campos obligatorios).

## Seguridad — recomendaciones

- No exponer `.env` ni credenciales en el repositorio.
- Emplear HTTPS en producción.
- Añadir autenticación basada en tokens (JWT) o sesiones con manejo de permisos para páginas administrativas.
- Validar y sanitizar todas las entradas del usuario antes de ejecutar consultas SQL. Ya se usan consultas parametrizadas (placeholder `?`) en `app.js`.
- Mantener dependencias actualizadas y ejecutar `npm audit` periódicamente.

## Mantenimiento y mejoras propuestas

Prioridad alta:

1. Implementar JWT y middleware de autorización para proteger rutas administrativas.
2. Añadir un panel de auditoría para registrar operaciones críticas (creación/edición/borrado).

Prioridad media:

1. Colecciones de pruebas (unit/integration) para endpoints críticos.
2. Exportar colección Postman para facilitar pruebas manuales.

Prioridad baja:

1. Internacionalización del frontend.
2. Integración con servicios de monitorización y alertas.

## Apéndices

### A. Glosario

- CRUD: Create Read Update Delete
- SMTP: Protocolo de envío de correo
- JWT: JSON Web Token

### B. Contacto y soporte

Para soporte técnico o contribuciones:

- Abrir issues en el repositorio y describir reproduciblemente el problema.
- Para cambios de código, enviar pull requests con descripción y pruebas.

---

Si quieres, preparo:

- Un `README.md` breve y listo para GitHub.
- Una colección Postman/Insomnia con los endpoints más importantes.
- Un PDF del manual o la inclusión de capturas de pantalla (si me envías imágenes puedo integrarlas).

Indica qué prefieres y continúo.
## Manual de usuario - GYM GEST PLUS (Horus Gym)

Fecha: 2025-11-01

### Propósito

Este documento explica cómo instalar, configurar y usar la aplicación web contenida en este repositorio. Está orientado a usuarios administrativos y a quien despliegue la aplicación en un entorno local o en un servidor.

### Requisitos

- Node.js (>= 16 recomendada)
- npm
- MySQL (o MariaDB) con acceso para crear/usar la base de datos `gymgestplus`
- Acceso a un servidor SMTP para el envío de correos (por ejemplo Gmail con contraseña de aplicación)

### Estructura principal del proyecto

- `app.js` - Servidor Express principal con todas las rutas API (login, registro, CRUD, inscripciones, recuperación de contraseña).
- `db.js` - Conexión MySQL (usa `mysql2` y/o `mysql` según la configuración).
- `gymgestplus.sql` - Volcado/estructura de la base de datos (importar en MySQL).
- `public/` - Archivos estáticos: páginas HTML, CSS y JS de frontend.
  - `public/index.html` - Página de inicio (login/registro).
  - `public/inscripcion.html` - Formulario de inscripción de clientes (varios planes).
  - `public/gym.html`, `crud*.html`, `dashboard-1.html`, etc. - Interfaces para administración/CRUD.
- `public/js/` - Lógica cliente (ej. `script.js`, `crud*.js`).
- `package.json` - Dependencias Node.

### Variables de entorno (.env)

Crear un archivo `.env` en la raíz con las siguientes variables (ejemplo):

DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=gymgestplus
PORT=3000
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=tu_contraseña_de_aplicación
MAIL_TO=correo_destino_para_notificaciones (opcional)

Notas:
- Si usas Gmail, crea una contraseña de aplicación y usa esa en `SMTP_PASS`.
- `MAIL_TO` se usa como receptor de notificaciones de inscripciones; si no se define, se usa `SMTP_USER`.

### Instalación y puesta en marcha (local)

1. Clonar el repositorio o copiar los archivos al servidor.
2. Abrir una terminal (PowerShell en Windows) en la carpeta del proyecto.
3. Instalar dependencias:

```powershell
npm install
```

4. Importar la base de datos en MySQL (opción CLI):

```powershell
# desde PowerShell (se pedirá contraseña de MySQL si aplica)
mysql -u root -p gymgestplus < .\gymgestplus.sql
```

O usar phpMyAdmin/XAMPP: importar `gymgestplus.sql` desde la interfaz de phpMyAdmin.

5. Crear `.env` con los valores descritos arriba.

6. Iniciar la aplicación:

```powershell
node app.js
# o (si quieres usar nodemon durante desarrollo)
# npx nodemon app.js
```

7. Abrir en el navegador:

http://localhost:3000

### Rutas y funcionalidades principales

Front-end (páginas) — desde `public/`:
- `index.html` - Login / Registro / Recuperar contraseña.
- `inscripcion.html` - Formulario público para inscribirse a distintos planes.
- `gym.html`, `dashboard-1.html`, `crud*.html` - paneles y CRUDs para gestores.

API (resumen de endpoints disponibles en `app.js`):

- POST `/api/login` — Iniciar sesión. Body: `{ usuario, password }`.
- POST `/api/registro` — Registrar nuevo entrenador. Body: `{ nombre, correo, usuario, password }`.
- POST `/api/entrenadores` — Crear entrenador (admin). Body: `{ agregarnombre, agregarcorreo, agregaruser, agregarpassword }`.
- GET `/api/entrenadores` — Listar entrenadores.
- GET `/api/entrenadores/:id_entrenador` — Obtener entrenador por id.
- PUT `/api/entrenadores/:id_entrenador` — Actualizar entrenador.
- DELETE `/api/entrenadores/:id_entrenador` — Eliminar entrenador.

CRUD Clientes (4 tablas según plan):
- Básico: `/api/clientebasico` (GET, POST, PUT `/api/clientebasico/:id`, DELETE `/api/clientebasico/:id`).
- Acompañamiento: `/api/clienteacom` (misma estructura CRUD).
- Semi personalizado: `/api/clientesemi` (CRUD).
- Personalizado: `/api/clienteperso` (CRUD).

Inscripciones públicas:
- POST `/api/inscripcion` — Recibe datos desde `inscripcion.html`. Body esperado: `{ plan, nombre, email, edad, sexo, salud, objetivos }`.
  - Inserta en la tabla correspondiente según el `plan`.
  - Envía notificación por correo (según `SMTP_*`).

Recuperación de contraseña:
- POST `/api/forgot` — Proporciona email; genera token y envía correo.
- POST `/api/reset/:token` — Restablece la contraseña usando el token.

Ruta de verificación/diagnóstico:
- GET `/api/test` — Verifica conexión con la base de datos.

### Uso básico (flujo de usuario)

1. Usuario: abrir `index.html` → Ingresar credenciales y hacer login.
2. Si no tiene cuenta: usar formulario de registro (redirige a `gym.html` tras registro en frontend).
3. Recuperar contraseña: ir a `forgot.html` (envía correo con enlace de reseteo).
4. Desde la página de inscripciones (`inscripcion.html`), cualquier persona puede enviar sus datos; la app los guarda y notifica al correo configurado.
5. Administrador: usar las páginas `crud*.html` para ver/editar/eliminar clientes por plan y gestionar entrenadores.

### Ejemplos de peticiones (curl)

Login:

```powershell
curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"usuario":"admin","password":"pass"}'
```

Crear cliente básico (ejemplo):

```powershell
curl -X POST http://localhost:3000/api/clientebasico -H "Content-Type: application/json" -d '{"name":"Juan", "email":"juan@ejemplo.com", "sexo":"M"}'
```

### Errores comunes y solución

- Error: "Error conectando a la base de datos" o `ECONNREFUSED`:
  - Verificar que MySQL está en ejecución.
  - Comprobar credenciales en `.env` (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`).
  - Asegurarse de haber importado `gymgestplus.sql` y que la base de datos existe.

- Error al enviar correo (SMTP):
  - Revisar `SMTP_USER` y `SMTP_PASS`.
  - Si usas Gmail, activa la contraseña de aplicación y usa esa como `SMTP_PASS`.
  - Comprobar conectividad saliente del servidor (puerto 587).

- Problemas en frontend (no responde al hacer fetch):
  - Revisar consola del navegador (F12).
  - Asegurarse de que el servidor Node está corriendo en el puerto configurado.

### Seguridad y recomendaciones

- No commits `.env` con credenciales reales; usa variables de entorno en el servidor.
- Proteger el acceso a las páginas administrativas (implementación actual no muestra autenticación por sesiones/JWT en frontend; revisar y añadir guardas si es necesario).
- Usar HTTPS en producción y restringir puertos y accesos a la base de datos.

### Mantenimiento y siguientes pasos sugeridos

- Añadir validación y manejo de sesiones en el frontend para proteger páginas administrativas.
- Añadir logs rotativos y mejor manejo de errores.
- Añadir tests automáticos para rutas críticas (login, registro, inscripciones).

---

Si quieres, puedo añadir capturas, un `README.md` corto, o exportar este manual a PDF.

Fin del manual.
