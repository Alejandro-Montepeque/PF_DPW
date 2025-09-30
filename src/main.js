import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap';
import Swal from 'sweetalert2';
import api from "./script/api.js"

document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password");
  const toggle = document.getElementById("togglePassword");
  const icon = toggle.querySelector("i");

  toggle.addEventListener("click", () => {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;

    // Cambiar icono
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
  });
});


// Se hace una petición para obtener el archivo 'navbarComponent.html'y donde se encuentra ubicado
fetch('/components/navbarComponent.html')
  // Cuando la respuesta llega, se convierte a texto (el contenido HTML)
  .then(response => response.text())
  // Con el contenido HTML recibido, se inserta dentro del elemento con id 'navbar-container'
  .then(html => {
    document.getElementById('navbar-container').innerHTML = html;
  })
  //Al haber un error muestra en la consola esto
  .catch(error => console.error('No se encuentra o no esta disponible el navbar', error))


document.addEventListener("DOMContentLoaded", () => {
  const btnLogin = document.getElementById("btnlogin");

  btnLogin.addEventListener("click", async (e)=>{
    const payload = {
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value.trim(),
    }

    if (!payload.email || !payload.password) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor complete todos los campos"
      });
      return;
    }

    try {
      const { data, status } = await api.post('/login', payload)

      if (status == 200 ){
        // localStorage.setItem("token", data.token);
  
         Swal.fire({
            icon: "success",
            title: "Login exitoso",
            text: `Bienvenido ${data.user.name}`
          }).then(() => {
            // Redirigir a home
            window.location.href = "/public/homeView.html";
          });
      } else {
        Swal.fire({
          icon:"error",
          title:"Revise que todos sus datos esten correctos y vuelva a intentar",
        })
      }

    } catch (err) {
      console.error("Error al enviar los datos a la API: ", err);
      Swal.fire({
        icon:"error",
        title:"Revise que todos sus datos esten correctos y vuelva a intentar",
      })
    }
  })
})
// document.addEventListener("DOMContentLoaded", () => {
//   const sendBtn = document.getElementById("sendBtn");

//   sendBtn.addEventListener("click", async (e) => {
//     e.preventDefault();

//     const fields = [
//       { id: "name", label: "Nombre" },
//       { id: "email", label: "Email" },
//       { id: "phone", label: "Teléfono" },
//       { id: "message", label: "Mensaje" },
//     ];

//     for (const field of fields) {
//       const value = document.getElementById(field.id).value.trim();
//       if (!value) {
//         Swal.fire({
//           icon: "warning",
//           title: "Campo vacío",
//           text: `Por favor, complete el campo "${field.label}".`,
//         });
//         return;
//       }
//     }

//     const payload = {
//       nombre: document.getElementById("name").value.trim(),
//       email: document.getElementById("email").value.trim(),
//       phone: document.getElementById("phone").value.trim(),
//       message: document.getElementById("message").value.trim(),
//     };

//     try {
//       const { data } = await api.post("/save_users", payload);

//       Swal.fire({
//         icon: "success",
//         title: "Datos enviados con éxito",
//         text: "Espere de 3 a 5 horas para ser contactado.",
//       }).then(() => {
//         fields.forEach((field) => {
//           document.getElementById(field.id).value = "";
//         });
//       });
//     } catch (err) {
//       console.error("Error al conectar con la API:", err);
//       Swal.fire({
//         icon: "error",
//         title: "Error de conexión",
//         text: err.response?.data?.error || "No se pudo conectar con el servidor.",
//       });
//     }
//   });
// });
