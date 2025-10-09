document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const phoneInput = document.getElementById("phone");
  const imageInput = document.getElementById("imageInput");
  const profileImage = document.getElementById("profileImage");
  const form = document.getElementById("profileForm");

  const usuario = localStorage.getItem("usuario");

  // Precarga el email del usuario
  if (usuario) {
    emailInput.value = usuario;
  }

  // Carga los datos del perfil si existen
  const savedProfile = JSON.parse(localStorage.getItem("perfilUsuario"));
  if (savedProfile) {
    firstNameInput.value = savedProfile.firstName || "";
    lastNameInput.value = savedProfile.lastName || "";
    phoneInput.value = savedProfile.phone || "";
    emailInput.value = savedProfile.email || usuario;
  }

//*Desafíate
  const savedImage = localStorage.getItem("fotoPerfil");
  if (savedImage) {
    profileImage.src = savedImage;
  }
  // Guarda datos
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const profileData = {
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
    };

    localStorage.setItem("perfilUsuario", JSON.stringify(profileData));
    alert("Se han guardado los cambios");
  });

  // Cargar la imagen
  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        profileImage.src = event.target.result;

//Desafiate
        localStorage.setItem("fotoPerfil", event.target.result);
      };
      reader.readAsDataURL(file);
    }
  });
});
