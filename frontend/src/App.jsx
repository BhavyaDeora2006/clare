import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from "./pages/Login";
import Dashboard from "./pages/Settings";
import DashboardPage from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { supabase } from "./services/supabaseClient";
import { PreferencesProvider } from "./context/PreferencesContext";
import Craft from "./pages/Craft";
import Learn from "./pages/Learn";
import Ask from "./pages/Ask";
import Refine from "./pages/Refine";
import Echo from "./pages/Echo";
import Home from './pages/Home';
import ResetPassword from './pages/ResetPassword';


function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for auth state changes (e.g., Google OAuth redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        navigate('/reset-password');
      } else if (event === 'SIGNED_IN' && session) {
  const isAuthPage = ['/login', '/home'].includes(window.location.pathname);
  if (isAuthPage) {
    navigate('/dashboard');
  }
}
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <Routes>
      {/* Public */}
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/craft"
        element={
          <ProtectedRoute>
            <Craft />
          </ProtectedRoute>
        }
      />

      <Route
        path="/learn"
        element={
          <ProtectedRoute>
            <Learn />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ask"
        element={
          <ProtectedRoute>
            <Ask />
          </ProtectedRoute>
        }
      />

      <Route
        path="/refine"
        element={
          <ProtectedRoute>
            <Refine />
          </ProtectedRoute>
        }
      />

      <Route
        path="/echo"
        element={
          <ProtectedRoute>
            <Echo />
          </ProtectedRoute>
        }
      />

      {/* Root */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <PreferencesProvider>
      <Router>
        <AppContent />
      </Router>
    </PreferencesProvider>
  );
}


export default App;

