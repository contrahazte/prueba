import React from 'react';
import ReactDOM from 'react-dom/client'; // Asegúrate de importar createRoot
import App from './App';
import { PresupuestoProvider } from "./components/PresupuestoContext";

// Encuentra el elemento root
const rootElement = document.getElementById('root');

// Crea el root usando createRoot
const root = ReactDOM.createRoot(rootElement);

// Usa root.render para renderizar tu aplicación
root.render(
  <PresupuestoProvider>
    <App />
  </PresupuestoProvider>
);
