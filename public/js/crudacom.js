// Función para calcular IMC
function calcularIMC(peso, altura) {
    if (!peso || !altura || altura === 0) return '-';
    const alturaMetros = altura / 100;
    return (peso / (alturaMetros * alturaMetros)).toFixed(1);
}

// Cargar clientes semi personalizado
function cargaClientesSemi() {
  fetch("/api/clientesemi")
    .then(res => res.json())
    .then(data => {
      const tabla = document.getElementById("tablaClientesSemi");
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
            <td>${cliente.assignedcoach || ''}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="editarClienteSemi(${cliente.id})">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="eliminarClienteSemi(${cliente.id})">Eliminar</button>
            </td>
          </tr>
        `;
      });
    })
    .catch(error => console.error('Error cargando clientes semi personalizado:', error));
}

// Agregar cliente semi personalizado
document.getElementById("formAgregarSemi").addEventListener("submit", async e => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const datos = {
    name: formData.get('nombreSemi'),
    email: formData.get('emailSemi'),
    edad: formData.get('edadSemi'),
    sexo: formData.get('sexoSemi'),
    peso: formData.get('pesoSemi'),
    altura: formData.get('alturaSemi'),
    condicionesmedicas: formData.get('condicionesSemi'),
    trainingob: formData.get('objetivosSemi'),
    antropometrics: formData.get('fichaSemi'),
    trainingplan: formData.get('planEntrenamientoSemi'),
    eatplan: formData.get('planNutricionSemi'),
    assignedcoach: formData.get('entrenadorSemi')
  };

  // Validar campos obligatorios
  if (!datos.name || !datos.email || !datos.sexo) {
    alert("Nombre, email y sexo son obligatorios.");
    return;
  }

  try {
    const response = await fetch("/api/clientesemi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    if (response.ok) {
      form.reset();
      bootstrap.Modal.getInstance(document.getElementById("modalAgregarSemi")).hide();
      cargaClientesSemi();
      alert("Cliente semi personalizado agregado correctamente");
    } else {
      alert("Error al agregar cliente semi personalizado");
    }
  } catch (error) {
    console.error('Error:', error);
    alert("Error de conexión");
  }
});

// Editar cliente semi personalizado
function editarClienteSemi(id) {
  fetch(`/api/clientesemi/${id}`)
    .then(res => res.json())
    .then(cliente => {
      document.querySelector("#formEditarSemi input[name='idSemi']").value = cliente.id;
      document.querySelector("#formEditarSemi input[name='editNombreSemi']").value = cliente.name;
      document.querySelector("#formEditarSemi input[name='editEmailSemi']").value = cliente.email;
      document.querySelector("#formEditarSemi input[name='editEdadSemi']").value = cliente.edad || '';
      document.querySelector("#formEditarSemi select[name='editSexoSemi']").value = cliente.sexo;
      document.querySelector("#formEditarSemi input[name='editPesoSemi']").value = cliente.peso || '';
      document.querySelector("#formEditarSemi input[name='editAlturaSemi']").value = cliente.altura || '';
      document.querySelector("#formEditarSemi textarea[name='editCondicionesSemi']").value = cliente.condicionesmedicas || '';
      document.querySelector("#formEditarSemi textarea[name='editObjetivosSemi']").value = cliente.trainingob || '';
      document.querySelector("#formEditarSemi textarea[name='editFichaSemi']").value = cliente.antropometrics || '';
      document.querySelector("#formEditarSemi textarea[name='editPlanEntrenamientoSemi']").value = cliente.trainingplan || '';
      document.querySelector("#formEditarSemi textarea[name='editPlanNutricionSemi']").value = cliente.eatplan || '';
      document.querySelector("#formEditarSemi input[name='editEntrenadorSemi']").value = cliente.assignedcoach || '';

      const modal = new bootstrap.Modal(document.getElementById("modalEditarSemi"));
      modal.show();
    })
    .catch(error => console.error('Error cargando cliente:', error));
}

document.getElementById("formEditarSemi").addEventListener("submit", async e => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const id = formData.get('idSemi');
  
  const datos = {
    name: formData.get('editNombreSemi'),
    email: formData.get('editEmailSemi'),
    edad: formData.get('editEdadSemi'),
    sexo: formData.get('editSexoSemi'),
    peso: formData.get('editPesoSemi'),
    altura: formData.get('editAlturaSemi'),
    condicionesmedicas: formData.get('editCondicionesSemi'),
    trainingob: formData.get('editObjetivosSemi'),
    antropometrics: formData.get('editFichaSemi'),
    trainingplan: formData.get('editPlanEntrenamientoSemi'),
    eatplan: formData.get('editPlanNutricionSemi'),
    assignedcoach: formData.get('editEntrenadorSemi')
  };

  // Validar campos obligatorios
  if (!datos.name || !datos.email || !datos.sexo) {
    alert("Nombre, email y sexo son obligatorios.");
    return;
  }

  try {
    const response = await fetch(`/api/clientesemi/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    if (response.ok) {
      bootstrap.Modal.getInstance(document.getElementById("modalEditarSemi")).hide();
      cargaClientesSemi();
      alert("Cliente semi personalizado actualizado correctamente");
    } else {
      alert("Error al actualizar cliente semi personalizado");
    }
  } catch (error) {
    console.error('Error:', error);
    alert("Error de conexión");
  }
});

// Eliminar cliente semi personalizado
function eliminarClienteSemi(id) {
  if (confirm("¿Eliminar este cliente semi personalizado?")) {
    fetch(`/api/clientesemi/${id}`, { method: "DELETE" })
      .then(res => {
        if (res.ok) {
          cargaClientesSemi();
          alert("Cliente semi personalizado eliminado correctamente");
        } else {
          alert("Error al eliminar cliente semi personalizado");
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert("Error de conexión");
      });
  }
}

cargaClientesSemi();