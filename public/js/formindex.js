// public/js/formindex.js

let planSeleccionado = '';

// Función para mostrar el formulario
function mostrarFormulario(plan) {
    planSeleccionado = plan;
    document.getElementById('nombre-plan').textContent = plan;
    document.getElementById('formulario-inscripcion').style.display = 'block';
}

// Función para cerrar el formulario
function cerrarFormulario() {
    document.getElementById('formulario-inscripcion').style.display = 'none';
    document.getElementById('inscripcionForm').reset();
    planSeleccionado = '';
}

// Función para enviar el formulario al servidor
async function enviarFormulario() {
    const form = document.getElementById('inscripcionForm');
    
    // Validaciones básicas
    if (!planSeleccionado) {
        alert('Error: No se ha seleccionado un plan');
        return;
    }

    // Obtener valores del formulario
    const datos = {
        plan: planSeleccionado,
        nombre: form.nombre.value.trim(),
        email: form.email.value.trim(),
        edad: form.edad.value ? parseInt(form.edad.value) : null,
        sexo: form.sexo.value, // ← ESTA LÍNEA CAPTURA EL SEXO
        salud: form.salud.value.trim(),
        objetivos: form.objetivos.value.trim()
    };

    // Validar campos requeridos
    if (!datos.nombre || !datos.email || !datos.sexo) {
        alert('Por favor completa todos los campos requeridos: Nombre, Email y Sexo');
        return;
    }

    // Validar que el sexo sea válido
    if (datos.sexo !== 'Masculino' && datos.sexo !== 'Femenino') {
        alert('Por favor selecciona un sexo válido');
        return;
    }

    // Mostrar loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/inscripcion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos)
        });

        const resultado = await response.json();

        if (resultado.success) {
            alert('¡Inscripción enviada correctamente! Te contactaremos pronto.');
            cerrarFormulario();
        } else {
            alert('Error: ' + (resultado.error || 'No se pudo enviar la inscripción'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión. Intenta nuevamente.');
    } finally {
        // Restaurar botón
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('inscripcionForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            enviarFormulario();
        });
    }

    console.log('Formulario de inscripción inicializado');
});