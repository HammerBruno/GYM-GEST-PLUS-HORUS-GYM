
// Cambiar visibilidad de formularios
function mostrarRegistro() {
  document.getElementById("login-form").classList.add("oculto");
  document.getElementById("registro-form").classList.remove("oculto");
  document.getElementById("recuperar-form").classList.add("oculto");
}

function mostrarLogin() {
  document.getElementById("login-form").classList.remove("oculto");
  document.getElementById("registro-form").classList.add("oculto");
  document.getElementById("recuperar-form").classList.add("oculto");
}

function mostrarRecuperar() {
  document.getElementById("login-form").classList.add("oculto");
  document.getElementById("registro-form").classList.add("oculto");
  document.getElementById("recuperar-form").classList.remove("oculto");
}

function togglePassword(id, element) {
  const input = document.getElementById(id);
  if (input.type === "password") {
    input.type = "text";
    element.textContent = "Ocultar contraseña";
  } else {
    input.type = "password";
    element.textContent = "Mostrar contraseña";
  }
}

// Login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("login-msg");

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password }),
    });

    const data = await res.json();
    msg.textContent = data.message;

 if (res.ok) {
      // Registro correcto → redirigir al gym
      setTimeout(() => {
        window.location.href = "gym.html"; // cambiar
      }, 1500);
    }
  } catch (err) {
    console.error("Error en registro:", err);
    msg.textContent = "Contraseña o usuarios incorrectos";
  }
});

// Registro
document.getElementById("registro-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("email").value;
  const usuario = document.getElementById("user").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("registro-msg");

  try {
    const res = await fetch("/api/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, correo, usuario, password }),
    });

    const data = await res.json();
    msg.textContent = data.message;

    if (res.ok) {
      // Registro correcto → redirigir al gym
      setTimeout(() => {
        window.location.href = "gym.html"; // cambiar
      }, 1500);
    }
  } catch (err) {
    console.error("Error en registro:", err);
    msg.textContent = "Error en conexión";
  }
});
