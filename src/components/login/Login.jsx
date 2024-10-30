import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./Login.css"; // Importamos el archivo CSS

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Guarda el token y datos del usuario en localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('userEmail', result.user.email);
        localStorage.setItem('userName', result.user.name);
        localStorage.setItem('userRole', result.user.role);

        onLogin(); // Cambia el estado de autenticación
        navigate('/presupuesto/home'); // Redirige al usuario a la página "home"
      } else {
        setErrorMessage(result.message || 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      setErrorMessage('Error al conectar con el servidor: ' + error.message);
    }
  };

  return (
    <div className="container">
      <div className='black-div'>

        <h1 className='h1-login'>Presupuestos SEO Málaga</h1>
        <div className='form'>
          <div className='logo-div'>
            <Link to="#" className="sms-logo">
              <img
                src="https://www.seomalaga.com/wp-content/uploads/2023/04/seomalaga-agencia-marketing-logo.png"
                alt="Logo"
              />
            </Link>
          </div>
          <h2 className='h2-login'>Iniciar Sesión</h2>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <form onSubmit={handleSubmit} className="form">
            <div className="inputGroup">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingrese su email"
                className="input"
                required
              />
            </div>
            <div className="inputGroup">
              <label>Contraseña:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingrese su contraseña"
                className="input"
                required
              />
            </div>
            <button type="submit" className="button-login">Ingresar</button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default Login;
