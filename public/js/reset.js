// Obtener el token desde la URL: ?token=xxxxx
const params = new URLSearchParams(window.location.search);
const token = params.get('token');

if (!token) {
  alert('Token no encontrado en la URL');
  throw new Error('Token no encontrado');
}

console.log("🟢 Token leído desde URL:", token);

document.getElementById('resetform').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nuevapassword = document.getElementById('newpassword').value;
  const confirmpassword = document.getElementById('confirmpassword').value;

  if (nuevapassword !== confirmpassword) {
    alert('Las contraseñas no coinciden');
    return;
  }

  try {
    // 🔹 Aquí enviamos el token como parte de la URL
    const res = await fetch(`/api/reset/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nuevapassword, confirmpassword })
    });

    const data = await res.json();
    console.log("Respuesta del servidor:", data);

    if (data.success) {
      alert('Contraseña actualizada correctamente.');
      window.location.href = '/login.html';
    } else {
      alert(data.message || 'Error al restablecer la contraseña.');
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Error al conectar con el servidor.');
  }
});
