import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de que esto sea importado correctamente
import './PresupuestoNavbar.css';

const PresupuestoNavbar = ({ onLogout }) => {
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Verificar si la ruta actual es la de registro
  const isRegisterPage = location.pathname === '/presupuesto/register';

  useEffect(() => {
    const getUserRole = () => {
      const token = localStorage.getItem('token');
      if (!token) return null;

      try {
        const decoded = jwtDecode(token);
        return decoded.role;
      } catch (error) {
        console.error('Error decodificando el token:', error);
        return null;
      }
    };

    setUserRole(getUserRole());
  }, [location]);
  useEffect(() => {
    const getUserName = () => {
      return localStorage.getItem('userName') || ''; // No hace falta decodificar
    };

    setUserName(getUserName());
  }, [location]);

  const token = localStorage.getItem('token');
  const isLoggedIn = !!userRole;

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        onLogout(); // Llama a onLogout del Layout
        navigate('/presupuesto/login'); // Redirigir a la página de login
      } else {
        const errorData = await response.json();
        console.error('Error al cerrar sesión:', errorData.message);
      }
    } catch (error) {
      console.error('Error en la solicitud de logout:', error);
    }
  };

  return (
    <nav className="sms-navbar">
      <div className="sms-items-div-navbar">
        <div className="sms-navbar-logo">
          <Link to="/presupuesto/home" className="sms-logo-presupuestoNavbar">
            <img
              src="https://www.seomalaga.com/wp-content/uploads/2023/04/seomalaga-agencia-marketing-logo.png"
              alt="Logo"
            />
          </Link>
        </div>
        <div>
          <h3 className='welcome'>¡Hola,{userName || ""}!</h3>
        </div>
        <div className="sms-navbar-links">

          <Link className="sms-buttons-navbar" to="/presupuesto/home">
            Inicio
          </Link>

          {/* Mostrar Logout y Register solo si no estamos en la página de registro */}
          {!isRegisterPage && (
            <>
              {userRole === 'boss' && (
                <>
                  <Link className="sms-buttons-navbar" to="/presupuesto/register">
                    Crear  Usuario
                  </Link>
                  <Link className="sms-buttons-navbar" onClick={handleLogout} to="#" style={{ cursor: 'pointer' }}>
                    Salir
                  </Link>
                </>
              )}

              {isLoggedIn && userRole !== 'boss' && (
                <Link className="sms-buttons-navbar" onClick={handleLogout} to="#" style={{ cursor: 'pointer' }}>
                 Salir
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default PresupuestoNavbar;
