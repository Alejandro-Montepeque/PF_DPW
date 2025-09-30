export function protectRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    // No hay token, redirigir al login
    window.location.href = "/public/loginView.html";
  }
}
