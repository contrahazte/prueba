import React from 'react';
import { Link } from 'react-router-dom';
import HomeNavbar from "./HomeNavbar";
import './GestionPresupuesto.css'; // Asegúrate de tener este archivo para los estilos específicos

function GestionPresupuesto() {
  <HomeNavbar/>
  return (
    <div className="gestion-presupuesto">
      <h2 className='h2-home'>Gestión de Presupuestos</h2>
      <div className="gestion-presupuesto-buttons">
        <Link to="/presupuesto/jefe-proyectos" className="gestion-presupuesto-button">
          Jefe de Proyectos
        </Link>
        <Link to="/presupuesto/clientes" className="gestion-presupuesto-button">
          Clientes
        </Link>
        <Link to="/presupuesto/empresas" className="gestion-presupuesto-button">
          Empresas
        </Link>
        <Link to="/presupuesto/presupuesto-contenido" className="gestion-presupuesto-button">
          Contenido del Presupuesto
        </Link>
        <Link to="/presupuesto/informacion" className="gestion-presupuesto-button">
          Información
        </Link>
        <Link to="/presupuesto/presupuestos" className="gestion-presupuesto-button">
          Presupuesto
        </Link>
        <Link to="/presupuesto/registro-presupuestos" className="gestion-presupuesto-button"> {/* Nuevo enlace */}
         Registro de Presupuestos
        </Link>
        <img
        src="https://www.seomalaga.com/wp-content/uploads/2023/04/favico-seomalaga.png"
        alt="buho-logo"
        className='buho-logo'
        />


      </div>
    </div>
  );
}

export default GestionPresupuesto;
