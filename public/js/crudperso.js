// Función para calcular IMC
function calcularIMC(peso, altura) {
    if (!peso || !altura || altura === 0) return '-';
    const alturaMetros = altura / 100;
    return (peso / (alturaMetros * alturaMetros)).toFixed(1);
}

// Cargar clientes personalizado
function cargaClientesPerso() {
  fetch("/api/clienteperso")
    .then(res => res.json())
    .then(data => {
      const tabla = document.getElementById("tablaClientesPerso");
      tabla.innerHTML = '';
      data.forEach(cliente => {
        const imc = calcularIMC(cliente.peso, cliente.altura);
        tabla.innerHTML += `
          <tr>
            <td>${cliente.id}</td>
            <td>${cliente.name}</td>
            <td>${cliente.email}</td>
            <td>${cliente.edad || '-'}</td>
            <td>${cliente.sexo}</td>
            <td>${cliente.peso || '-'}</td>
            <td>${cliente.altura || '-'}</td>
            <td>${imc}</td>
            <td>${cliente.condicionesmedicas || ''}</td>
            <td>${cliente.trainingob || ''}</td>
            <td>${cliente.antropometrics || ''}</td>
            <td>${cliente.trainingplan || ''}</td>
            <td>${cliente.eatplan || ''}</td>
            <td>${cliente.drugplan || ''}</td>
            <td>${cliente.assignedcoach || ''}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="editarClientePerso(${cliente.id})">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="eliminarClientePerso(${cliente.id})">Eliminar</button>
            </td>
          </tr>
        `;
      });
    })
    .catch(error => console.error('Error cargando clientes personalizado:', error));
}

// Agregar cliente personalizado
document.getElementById("formAgregarPerso").addEventListener("submit", async e => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const datos = {
    name: formData.get('nombrePerso'),
    email: formData.get('emailPerso'),
    edad: formData.get('edadPerso'),
    sexo: formData.get('sexoPerso'),
    peso: formData.get('pesoPerso'),
    altura: formData.get('alturaPerso'),
    condicionesmedicas: formData.get('condicionesPerso'),
    trainingob: formData.get('objetivosPerso'),
    antropometrics: formData.get('fichaPerso'),
    trainingplan: formData.get('planEntrenamientoPerso'),
    eatplan: formData.get('planNutricionPerso'),
    drugplan: formData.get('planFarmacologiaPerso'),
    assignedcoach: formData.get('entrenadorPerso')
  };

  // Validar campos obligatorios
  if (!datos.name || !datos.email || !datos.sexo) {
    alert("Nombre, email y sexo son obligatorios.");
    return;
  }

  try {
    const response = await fetch("/api/clienteperso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    if (response.ok) {
      form.reset();
      bootstrap.Modal.getInstance(document.getElementById("modalAgregarPerso")).hide();
      cargaClientesPerso();
      alert("Cliente personalizado agregado correctamente");
    } else {
      alert("Error al agregar cliente personalizado");
    }
  } catch (error) {
    console.error('Error:', error);
    alert("Error de conexión");
  }
});

// Editar cliente personalizado
function editarClientePerso(id) {
  fetch(`/api/clienteperso/${id}`)
    .then(res => res.json())
    .then(cliente => {
      document.querySelector("#formEditarPerso input[name='idPerso']").value = cliente.id;
      document.querySelector("#formEditarPerso input[name='editNombrePerso']").value = cliente.name;
      document.querySelector("#formEditarPerso input[name='editEmailPerso']").value = cliente.email;
      document.querySelector("#formEditarPerso input[name='editEdadPerso']").value = cliente.edad || '';
      document.querySelector("#formEditarPerso select[name='editSexoPerso']").value = cliente.sexo;
      document.querySelector("#formEditarPerso input[name='editPesoPerso']").value = cliente.peso || '';
      document.querySelector("#formEditarPerso input[name='editAlturaPerso']").value = cliente.altura || '';
      document.querySelector("#formEditarPerso textarea[name='editCondicionesPerso']").value = cliente.condicionesmedicas || '';
      document.querySelector("#formEditarPerso textarea[name='editObjetivosPerso']").value = cliente.trainingob || '';
      document.querySelector("#formEditarPerso textarea[name='editFichaPerso']").value = cliente.antropometrics || '';
      document.querySelector("#formEditarPerso textarea[name='editPlanEntrenamientoPerso']").value = cliente.trainingplan || '';
      document.querySelector("#formEditarPerso textarea[name='editPlanNutricionPerso']").value = cliente.eatplan || '';
      document.querySelector("#formEditarPerso textarea[name='editPlanFarmacologiaPerso']").value = cliente.drugplan || '';
      document.querySelector("#formEditarPerso input[name='editEntrenadorPerso']").value = cliente.assignedcoach || '';

      const modal = new bootstrap.Modal(document.getElementById("modalEditarPerso"));
      modal.show();
    })
    .catch(error => console.error('Error cargando cliente:', error));
}

document.getElementById("formEditarPerso").addEventListener("submit", async e => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const id = formData.get('idPerso');
  
  const datos = {
    name: formData.get('editNombrePerso'),
    email: formData.get('editEmailPerso'),
    edad: formData.get('editEdadPerso'),
    sexo: formData.get('editSexoPerso'),
    peso: formData.get('editPesoPerso'),
    altura: formData.get('editAlturaPerso'),
    condicionesmedicas: formData.get('editCondicionesPerso'),
    trainingob: formData.get('editObjetivosPerso'),
    antropometrics: formData.get('editFichaPerso'),
    trainingplan: formData.get('editPlanEntrenamientoPerso'),
    eatplan: formData.get('editPlanNutricionPerso'),
    drugplan: formData.get('editPlanFarmacologiaPerso'),
    assignedcoach: formData.get('editEntrenadorPerso')
  };

  // Validar campos obligatorios
  if (!datos.name || !datos.email || !datos.sexo) {
    alert("Nombre, email y sexo son obligatorios.");
    return;
  }

  try {
    const response = await fetch(`/api/clienteperso/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    if (response.ok) {
      bootstrap.Modal.getInstance(document.getElementById("modalEditarPerso")).hide();
      cargaClientesPerso();
      alert("Cliente personalizado actualizado correctamente");
    } else {
      alert("Error al actualizar cliente personalizado");
    }
  } catch (error) {
    console.error('Error:', error);
    alert("Error de conexión");
  }
});

// Eliminar cliente personalizado
function eliminarClientePerso(id) {
  if (confirm("¿Eliminar este cliente personalizado?")) {
    fetch(`/api/clienteperso/${id}`, { method: "DELETE" })
      .then(res => {
        if (res.ok) {
          cargaClientesPerso();
          alert("Cliente personalizado eliminado correctamente");
        } else {
          alert("Error al eliminar cliente personalizado");
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert("Error de conexión");
      });
  }
}

cargaClientesPerso();