// Función para calcular IMC
function calcularIMC(peso, altura) {
    if (!peso || !altura || altura === 0) return '-';
    const alturaMetros = altura / 100;
    return (peso / (alturaMetros * alturaMetros)).toFixed(1);
}

// Cargar clientes personalizado
function cargaClientesPerso() {
    console.log('🔍 Cargando clientes personalizado...');
    fetch("/api/clienteperso")
        .then(res => {
            if (!res.ok) {
                throw new Error(`Error HTTP: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            console.log('✅ Datos recibidos:', data);
            const tabla = document.getElementById("tablaClientesPerso");
            
            if (!tabla) {
                console.error('❌ No se encontró la tabla con id "tablaClientesPerso"');
                return;
            }
            
            tabla.innerHTML = '';
            
            if (data.length === 0) {
                tabla.innerHTML = '<tr><td colspan="16" class="text-center">No hay clientes registrados</td></tr>';
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
                        <td>${cliente.drugplan || '-'}</td>
                        <td>${cliente.assignedcoach || '-'}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editarClientePerso(${cliente.id})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarClientePerso(${cliente.id})">Eliminar</button>
                        </td>
                    </tr>
                `;
                tabla.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('❌ Error cargando clientes personalizado:', error);
            const tabla = document.getElementById("tablaClientesPerso");
            if (tabla) {
                tabla.innerHTML = '<tr><td colspan="16" class="text-center text-danger">Error al cargar los datos</td></tr>';
            }
        });
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

    console.log('📤 Enviando datos:', datos);

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

        const result = await response.json();
        console.log('📥 Respuesta del servidor:', result);

        if (response.ok) {
            form.reset();
            // Cerrar modal correctamente
            const modal = bootstrap.Modal.getInstance(document.getElementById("modalAgregarPerso"));
            if (modal) {
                modal.hide();
            }
            // Recargar tabla
            cargaClientesPerso();
            alert("✅ Cliente personalizado agregado correctamente");
        } else {
            alert("❌ Error al agregar cliente personalizado: " + (result.message || 'Error desconocido'));
        }
    } catch (error) {
        console.error('❌ Error:', error);
        alert("❌ Error de conexión");
    }
});

// Editar cliente personalizado
function editarClientePerso(id) {
    console.log(`✏️ Editando cliente ID: ${id}`);
    fetch(`/api/clienteperso/${id}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Error HTTP: ${res.status}`);
            }
            return res.json();
        })
        .then(cliente => {
            console.log('📋 Datos del cliente para editar:', cliente);
            document.getElementById("idPerso").value = cliente.id;
            document.getElementById("editNombrePerso").value = cliente.name || '';
            document.getElementById("editEmailPerso").value = cliente.email || '';
            document.getElementById("editEdadPerso").value = cliente.edad || '';
            document.getElementById("editSexoPerso").value = cliente.sexo || '';
            document.getElementById("editPesoPerso").value = cliente.peso || '';
            document.getElementById("editAlturaPerso").value = cliente.altura || '';
            document.getElementById("editCondicionesPerso").value = cliente.condicionesmedicas || '';
            document.getElementById("editObjetivosPerso").value = cliente.trainingob || '';
            document.getElementById("editFichaPerso").value = cliente.antropometrics || '';
            document.getElementById("editPlanEntrenamientoPerso").value = cliente.trainingplan || '';
            document.getElementById("editPlanNutricionPerso").value = cliente.eatplan || '';
            document.getElementById("editPlanFarmacologiaPerso").value = cliente.drugplan || '';
            document.getElementById("editEntrenadorPerso").value = cliente.assignedcoach || '';

            const modal = new bootstrap.Modal(document.getElementById("modalEditarPerso"));
            modal.show();
        })
        .catch(error => {
            console.error('❌ Error cargando cliente:', error);
            alert('❌ Error al cargar el cliente');
        });
}

// Actualizar cliente personalizado
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

    console.log('🔄 Actualizando cliente ID:', id, 'Datos:', datos);

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

        const result = await response.json();
        console.log('📥 Respuesta de actualización:', result);

        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById("modalEditarPerso"));
            if (modal) {
                modal.hide();
            }
            cargaClientesPerso();
            alert("✅ Cliente personalizado actualizado correctamente");
        } else {
            alert("❌ Error al actualizar cliente personalizado: " + (result.message || 'Error desconocido'));
        }
    } catch (error) {
        console.error('❌ Error:', error);
        alert("❌ Error de conexión");
    }
});

// Eliminar cliente personalizado
function eliminarClientePerso(id) {
    if (confirm("¿Estás seguro de eliminar este cliente personalizado?")) {
        console.log(`🗑️ Eliminando cliente ID: ${id}`);
        fetch(`/api/clienteperso/${id}`, { method: "DELETE" })
            .then(res => {
                if (res.ok) {
                    cargaClientesPerso();
                    alert("✅ Cliente personalizado eliminado correctamente");
                } else {
                    alert("❌ Error al eliminar cliente personalizado");
                }
            })
            .catch(error => {
                console.error('❌ Error:', error);
                alert("❌ Error de conexión");
            });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM cargado, iniciando CRUD personalizado...');
    cargaClientesPerso();
});

// También cargar cuando la ventana se carga
window.addEventListener('load', function() {
    console.log('🔄 Ventana cargada, verificando carga de clientes...');
    setTimeout(cargaClientesPerso, 100);
});