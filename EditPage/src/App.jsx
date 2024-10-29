import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import GestionPresupuesto from './components/GestionPresupuesto';
import JefeProyectos from './components/JefeProyectos';
import Clientes from './components/Clientes';
import Empresas from './components/Empresas';
import PresupuestoContenido from './components/PresupuestoContenido';
import Informacion from './components/Informacion';
import Presupuestos from './components/Presupuestos';
import RegistroPresupuestos from './components/RegristroPresupuestos';
import Login from './components/login/Login';
import Register from './components/register/Register';
import ProtectedRoute from '../protectedRoutes/ProtectedRoute';
import Unauthorized from '../protectedRoutes/Unauthorized';
import { PresupuestoProvider } from './components/PresupuestoContext';
import NuevoPresupuesto from './components/NuevoPresupuesto';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Manejador de logout que se llamará desde Layout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <PresupuestoProvider>
      <Router>
        <Routes>
          {/* Ruta de login no protegida */}
          <Route
            path="/presupuesto/login"
            element={isAuthenticated ? <Navigate to="/presupuesto/home" /> : <Login onLogin={handleLogin} />}
          />

          {/* Ruta de registro protegida */}
          <Route
            path="/presupuesto/register"
            element={
              <ProtectedRoute requiredRoles={['boss']}>
                <Register />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas */}
          <Route path="/presupuesto" element={isAuthenticated ? <Layout onLogout={handleLogout} /> : <Navigate to="/presupuesto/login" />}>
            <Route path="home" element={<GestionPresupuesto />} />
            <Route path="jefe-proyectos" element={<JefeProyectos />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="empresas" element={<Empresas />} />
            <Route path="presupuesto-contenido" element={<PresupuestoContenido />} />
            <Route path="informacion" element={<Informacion />} />
            <Route path="presupuestos" element={<Presupuestos />} />
            <Route path="registro-presupuestos" element={<RegistroPresupuestos />} />
            <Route path="nuevoPresupuesto" element={<NuevoPresupuesto />} />
          </Route>

          {/* Ruta para acceso no autorizado */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Redirigir cualquier ruta desconocida al login */}
          <Route path="*" element={<Navigate to="/presupuesto/login" />} />
        </Routes>
      </Router>
    </PresupuestoProvider>
  );
}

export default App;
