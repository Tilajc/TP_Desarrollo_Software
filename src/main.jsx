import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Layout from './Layout';
import Home from './pages/Home.jsx';
import Subjects from './pages/Subjects.jsx';
import Notes from './pages/Notes.jsx';
import Cards from './pages/Cards.jsx';
import Summary from './pages/Summary.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/materias',
        element: <Subjects />,
      },
      {
        path: '/apuntes',
        element: <Notes />,
      },
      {
        path: '/tarjetas',
        element: <Cards />,
      },
      {
        path: '/resumen',
        element: <Summary />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
