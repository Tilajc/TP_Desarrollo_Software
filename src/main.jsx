import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import Layout from './Layout';
import Home from './pages/Home.jsx';
import Subjects from './pages/Subjects.jsx';
import Notes from './pages/Notes.jsx';
import Cards from './pages/Cards.jsx';
import Student from './pages/Student.jsx';
import Summary from './pages/Summary.jsx';

const queryClient = new QueryClient();

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
        path: '/alumno',
        element: <Student />,
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
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
