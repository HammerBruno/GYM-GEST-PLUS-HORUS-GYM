// Public: public/js/script.js
// Requisitos: este script asume que tu formulario tiene id="inscripcionForm"
// y que el nombre del plan se coloca en el span con id="nombre-plan"

const form = document.getElementById('inscripcionForm');
const planSpan = document.getElementById('nombre-plan');

function mapPlanToTable(plan) {
  const p = plan?.toLowerCase?.().trim() || '';
  if (p.includes('básico') || p.includes('basico') || p === 'básico' || p === 'basico' || p === 'basic') return 'clientebasico';
  if (p.includes('acompañamiento') || p.includes('acompanamiento') || p === 'acompañamiento' || p === 'acompanamiento' || p === 'acom') return 'clienteacom';
  if (p.includes('semi') || p.includes('semi personalizado') || p.includes('semi personalizado')) return 'clientesemi';
  if (p.includes('personalizado') || p.includes('personalizado') || p === 'personalizado' || p === 'perso') return 'clienteperso';
  return 'clientebasico';
}

async function postSignup(payload) {
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = form.nombre.value.trim();
  const email = form.email.value.trim();
  const edad = parseInt(form.edad.value, 10) || null;
  const sexo = form.sexo.value;
  const salud = form.salud.value.trim();
  const objetivos = form.objetivos.value.trim();
  const plan = planSpan.textContent.trim();

  // Validaciones básicas
  if (!nombre || !email || !sexo || !plan) {
    alert('Por favor completa los campos requeridos.');
    return;
  }

  const table = mapPlanToTable(plan);

  const payload = {
    table,
    name: nombre,
    email,
    edad,
    sexo,
    condicionesmedicas: salud,
    trainingob: objetivos,
    planName: plan
  };

  try {
    const res = await postSignup(payload);
    const json = await res.json();
    if (res.ok && json.ok) {
      alert('Inscripción enviada correctamente. Gracias.');
      form.reset();
      document.getElementById('formulario-inscripcion').style.display = 'none';
    } else {
      console.error('Error respuesta backend', json);
      alert('Ocurrió un error al enviar la inscripción. Intenta de nuevo.');
    }
  } catch (err) {
    console.error(err);
    alert('No se pudo conectar al servidor. Revisa la consola.');
  }
});
