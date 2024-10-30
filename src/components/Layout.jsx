import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import PresupuestoNavbar from './PresupuestoNavbar'; // Navbar general
import PresupuestosNavbar from './PresupuestosNavbar'; // Navbar específico de Presupuesto
import './Layout.css';

function Layout({ onLogout }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para manejar la visibilidad del Sidebar

  // Verifica si la ruta actual es una de las páginas de presupuesto (incluyendo "nuevoPresupuesto")
  const isPresupuestoPage =
    location.pathname === '/presupuesto/presupuestos' ||
    location.pathname === '/presupuesto/nuevoPresupuesto';

  // Verifica si la ruta actual es "Gestión de Presupuestos" (no debe mostrar el menú hamburguesa)
  const isGestionPresupuestoPage = location.pathname === '/presupuesto/home';

  // Función para manejar la apertura y cierre del sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Alternar estado de sidebar
  };

  // Cerrar el sidebar automáticamente cuando se navega a "Gestión de Presupuestos"
  useEffect(() => {
    if (isGestionPresupuestoPage) {
      setIsSidebarOpen(false); // Cierra el sidebar si estamos en /presupuesto/home
    }
  }, [isGestionPresupuestoPage]);

  return (
    <div className="layout">
      {/* Mostrar el navbar adecuado en función de la página */}
      {isPresupuestoPage ? (
        <PresupuestosNavbar onLogout={onLogout} />
      ) : (
        <PresupuestoNavbar onLogout={onLogout} />
      )}

      {/* Mostrar el botón burger, excepto en Gestión de Presupuestos */}
      {!isGestionPresupuestoPage && (
        <div
          className={`burger-menu ${isPresupuestoPage ? 'burger-static' : 'burger-fixed'} ${
            isPresupuestoPage ? 'burger-black' : 'burger-pink'
          }`}
          onClick={toggleSidebar}
        >
          <div className="burger-bar"></div>
          <div className="burger-bar"></div>
          <div className="burger-bar"></div>
        </div>
      )}

      {/* Renderizar el Sidebar basado en isSidebarOpen */}
      {isSidebarOpen && !isGestionPresupuestoPage && (
        <Sidebar className="sidebar-burger open" />
      )}

      {/* Contenido principal */}
      <div className={`content${isPresupuestoPage ? '-full-width' : ''}`}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
