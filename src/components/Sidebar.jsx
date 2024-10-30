import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <ul className="sidebar-list">
        <li className="sidebar-item">
          <Link to="/presupuesto/jefe-proyectos" className="sidebar-link">Jefe Proyectos</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/presupuesto/clientes" className="sidebar-link">Clientes</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/presupuesto/empresas" className="sidebar-link">Empresas</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/presupuesto/presupuesto-contenido" className="sidebar-link">Presupuesto Contenido</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/presupuesto/informacion" className="sidebar-link">Información</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/presupuesto/presupuestos" className="sidebar-link">Presupuesto</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/presupuesto/registro-presupuestos" className="sidebar-link">Registro de Presupuestos</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
