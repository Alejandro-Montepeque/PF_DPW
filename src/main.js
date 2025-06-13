import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap';
import Swal from 'sweetalert2';


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


document.addEventListener('DOMContentLoaded', () => {
  const sendBtn = document.getElementById('sendBtn');

  sendBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const fields = [
      { id: 'name', label: 'Nombre' },
      { id: 'email', label: 'Email' },
      { id: 'phone', label: 'telefono' },
      { id: 'message', label: 'Mensaje' },
    ];

    for (const field of fields) {
      const value = document.getElementById(field.id).value.trim();
      if (!value) {
        Swal.fire({
          icon: 'warning',
          title: 'Campo vacío',
          text: `Por favor, complete el campo "${field.label}".`,
        });
        return;
      }
    }

    // Mostrar alerta de éxito
    Swal.fire({
      icon: 'success',
      title: 'Datos enviados con éxito',
      text: 'Espere de 3 a 5 horas para ser contactado.',
    }).then(() => {
      // Limpiar los campos después de que el usuario cierre la alerta
      fields.forEach(field => {
        document.getElementById(field.id).value = '';
      });
    });
  });
});