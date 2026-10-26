# StudyBuddies - Frontend Application

Plataforma colaborativa de estudio universitario donde los estudiantes pueden crear, compartir y estudiar material académico estructurado por materias, temas, tarjetas de memoria (_flashcards_) con pistas interactivas y resúmenes digitales.

Desarrollada para la cátedra de **Desarrollo de Software** - UTN.

## Descripción del Proyecto

**StudyBuddies** brinda una experiencia de usuario orientada al estudio activo y colaborativo:

- **Estructura Académica:** Navegación jerárquica de Materias (`Subjects`) y sus correspondientes Temas (`Topics`).
- **Material de Estudio:**
  - **Tarjetas y Pistas:** Tarjetas de repaso espaciado con preguntas, respuestas y pistas vinculadas para autoevaluación.
  - **Resúmenes:** Consulta y carga de apuntes teóricos por tema.
- **Cursos y Suscripciones:** Los usuarios pueden organizar sus contenidos en cursos y los alumnos suscribirse para acceder al material preparado.
- **Administración y Control de Acceso:** Gestión diferenciada para roles `ADMIN` y `USER` (administración de usuarios, cursos e inscripciones).
- **Diseño Mobile-First y Accesible:** Interfaz adaptable a celulares, tablets y desktop con Tailwind CSS v4, animaciones fluidas y Shadcn UI.

## Tecnologías y Librerías

El cliente frontend está construido con el stack moderno de React:

- **Core & Build Tool:** [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Enrutamiento:** [React Router DOM v7](https://reactrouter.com/) (Data APIs con `createBrowserRouter`)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`, `tw-animate-css`)
- **Componentes UI & Primitivas:** [shadcn](https://ui.shadcn.com/) y [Radix UI](https://www.radix-ui.com/)
- **Gestión de Estado Asíncrono / Servidor:** [TanStack React Query v5](https://tanstack.com/query/latest) (con manejo global de errores y deslogueo por sesión expirada)
- **Estado Global de Sesión:** [Zustand v5](https://zustand.docs.pmnd.rs/) (`useLoginStatus`)
- **Iconografía & Tipografía:** [Lucide React](https://lucide.dev/) y `@fontsource-variable/geist`
- **Utilidades de clases:** `clsx`, `tailwind-merge`, `class-variance-authority (cva)`
- **Linter & Formatter:** ESLint 10 + Prettier

---

## Mapa de Rutas de la Aplicación

La aplicación cuenta con las siguientes rutas configuradas:

| Ruta                                             | Componente / Vista        | Descripción                                              |
| :----------------------------------------------- | :------------------------ | :------------------------------------------------------- |
| `/`                                              | `Home.jsx`                | Pantalla principal de bienvenida y acceso general.       |
| `/login`                                         | `Login.jsx`               | Inicio de sesión con autenticación JWT.                  |
| `/register`                                      | `Signup.jsx`              | Registro de nuevos usuarios en el sistema.               |
| `/subjects`                                      | `Subjects.jsx`            | Exploración y administración de materias.                |
| `/subjects/:subjectId/topics`                    | `Topics.jsx`              | Listado de temas asociados a una materia.                |
| `/subjects/:subjectId/topics/:topicId/cards`     | `TopicCards.jsx`          | Tarjetas de estudio correspondientes a un tema.          |
| `/subjects/:subjectId/topics/:topicId/summaries` | `Summaries.jsx`           | Resúmenes teóricos vinculados al tema.                   |
| `/cards`                                         | `Cards.jsx`               | Vista global de tarjetas de estudio.                     |
| `/notes`                                         | `Notes.jsx`               | Vista general de notas y apuntes.                        |
| `/hints`                                         | `Hints.jsx`               | Gestión y visualización de pistas para tarjetas.         |
| `/students`                                      | `Students.jsx`            | Directorio de estudiantes.                               |
| `/courses`                                       | `Courses.jsx`             | Gestión de cursos académicos.                            |
| `/courses/:courseId/subscriptions`               | `CourseSubscriptions.jsx` | Control y gestión de inscripciones de alumnos por curso. |
| `/users`                                         | `Users.jsx`               | Administración global de usuarios (exclusivo Admin).     |
| `*`                                              | `NotFound.jsx`            | Pantalla de error 404 para rutas inexistentes.           |

---

## Instrucciones de Instalación y Ejecución

### Prerrequisitos

- [Node.js](https://nodejs.org/) v18.x o superior instalado.
- Gestor de paquetes `npm`.
- Servidor Backend de StudyBuddies levantado localmente o desplegado.

### 1. Clonar el repositorio

```bash
git clone https://github.com/Tilajc/TP_Desarrollo_Software.git
cd TP_Desarrollo_Software
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Iniciar en entorno de desarrollo

```bash
npm run dev
```

La aplicación correrá en `http://localhost:5173`.

### 5. Otros scripts útiles

```bash
# Ejecutar el linter para comprobar código
npm run lint

# Generar el bundle para producción
npm run build

# Previsualizar el build productivo
npm run preview
```

---

## Enlaces de Deploy

- **Frontend App:**
- **Backend API:**

---

## Credenciales para Pruebas del Deploy

Para evaluar los distintos roles y permisos en la plataforma:

| Rol                   | Correo Electrónico       | Contraseña | Permisos                                                                           |
| :-------------------- | :----------------------- | :--------- | :--------------------------------------------------------------------------------- |
| **Administrador**     | `admin@gmail.com`        | `pass12`   | Acceso total a Usuarios (`/users`), Cursos (`/courses`), Materias e Inscripciones. |
| **Estudiante (User)** | `carlos.gomez@gmail.com` | `carlos12` | Carga y repaso de Tarjetas, Pistas, Resúmenes y Suscripción a cursos.              |

> _Nota: También es posible crear un nuevo usuario directamente desde la ruta `/register`._

---

## Autores

Trabajo Práctico para la cátedra de **Desarrollo de Software** - UTN:

- **Micaela Ponce** - Legajo: `44094`
- **Juan Cruz Tilatti** - Legajo: `42448`
