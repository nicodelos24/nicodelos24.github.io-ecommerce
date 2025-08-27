document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (usuario.value.trim() === "" || password.value.trim() === "") {
            alert("Por favor, complete todos los campos");
        } else {
            // Autenticación ficticia: siempre válido si hay datos
            localStorage.setItem("usuario", usuario.value.trim());
            window.location.href = "index.html";
        }
    });
});
