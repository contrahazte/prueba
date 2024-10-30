import React from "react";
import "./HomeNavbar.css"; // Importa los estilos

const Navbar = () => {
    const handleLogout = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
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
    <nav className="navbar">
      <div className="logo">
        <a href="#">Mi Sitio</a>
      </div>
      <div className="logout">
      <Link className="sms-buttons-navbar" onClick={handleLogout} to="#" style={{ cursor: 'pointer' }}>Logout</Link>
      </div>
    </nav>
  );
};

export default Navbar;
