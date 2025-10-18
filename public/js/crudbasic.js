// Cargar clientes básicos
function cargaClientesBasicos() {
  fetch("/api/clientebasico")
    .then(res => res.json())
    .then(data => {
      const tabla = document.getElementById("tablaClientesBasicos");
      tabla.innerHTML = '';
      data.forEach(cliente => {
        tabla.innerHTML += `
          <tr>
            <td>${cliente.id}</td>
            <td>${cliente.name}</td>
            <td>${cliente.email}</td>
            <td>${cliente.edad}</td>
            <td>${cliente.sexo}</td>
            <td>${cliente.condicionesmedicas}</td>
            <td>${cliente.trainingob}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="editarClienteBasico(${cliente.id})">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="eliminarClienteBasico(${cliente.id})">Eliminar</button>
            </td>
          </tr>
        `;
      });
    });
}

// Agregar cliente básico
document.getElementById("formAgregarBasico").addEventListener("submit", async e => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const datos = {
    name: formData.get('nombreBasico'),
    email: formData.get('emailBasico'),
    edad: formData.get('edadBasico'),
    sexo: formData.get('sexoBasico'),
    condicionesmedicas: formData.get('condicionesBasico'),
    trainingob: formData.get('objetivosBasico')
  };

  // Validar campos obligatorios
  if (!datos.name || !datos.email || !datos.sexo) {
    alert("Nombre, email y sexo son obligatorios.");
    return;
  }

  fetch("/api/clientebasico", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  }).then(res => {
    if (res.ok) {
      form.reset();
      bootstrap.Modal.getInstance(document.getElementById("modalAgregarBasico")).hide();
      cargaClientesBasicos();
    } else {
      alert("Error al agregar cliente.");
    }
  });
});

// Editar cliente básico
function editarClienteBasico(id) {
  fetch(`/api/clientebasico/${id}`)
    .then(res => res.json())
    .then(cliente => {
      document.querySelector("#formEditarBasico input[name='idBasico']").value = cliente.id;
      document.querySelector("#formEditarBasico input[name='editNombreBasico']").value = cliente.name;
      document.querySelector("#formEditarBasico input[name='editEmailBasico']").value = cliente.email;
      document.querySelector("#formEditarBasico input[name='editEdadBasico']").value = cliente.edad;
      document.querySelector("#formEditarBasico select[name='editSexoBasico']").value = cliente.sexo;
      document.querySelector("#formEditarBasico textarea[name='editCondicionesBasico']").value = cliente.condicionesmedicas;
      document.querySelector("#formEditarBasico textarea[name='editObjetivosBasico']").value = cliente.trainingob;

      const modal = new bootstrap.Modal(document.getElementById("modalEditarBasico"));
      modal.show();
    });
}

document.getElementById("formEditarBasico").addEventListener("submit", e => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const id = formData.get('idBasico');
  const datos = {
    name: formData.get('editNombreBasico'),
    email: formData.get('editEmailBasico'),
    edad: formData.get('editEdadBasico'),
    sexo: formData.get('editSexoBasico'),
    condicionesmedicas: formData.get('editCondicionesBasico'),
    trainingob: formData.get('editObjetivosBasico')
  };

  fetch(`/api/clientebasico/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  }).then(res => {
    if (res.ok) {
      bootstrap.Modal.getInstance(document.getElementById("modalEditarBasico")).hide();
      cargaClientesBasicos();
    } else {
      alert("Error al actualizar cliente.");
    }
  });
});

// Eliminar cliente básico
function eliminarClienteBasico(id) {
  if (confirm("¿Eliminar este cliente básico?")) {
    fetch(`/api/clientebasico/${id}`, { method: "DELETE" })
      .then(() => cargaClientesBasicos());
  }
}

cargaClientesBasicos();