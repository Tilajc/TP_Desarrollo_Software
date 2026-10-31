import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
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
import Subjects from './pages/Admin/Subjects.jsx';
import Summaries from './pages/Admin/Summaries.jsx';
import Users from './pages/Admin/Users.jsx';
import Hints from './pages/Admin/Hints.jsx';
import Topics from './pages/Admin/Topics.jsx';
import TopicCards from './pages/Admin/TopicCards.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Courses from './pages/Admin/Courses.jsx';
import CourseSubscriptions from './pages/Admin/CourseSubscriptions';
import NotFound from './pages/NotFound.jsx';
import Profile from './pages/Profile';
import MyCourses from './pages/MyCourses';
import MyCourse from './pages/MyCourse';
import MyCourseTopic from './pages/MyCourseTopic';
import StudyCourse from './pages/StudyCourse.jsx';
import Subscriptions from './pages/Subscriptions';
import SubscribedCourse from './pages/SubscribedCourse';
import SubscribedTopic from './pages/SubscribedTopic';

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
        path: '/cards',
        element: <Cards />,
      },
      {
        path: '/students',
        element: <Navigate to="/" replace />,
      },
      {
        path: '/subjects/:subjectId/topics/:topicId/summaries',
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
      {
        path: '/courses/:courseId/subscriptions',
        element: <CourseSubscriptions />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/my-courses',
        element: <MyCourses />,
      },
      {
        path: '/study',
        element: <StudyCourse />,
      },
      { path: '/my-courses/:courseId', element: <MyCourse /> },
      {
        path: '/my-courses/:courseId/topics/:topicId',
        element: <MyCourseTopic />,
      },
      { path: '/subscriptions', element: <Subscriptions /> },
      { path: '/subscriptions/:courseId', element: <SubscribedCourse /> },
      {
        path: '/subscriptions/:courseId/topics/:topicId',
        element: <SubscribedTopic />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
