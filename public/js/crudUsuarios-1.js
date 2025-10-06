// Cargar usuarios
function cargausuarios() {
  fetch("/api/entrenadores")
    .then(res => res.json())
    .then(data => {
      const tabla = document.getElementById("tablausuarios");
      tabla.innerHTML = '';
      data.forEach(u => {
        tabla.innerHTML += `
          <tr>
            <td>${u.Nombre_Entrenador}</td>
            <td>${u.username}</td>
            <td>${u.Correo}</td>
            <td>${u.password}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="editarusuario(${u.id_entrenador})">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="eliminarusuario(${u.id_entrenador})">Eliminar</button>
            </td>
          </tr>
        `;
      });
    });
}

// Agregar usuario
document.getElementById("formagregar").addEventListener("submit", async e => {
  e.preventDefault(); // <-- evita que el formulario se envíe

  const form = e.target;
  const datos = Object.fromEntries(new FormData(form));

  // Validar que el campo no esté vacío
  if (!datos.agregaruser || datos.agregaruser.trim() === "") {
    alert("El nombre de usuario no puede estar vacío.");
    return; // <-- TERMINA la función aquí, no sigue al fetch
  }

  // Consultar usuarios para validar duplicado
  const usuarios = await fetch("/api/entrenadores").then(res => res.json());

  const yaExiste = usuarios.some(u => u.username === datos.agregaruser);

  if (yaExiste) {
    alert("Ese nombre de usuario ya está en uso. Elige otro.");
    return; // <-- TERMINA la función aquí, no sigue al fetch
  }

  // Si pasó todas las validaciones, continúa con la petición POST
  fetch("/api/entrenadores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  }).then(() => {
    form.reset();
    bootstrap.Modal.getInstance(document.getElementById("modalagregar")).hide();
    cargausuarios();
  });
});


// Editar usuario
function editarusuario(id_entrenador) {
  fetch(`/api/entrenadores/${id_entrenador}`)
    .then(res => res.json())
    .then(usuario => {
      document.getElementById("editarnombrecompleto").value = usuario.Nombre_Entrenador;
      document.getElementById("editaruser").value = usuario.username;
      document.getElementById("editarcorreo").value = usuario.Correo;
      document.getElementById("editarpassword").value = '';
      document.getElementById("editarid").value = id_entrenador;


      
      const modal = new bootstrap.Modal(document.getElementById("modaleditar"));
      modal.show();
    });
}

document.getElementById("formeditar").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const datos = Object.fromEntries(new FormData(form));
  const id_entrenador = datos.id_entrenador;

  // Validar que el campo no esté vacío
  if (!datos.editaruser || datos.editaruser.trim() === "") {
    alert("El nombre de usuario no puede estar vacío.");
    return; // <-- TERMINA la función aquí, no sigue al fetch
  }

  // Consultar usuarios para validar duplicado
  const usuarios = await fetch("/api/entrenadores").then(res => res.json());

  const yaExiste = usuarios.some(u => u.username === datos.agregaruser);

  if (yaExiste) {
    alert("Ese nombre de usuario ya está en uso. Elige otro.");
    return; // <-- TERMINA la función aquí, no sigue al fetch
  }


  // Si el password está vacío, eliminarlo para no enviarlo
  if (!datos.editarpassword || datos.editarpassword.trim() === "") {
    delete datos.editarpassword;
  }

  // Enviar la solicitud al backend
  fetch(`/api/entrenadores/${id_entrenador}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  }).then(res => {
    if (!res.ok) {
      alert("Hubo un problema al actualizar.");
      return;
    }

    bootstrap.Modal.getInstance(document.getElementById("modaleditar")).hide();
    cargausuarios();
  });
});


// Eliminar usuario
function eliminarusuario(id_entrenador) {
  if (confirm("¿Eliminar este usuario?")) {
    fetch(`/api/entrenadores/${id_entrenador}`, { method: "DELETE" })
      .then(() => cargausuarios());
  }
}

cargausuarios();