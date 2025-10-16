const token = window.location.pathname.split('/').pop();

document.getElementById('resetform').addEventListener('submit',async (e) =>{
    e.preventdefault();

 const nuevapassword = document.getElementById('newPassword').value;
 const confirmPassword = document.getElementById('confirmpassword').value;

 if(nuevaPassword !== confirmpassword){
    alert('las contraseñas no coiciden');
    return;
 }

try{
    const res = await fetch(`/api/reset/${token}`,{
        method: 'POST',
        headers:{'content-Type':'application/Json'},
        body: JSON.stringfy({nuevapassword,confirmpassword})

    });

const data = await res.Json();
alert(data.message);

if(data.success){
    window.location.href ='/login.html';
}
}catch(err){
    alert('Error al conectar al servidor ');
}
});