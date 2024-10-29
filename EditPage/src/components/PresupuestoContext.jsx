import React, { createContext, useState, useContext } from 'react';

const PresupuestoContext = createContext();

export const usePresupuesto = () => useContext(PresupuestoContext);

export const PresupuestoProvider = ({ children }) => {

  // Función para obtener la fecha actual
  const getCurrentDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const year = now.getFullYear();
    return `${day}/${month}/${year}`; // Devuelve la fecha en formato DD/MM/YYYY
  };

  // Estado inicial del presupuesto
  const [datosPresupuesto, setDatosPresupuesto] = useState({
    nombrePresupuesto: '', // Esto representa el nombre del servicio
    descripcionPresupuesto: '', // Esto describe el servicio
    cliente: {
      id: '',
      nombre: '',
      empresa: '',
      telefono: '',
      email: ''
    },
    empresa: {
      id: '',
      nombre: '',
      telefono: '',
      urlEmpresa: "",
      urlLogo: ''
    },
    jefeProyectos: {
      id: '',
      nombre: '',
      telefono: '',
      email: '',
      cargo: '',
      urlFotoJefe: ''
    },
    contenidoPresupuesto: [], // Relacionado con contenido_presupuesto
    informacion: [], // Relacionado con informacion
    presupuesto: {
      id: '', // Establece un ID de prueba o deja en blanco
      fecha: getCurrentDate(), // Fecha actual
      urlPresupuesto: '', // Nueva columna añadida en la base de datos
    }
  });

  return (
    <PresupuestoContext.Provider value={{ datosPresupuesto, setDatosPresupuesto }}>
      {children}
    </PresupuestoContext.Provider>
  );
};
