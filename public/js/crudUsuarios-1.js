// Cargar usuarios
function cargausuarios() {
  fetch("/api/usuarios")
    .then(res => res.json())
    .then(data => {
      const tabla = document.getElementById("tablausuarios");
      tabla.innerHTML = '';
      data.forEach(u => {
        tabla.innerHTML += `
          <tr>
            <td>${u.nombre}</td>
            <td>${u.usuario}</td>
            <td>${u.correo}</td>
            <td>${u.password}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="editarusuario(${u.id})">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="eliminarusuario(${u.id})">Eliminar</button>
            </td>
          </tr>
        `;
      });
    });
}

// Agregar usuario
document.getElementById("formagregar").addEventListener("submit", e => {
  e.preventDefault();
  const form = e.target;
  const datos = Object.fromEntries(new FormData(form));
  fetch("/api/usuarios", {
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
function editarusuario(id) {
  fetch(`/api/usuarios/${id}`)
    .then(res => res.json())
    .then(usuario => {
      document.getElementById("editarnombrecompleto").value = usuario.nombre;
      document.getElementById("editaruser").value = usuario.user;
      document.getElementById("editarcorreo").value = usuario.correo;
      document.getElementById("editarpassword").value = '';

      const modal = new bootstrap.Modal(document.getElementById("modaleditar"));
      modal.show();
    });
}

document.getElementById("formeditar").addEventListener("submit", e => {
  e.preventDefault();
  const form = e.target;
  const datos = Object.fromEntries(new FormData(form));
  const id = datos.id;

  fetch(`/api/usuarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  }).then(() => {
    bootstrap.Modal.getInstance(document.getElementById("modaleditar")).hide();
    cargausuarios();
  });
});

// Eliminar usuario
function eliminarusuario(id) {
  if (confirm("¿Eliminar este usuario?")) {
    fetch(`/api/usuarios/${id}`, { method: "DELETE" })
      .then(() => cargausuarios());
  }
}