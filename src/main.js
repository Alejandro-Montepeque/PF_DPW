import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap';
import Swal from 'sweetalert2';
import api from "./script/api.js"


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
  const sendBtn = document.getElementById("sendBtn");

  sendBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const fields = [
      { id: "name", label: "Nombre" },
      { id: "email", label: "Email" },
      { id: "phone", label: "Teléfono" },
      { id: "message", label: "Mensaje" },
    ];

    for (const field of fields) {
      const value = document.getElementById(field.id).value.trim();
      if (!value) {
        Swal.fire({
          icon: "warning",
          title: "Campo vacío",
          text: `Por favor, complete el campo "${field.label}".`,
        });
        return;
      }
    }

    const payload = {
      nombre: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      message: document.getElementById("message").value.trim(),
    };

    try {
      const { data } = await api.post("/save_users", payload);

      Swal.fire({
        icon: "success",
        title: "Datos enviados con éxito",
        text: "Espere de 3 a 5 horas para ser contactado.",
      }).then(() => {
        fields.forEach((field) => {
          document.getElementById(field.id).value = "";
        });
      });
    } catch (err) {
      console.error("Error al conectar con la API:", err);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: err.response?.data?.error || "No se pudo conectar con el servidor.",
      });
    }
  });
});
