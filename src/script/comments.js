import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import api from "./api.js";

// Se hace una petición para obtener el archivo 'navbarComponent.html'y donde se encuentra ubicado
fetch('/components/navbarComponent.html')
    // Cuando la respuesta llega, se convierte a texto (el contenido HTML)
  .then(response => response.text())
  // Con el contenido HTML recibido, se inserta dentro del elemento con id 'navbar-container'
  .then(html => {
    document.getElementById('navbar-container').innerHTML = html;
  })
  //Al haber un error muestra en la consola esto
  .catch(error => console.error('No se encuentra o no esta disponible el navbar', error));

document.addEventListener("DOMContentLoaded", async () => {
  const commentList = document.getElementById("commentList");
  const commentForm = document.getElementById("commentForm");
  const commentTitle = document.getElementById("commentTitle");
  const commentBody = document.getElementById("commentBody");

  const editCommentModal = new Modal(document.getElementById("editCommentModal"));
  const editCommentForm = document.getElementById("editCommentForm");
  const editCommentId = document.getElementById("editCommentId");
  const editCommentTitle = document.getElementById("editCommentTitle");
  const editCommentBody = document.getElementById("editCommentBody");

  const userId = localStorage.getItem("user_id");

  // --- Validar que el usuario este logueado ---
  if (!userId) {
    Swal.fire({
      icon: "warning",
      title: "Sesión no iniciada",
      text: "Por favor inicia sesión para ver y publicar comentarios",
      confirmButtonText: "Ir al login"
    }).then(() => {
      window.location.href = "./";
    });
    return;
  }

  // --- Cargar comentarios ---
  async function loadComments() {
    commentList.innerHTML = `<p class="text-muted text-center">Cargando comentarios...</p>`;

    try {
      const { data } = await api.post("/get_comments", { userId });

      if (data.message) {
        commentList.innerHTML = `
          <div class="text-center text-muted">
            <i class="fa-regular fa-comments fa-2x mb-2"></i>
            <p>${data.message}</p>
          </div>
        `;
        return;
      }

      commentList.innerHTML = "";
      data.forEach(comment => {
        const commentCard = document.createElement("div");
        commentCard.classList.add("col-12", "mb-3");
        commentCard.innerHTML = `
          <div class="card shadow-sm mb-3">
            <div class="card-body">
              <h5 class="card-title">${comment.title}</h5>
              <p class="text-muted card-text">${comment.comment}</p>
              <small class="text-muted">
                Publicado por ${comment.userId?.name || "Usuario desconocido"} 
                (${comment.userId?.email || "Sin correo"})
              </small>
              <div class="mt-2 d-flex justify-content-end gap-2">
                <button class="btn btn-sm btn-outline-primary edit-btn" 
                        data-id="${comment._id}" 
                        data-title="${comment.title}" 
                        data-comment="${comment.comment}">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${comment._id}">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>`;
        commentList.appendChild(commentCard);
      });

    } catch (err) {
      console.error("Error al obtener comentarios:", err);
      commentList.innerHTML = `<p class="text-danger text-center">Error al cargar los comentarios</p>`;
    }
  }

  // --- Crear un nuevo comentario ---
  commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = commentTitle.value.trim();
    const comment = commentBody.value.trim();

    if (!title || !comment) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa el título y el comentario antes de enviar."
      });
      return;
    }

    try {
      const { data } = await api.post("/save_comments", { title, comment, userId });
      Swal.fire({
        icon: "success",
        title: "Comentario enviado exitosamente",
        showConfirmButton: false,
        timer: 1500
      });
      commentForm.reset();
      await loadComments();
    } catch (err) {
      console.error("Error al crear el comentario:", err);
      Swal.fire({
        icon: "error",
        title: "Error al enviar comentario",
        text: "No se pudo guardar tu comentario. Inténtalo de nuevo más tarde."
      });
    }
  });

  commentList.addEventListener("click", (e) => {
    if (e.target.closest(".edit-btn")) {
      const btn = e.target.closest(".edit-btn");
      const id = btn.dataset.id;
      const title = btn.dataset.title;
      const comment = btn.dataset.comment;

      // Cargar datos en el modal
      editCommentId.value = id;
      editCommentTitle.value = title;
      editCommentBody.value = comment;

      // Mostrar el modal
      editCommentModal.show();
    }
  });

  // --- Guardar cambios del modal ---
  editCommentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = editCommentId.value;
    const title = editCommentTitle.value.trim();
    const comment = editCommentBody.value.trim();

    if (!title || !comment) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos antes de guardar."
      });
      return;
    }

    try {
      await api.put(`/update_comment`, {
        commentId: id,
        title,
        comment,
        userId
      });

      Swal.fire({
        icon: "success",
        title: "Comentario actualizado",
        showConfirmButton: false,
        timer: 1500
      });

      editCommentModal.hide();
      await loadComments();
    } catch (error) {
      console.error("Error al editar comentario:", error);
      Swal.fire({
        icon: "error",
        title: "Error al editar comentario",
        text: "No se pudo actualizar el comentario. Inténtalo de nuevo más tarde."
      });
    }
  });

  commentList.addEventListener("click", async (e) => {
    if (e.target.closest(".delete-btn")) {
      const btn = e.target.closest(".delete-btn");
      const id = btn.dataset.id;

      const confirmDelete = await Swal.fire({
        icon: "warning",
        title: "¿Eliminar comentario?",
        text: "Esta acción no se puede deshacer.",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      });

      if (!confirmDelete.isConfirmed) return;

      try {
        await api.delete(`/delete_comment`, {
          data: { commentId: id, userId }
        });

        Swal.fire({
          icon: "success",
          title: "Comentario eliminado",
          showConfirmButton: false,
          timer: 1500
        });

        await loadComments();
      } catch (error) {
        console.error("Error al eliminar comentario:", error);
        Swal.fire({
          icon: "error",
          title: "Error al eliminar comentario",
          text: "Inténtalo de nuevo más tarde."
        });
      }
    }
  });

  // --- Cargar la api de comentarios al iniciar ---
  await loadComments();
});
