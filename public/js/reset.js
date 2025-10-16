const token = window.location.pathname.split('/').pop();

document.getElementById('resetform').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nuevapassword = document.getElementById('newpassword').value;
  const confirmpassword = document.getElementById('confirmpassword').value;

  if (nuevapassword !== confirmpassword) {
    alert('Las contraseñas no coinciden');
    return;
  }

  try {
    const res = await fetch(`/api/reset/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nuevapassword, confirmpassword })
    });

    const data = await res.json();
    alert(data.message);

    if (data.success) {
      window.location.href = '/login.html';
    }
  } catch (err) {
    alert('Error al conectar al servidor');
  }
});