import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import Layout from './Layout';
import Home from './pages/Home.jsx';
import Cards from './pages/Cards.jsx';
import Notes from './pages/Notes.jsx';
import Subjects from './pages/Admin/Subjects.jsx';
import Students from './pages/Students.jsx';
import Summaries from './pages/Summaries.jsx';
import Topics from './pages/Admin/Topics.jsx';
import TopicCards from './pages/Admin/TopicCards.jsx';

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
        path: '/materias/:subjectId/temas',
        element: <Topics />,
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
        element: <Students />,
      },
      {
        path: '/resumen',
        element: <Summaries />,
      },
      {
        path: '/materias/:subjectId/temas/:topicId/tarjetas',
        element: <TopicCards />,
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
