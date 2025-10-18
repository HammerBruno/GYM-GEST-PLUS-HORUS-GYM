// Cargar clientes acompañamiento
function cargaClientesAcom() {
  fetch("/api/clienteacom")
    .then(res => res.json())
    .then(data => {
      const tabla = document.getElementById("tablaClientesAcom");
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
            <td>${cliente.antropometrics}</td>
            <td>${cliente.trainingplan}</td>
            <td>${cliente.assignedcoach}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="editarClienteAcom(${cliente.id})">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="eliminarClienteAcom(${cliente.id})">Eliminar</button>
            </td>
          </tr>
        `;
      });
    });
}

// Agregar cliente acompañamiento
document.getElementById("formAgregarAcom").addEventListener("submit", async e => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const datos = {
    name: formData.get('nombreAcom'),
    email: formData.get('emailAcom'),
    edad: formData.get('edadAcom'),
    sexo: formData.get('sexoAcom'),
    condicionesmedicas: formData.get('condicionesAcom'),
    trainingob: formData.get('objetivosAcom'),
    antropometrics: formData.get('fichaAcom'),
    trainingplan: formData.get('planEntrenamientoAcom'),
    assignedcoach: formData.get('entrenadorAcom')
  };

  // Validar campos obligatorios
  if (!datos.name || !datos.email || !datos.sexo) {
    alert("Nombre, email y sexo son obligatorios.");
    return;
  }

  fetch("/api/clienteacom", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  }).then(res => {
    if (res.ok) {
      form.reset();
      bootstrap.Modal.getInstance(document.getElementById("modalAgregarAcom")).hide();
      cargaClientesAcom();
    } else {
      alert("Error al agregar cliente.");
    }
  });
});

// Editar cliente acompañamiento
function editarClienteAcom(id) {
  fetch(`/api/clienteacom/${id}`)
    .then(res => res.json())
    .then(cliente => {
      document.querySelector("#formEditarAcom input[name='idAcom']").value = cliente.id;
      document.querySelector("#formEditarAcom input[name='editNombreAcom']").value = cliente.name;
      document.querySelector("#formEditarAcom input[name='editEmailAcom']").value = cliente.email;
      document.querySelector("#formEditarAcom input[name='editEdadAcom']").value = cliente.edad;
      document.querySelector("#formEditarAcom select[name='editSexoAcom']").value = cliente.sexo;
      document.querySelector("#formEditarAcom textarea[name='editCondicionesAcom']").value = cliente.condicionesmedicas;
      document.querySelector("#formEditarAcom textarea[name='editObjetivosAcom']").value = cliente.trainingob;
      document.querySelector("#formEditarAcom textarea[name='editFichaAcom']").value = cliente.antropometrics;
      document.querySelector("#formEditarAcom textarea[name='editPlanEntrenamientoAcom']").value = cliente.trainingplan;
      document.querySelector("#formEditarAcom input[name='editEntrenadorAcom']").value = cliente.assignedcoach;

      const modal = new bootstrap.Modal(document.getElementById("modalEditarAcom"));
      modal.show();
    });
}

document.getElementById("formEditarAcom").addEventListener("submit", e => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const id = formData.get('idAcom');
  const datos = {
    name: formData.get('editNombreAcom'),
    email: formData.get('editEmailAcom'),
    edad: formData.get('editEdadAcom'),
    sexo: formData.get('editSexoAcom'),
    condicionesmedicas: formData.get('editCondicionesAcom'),
    trainingob: formData.get('editObjetivosAcom'),
    antropometrics: formData.get('editFichaAcom'),
    trainingplan: formData.get('editPlanEntrenamientoAcom'),
    assignedcoach: formData.get('editEntrenadorAcom')
  };

  fetch(`/api/clienteacom/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  }).then(res => {
    if (res.ok) {
      bootstrap.Modal.getInstance(document.getElementById("modalEditarAcom")).hide();
      cargaClientesAcom();
    } else {
      alert("Error al actualizar cliente.");
    }
  });
});

// Eliminar cliente acompañamiento
function eliminarClienteAcom(id) {
  if (confirm("¿Eliminar este cliente de acompañamiento?")) {
    fetch(`/api/clienteacom/${id}`, { method: "DELETE" })
      .then(() => cargaClientesAcom());
  }
}

cargaClientesAcom();