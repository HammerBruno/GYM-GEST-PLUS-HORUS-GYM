document.getElementById("forgot-form").addEventListener("submit", async (e) => {
    e.preventDefault();


    const email=document.getElementById("forgotemail").value;

    try{
        const res= await fetch("/api/forgot",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({email}),
       });

     const   data= await res.json();
     alert(data.message);

     if(data.success){
        document.getElementById("forgot-form").reset();
     }
     
     
    }catch(err){
        alert("Error en conexión");
    } 

}); 