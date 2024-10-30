import React from 'react';
import './PresupuestosNavbar.css'; // Importa el archivo CSS
import { FaPrint, FaFilePdf } from 'react-icons/fa'; // Importa los íconos de Font Awesome
import { usePresupuesto } from './PresupuestoContext';

function PresupuestosNavbar() {
  const { datosPresupuesto } = usePresupuesto(); // Usa el contexto

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = '/ruta-al-archivo.pdf'; // Cambia esta URL por la ruta de tu archivo PDF
    link.download = 'documento.pdf';
    link.click();
  };

  // Desestructuración para obtener los datos del presupuesto
  const {
    presupuesto: { id = 'No determinado', fecha = 'Hora no disponible' }
  } = datosPresupuesto;

  return (
    <nav className="mms-navbar">
      <div className="mms-navbar-left-section">
        <div className="mms-navbar-buttons-container">
          <button className="mms-navbar-button" onClick={handlePrint}>
            <FaPrint className="icon" />
            <span className="p-buttons">Imprimir</span>
          </button>
          <button className="mms-navbar-button" onClick={handleDownloadPDF}>
            <FaFilePdf className="icon" />
            <span className="p-buttons">Descargar PDF</span>
          </button>
        </div>
        <div className="datos-presupuesto">
          {/* Muestra la hora y el ID del presupuesto */}
          <p className="id-presupuesto">Propuesta nº PR2401{id}</p>
          <p className="fecha-presupuesto">Fecha:<span className='fecha'>{fecha}</span></p>
        </div>
      </div>
    </nav>
  );
}

export default PresupuestosNavbar;
