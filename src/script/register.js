import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap';
import Swal from 'sweetalert2';
import api from "./api.js"

document.addEventListener("DOMContentLoaded", () =>{
    const btnRegister = document.getElementById("btnRegister");

    btnRegister.addEventListener("click", async(e) => {
        e.preventDefault();

        const payload = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value.trim(),
            password_confirmation: document.getElementById("passwordConfirm").value.trim(),
        }

        if (!payload.name || !payload.email || !payload.password || !payload.password_confirmation) {
            Swal.fire({
                icon: "warning",
                title: "Campos incompletos",
                text: "Por favor complete todos los campos e intente enviar el formulario de nuevo"
            });
            return; // Evita enviar el formulario vacio
        }

        if (payload.password !== payload.password_confirmation) {
            Swal.fire({
                icon: "error",
                title: "Contraseñas no coinciden",
                text: "Por favor asegúrese de que la contraseña y la confirmación sean iguales"
            });
            return; // no envía nada si las contraseñas no coinciden
        }

        try {
            const { data } = await api.post("/save_users", payload);

            Swal.fire({
                icon: "success",
                title: "Usuario registrado con éxito",
                text: "Pruebe iniciando sesión"
            }).then(() => {
                Object.keys(payload).forEach(key => {
                    document.getElementById(key === "password_confirmation" ? "passwordConfirm" : key).value = "";
                });
            });
        } catch (err) {
            console.error("Error al enviar los datos a la API: ", err);
            Swal.fire({
                icon: "error",
                title: "Error de conexión",
                text: "No se pudo establecer conexión con el servidor"
            })
        }
    })
})