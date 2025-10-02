export function cargarNavBar() {
    
    fetch("../components/navbar.html")
        .then(res => res.text())
        .then(html => document.getElementById("Lanavbar").innerHTML = html);
}    