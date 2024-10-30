import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PresupuestoNavbar from '../PresupuestoNavbar';
import "../login/Login.css"; // Usar el mismo archivo CSS que Login

const Register = ({ onLogout }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'inCharge', // Mantener este valor
    name: '', // Añadir nombre
    company: '', // Añadir empresa
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Manejador de cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manejador del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Registro exitoso');
        navigate('/presupuesto/login'); // Redirigir a la página de login tras registro exitoso
      } else {
        const result = await response.json();
        setErrorMessage(result.message || 'Error en el registro');
      }
    } catch (error) {
      setErrorMessage('Error al conectar con el servidor: ' + error.message);
    }
  };

  return (
    <>
      {/* Incluimos el PresupuestoNavbar con el botón de Logout */}
      <PresupuestoNavbar onLogout={onLogout} />

      <div className="container">
        <div className='black-div'>
          <div className='form'>
            <div className='logo-div'>
              <img
                src="https://www.seomalaga.com/wp-content/uploads/2023/04/seomalaga-agencia-marketing-logo.png"
                alt="Logo"
              />
            </div>
            <h2 className='h2-login'>Registro</h2>

            {/* Mostrar mensaje de error si existe */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            {/* Formulario de registro */}
            <form onSubmit={handleSubmit} className="form">
              <div className="inputGroup">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ingrese nuevo email"
                  className="input"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="inputGroup">
                <label>Contraseña:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ingrese nueva contraseña"
                  className="input"
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="inputGroup">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ingrese nuevo nombre"
                  className="input"
                  required
                />
              </div>
              <div className="inputGroup">
                <label>Empresa:</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Ingrese nueva empresa"
                  className="input"
                  required
                />
              </div>
              <button type="submit" className="button">Registrarse</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
