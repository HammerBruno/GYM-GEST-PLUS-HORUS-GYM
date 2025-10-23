// Función para calcular IMC
function calcularIMC(peso, altura) {
    if (!peso || !altura || altura === 0) return '-';
    const alturaMetros = altura / 100;
    return (peso / (alturaMetros * alturaMetros)).toFixed(1);
}

// Cargar clientes semi personalizado
function cargaClientesSemi() {
  console.log('Cargando clientes semi...'); // Para debug
  fetch("/api/clientesemi")
    .then(res => {
      if (!res.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      return res.json();
    })
    .then(data => {
      console.log('Datos recibidos:', data); // Para debug
      const tabla = document.getElementById("tablaClientesSemi");
      if (!tabla) {
        console.error('No se encontró la tabla con id "tablaClientesSemi"');
        return;
      }
      
      tabla.innerHTML = '';
      
      if (data.length === 0) {
        tabla.innerHTML = '<tr><td colspan="15" class="text-center">No hay clientes registrados</td></tr>';
        return;
      }
      
      data.forEach(cliente => {
        const imc = calcularIMC(cliente.peso, cliente.altura);
        const row = `
          <tr>
            <td>${cliente.id}</td>
            <td>${cliente.name || '-'}</td>
            <td>${cliente.email || '-'}</td>
            <td>${cliente.edad || '-'}</td>
            <td>${cliente.sexo || '-'}</td>
            <td>${cliente.peso || '-'}</td>
            <td>${cliente.altura || '-'}</td>
            <td>${imc}</td>
            <td>${cliente.condicionesmedicas || '-'}</td>
            <td>${cliente.trainingob || '-'}</td>
            <td>${cliente.antropometrics || '-'}</td>
            <td>${cliente.trainingplan || '-'}</td>
            <td>${cliente.eatplan || '-'}</td>
            <td>${cliente.assignedcoach || '-'}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="editarClienteSemi(${cliente.id})">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="eliminarClienteSemi(${cliente.id})">Eliminar</button>
            </td>
          </tr>
        `;
        tabla.innerHTML += row;
      });
    })
    .catch(error => {
      console.error('Error cargando clientes semi personalizado:', error);
      const tabla = document.getElementById("tablaClientesSemi");
      if (tabla) {
        tabla.innerHTML = '<tr><td colspan="15" class="text-center text-danger">Error al cargar los datos</td></tr>';
      }
    });
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

  console.log('Enviando datos:', datos); // Para debug

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

    const result = await response.json();
    console.log('Respuesta del servidor:', result); // Para debug

    if (response.ok) {
      form.reset();
      // Cerrar el modal correctamente
      const modalElement = document.getElementById('modalAgregarSemi');
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
      // Recargar la tabla
      cargaClientesSemi();
      alert("Cliente semi personalizado agregado correctamente");
    } else {
      alert("Error al agregar cliente semi personalizado: " + (result.message || 'Error desconocido'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert("Error de conexión");
  }
});

// Editar cliente semi personalizado
function editarClienteSemi(id) {
  fetch(`/api/clientesemi/${id}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Error al obtener cliente');
      }
      return res.json();
    })
    .then(cliente => {
      document.getElementById("idSemi").value = cliente.id;
      document.getElementById("editNombreSemi").value = cliente.name || '';
      document.getElementById("editEmailSemi").value = cliente.email || '';
      document.getElementById("editEdadSemi").value = cliente.edad || '';
      document.getElementById("editSexoSemi").value = cliente.sexo || '';
      document.getElementById("editPesoSemi").value = cliente.peso || '';
      document.getElementById("editAlturaSemi").value = cliente.altura || '';
      document.getElementById("editCondicionesSemi").value = cliente.condicionesmedicas || '';
      document.getElementById("editObjetivosSemi").value = cliente.trainingob || '';
      document.getElementById("editFichaSemi").value = cliente.antropometrics || '';
      document.getElementById("editPlanEntrenamientoSemi").value = cliente.trainingplan || '';
      document.getElementById("editPlanNutricionSemi").value = cliente.eatplan || '';
      document.getElementById("editEntrenadorSemi").value = cliente.assignedcoach || '';

      const modal = new bootstrap.Modal(document.getElementById("modalEditarSemi"));
      modal.show();
    })
    .catch(error => {
      console.error('Error cargando cliente:', error);
      alert('Error al cargar el cliente');
    });
}

// Actualizar cliente semi personalizado
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

    const result = await response.json();

    if (response.ok) {
      const modalElement = document.getElementById('modalEditarSemi');
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
      cargaClientesSemi();
      alert("Cliente semi personalizado actualizado correctamente");
    } else {
      alert("Error al actualizar cliente semi personalizado: " + (result.message || 'Error desconocido'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert("Error de conexión");
  }
});

// Eliminar cliente semi personalizado
function eliminarClienteSemi(id) {
  if (confirm("¿Estás seguro de eliminar este cliente semi personalizado?")) {
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

// Cargar clientes cuando la página se carga
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM cargado, iniciando carga de clientes...');
  cargaClientesSemi();
});

// También cargar cuando la ventana se carga por si el DOM ya está listo
window.addEventListener('load', function() {
  console.log('Ventana cargada, verificando carga de clientes...');
  // Pequeño delay para asegurar que todo esté listo
  setTimeout(cargaClientesSemi, 100);
});