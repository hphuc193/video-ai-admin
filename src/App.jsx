import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import AdminLayout from './components/AdminLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Packages from './pages/Packages';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('admin_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/packages"
          element={
            <ProtectedRoute>
              <Packages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;