import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from '@tanstack/react-query';
import useLoginStatus from './store/useLoginStatus';
import './index.css';
import Layout from './Layout';
import Home from './pages/Home.jsx';
import Cards from './pages/Cards.jsx';
import Notes from './pages/Notes.jsx';
import Subjects from './pages/Admin/Subjects.jsx';
import Students from './pages/Students.jsx';
import Summaries from './pages/Summaries.jsx';
import Users from './pages/Admin/Users.jsx';
import Hints from './pages/Hints.jsx';
import Topics from './pages/Admin/Topics.jsx';
import TopicCards from './pages/Admin/TopicCards.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Courses from './pages/Admin/Courses.jsx';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error.message === 'Por favor, inicia sesión nuevamente.') {
        localStorage.removeItem('token');
        useLoginStatus.getState().logout();
      }
    },
  }),
});

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
        path: '/subjects',
        element: <Subjects />,
      },
      {
        path: '/subjects/:subjectId/topics',
        element: <Topics />,
      },
      {
        path: '/subjects/:subjectId/topics/:topicId/cards',
        element: <TopicCards />,
      },
      {
        path: '/subject/:subjectId/topic/:topicId/summaries',
        element: <Summaries />,
      },
      {
        path: '/notes',
        element: <Notes />,
      },
      {
        path: '/cards',
        element: <Cards />,
      },
      {
        path: '/students',
        element: <Students />,
      },
      {
        path: '/summaries',
        element: <Summaries />,
      },
      {
        path: '/users',
        element: <Users />,
      },
      {
        path: '/hints',
        element: <Hints />,
      },
      {
        path: '/subject/:subjectId/topic/:topicId/cards',
        element: <Cards />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Signup />,
      },
      {
        path: '/courses',
        element: <Courses />,
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
