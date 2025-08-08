import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Locations from './pages/Locations';
import Submissions from './pages/Submissions';
import Contact from './pages/Contact';
import MainLayout from './layout/MainLayout';
import Achievements from './pages/Achievements';
import Team from './pages/Team';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '', element: <Dashboard /> },
      { path: 'properties', element: <Properties /> },
      { path: 'locations', element: <Locations /> },
      { path: 'achievements', element: <Achievements /> },
      { path: 'submissions', element: <Submissions /> },
      { path: 'contact', element: <Contact /> },
      { path: 'team', element: <Team /> },
    ],
  },
]);

export default router;
