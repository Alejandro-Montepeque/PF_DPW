## Tecnologías

- Vue
- Bootstrap 5
- Font Awesome
- SweetAlert2
- Axios (para consumir el backend)
  
## Estructura del Proyecto
/src
├─ main.js # Lógica principal del frontend
├─ style.css # Estilos personalizados
├─ api.js # Configuración de Axios
/components
└─ navbarComponent.html # Componente de la barra de navegación
index.html # Página principal
team.html # Página de equipo
form.html # Formulario de contacto

## Funcionalidades

- Formulario de contacto con validación y alertas interactivas.
- Comunicación con el backend usando Axios.
- Componente reutilizable de barra de navegación.
- Página de equipo con diseño responsive.
- Íconos de redes sociales interactivos.

## Configuración de Variables de Entorno

Se recomienda usar Vite para exponer variables al cliente:
VITE_API_URL=URL-BACKEND

## Cómo Ejecutar

- npm install
- npm run dev

