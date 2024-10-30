import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Presupuestos.css';
import Aceptar from "../assets/aceptar.png";
import TengoDudas from "../assets/tengoDudas.png";

function NuevoPresupuesto() {
  const location = useLocation();
  const presupuestoState = location.state?.presupuesto || {};

  // Acceder a datos desde el presupuesto duplicado (si está presente) o desde el contexto
  const {
    nombre_presupuesto = 'Sin nombre',
    descripcion_presupuesto = 'Sin descripción',
    cliente_id,
    jefe_proyecto_id,
    cliente_nombre = 'No especificado',
    cliente_empresa_nombre = 'No especificado',
    cliente_telefono = 'No especificado',
    cliente_email = 'No especificado',
    empresa_nombre = 'No especificado',
    empresa_telefono = 'No especificado',
    empresa_url_empresa = 'https://www.seomalaga.com',
    empresa_url_logo = 'https://www.seomalaga.com/wp-content/uploads/2023/04/seomalaga-agencia-marketing-logo.png',
    jefe_proyecto_nombre = 'No especificado',
    jefe_proyecto_telefono = 'No especificado',
    jefe_proyecto_email = 'No especificado',
    jefe_proyecto_cargo = 'No especificado',
    jefe_proyecto_foto = 'https://img.freepik.com/foto-gratis/retrato-mujer-casual-sonriente_171337-4168.jpg',
    contenidos = [],
    informaciones = [],
  } = presupuestoState;

  // Eliminar duplicados en contenidos e informaciones utilizando un Set por su ID.
  const uniqueContenidos = Array.from(new Map(contenidos.map(item => [item.id, item])).values());
  const uniqueInformaciones = Array.from(new Map(informaciones.map(item => [item.id, item])).values());

  // Estado local para manejar errores, éxito, y visibilidad del formulario
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const [presupuestoNombre, setPresupuestoNombre] = useState(nombre_presupuesto);
  const [presupuestoDescripcion, setPresupuestoDescripcion] = useState(descripcion_presupuesto);

  // Realiza un scroll a la parte superior cada vez que se renderice el componente
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Función para generar una URL única
  const generarUrlPresupuesto = () => {
    const baseURL = "https://www.mipresupuesto.com/presupuesto";
    const uniqueId = Math.random().toString(36).substr(2, 9);
    return `${baseURL}/${uniqueId}`;
  };

  // Función para formatear números de teléfono con un espacio cada 3 dígitos
  const formatPhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Manejar el click del botón de enviar presupuesto
  const handleFloatingButtonClick = () => {
    setFormVisible(true);
  };

  const handleSubmit = async () => {
    // Validar que los campos obligatorios están presentes
    if (!presupuestoNombre) {
      setError("El nombre del presupuesto es obligatorio.");
      return;
    }

    if (!cliente_id) {
      setError("El cliente es obligatorio.");
      return;
    }

    if (!jefe_proyecto_id) {
      setError("El jefe de proyecto es obligatorio.");
      return;
    }

    // Generar la URL del presupuesto
    const urlPresupuestoGenerada = generarUrlPresupuesto();

    // Preparar los datos a enviar al backend
    const dataToSend = {
      nombre_presupuesto: presupuestoNombre,
      descripcion_presupuesto: presupuestoDescripcion || null,
      cliente_id,  // Cliente existente
      jefe_proyecto_id, // Jefe de proyecto existente
      fecha: new Date().toISOString(), // Generar la fecha actual
      url_presupuesto: urlPresupuestoGenerada,
      contenido_ids: uniqueContenidos.map(item => item.id).filter(id => id !== undefined),
      informacion_ids: uniqueInformaciones.map(item => item.id).filter(id => id !== undefined),
    };

    console.log("Datos que se enviarán:", dataToSend);

    try {
      const response = await fetch('http://localhost:3000/api/presupuestos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al enviar el presupuesto');
      }

      // Mensaje de éxito
      setSuccess('Presupuesto enviado exitosamente!');
      alert('El presupuesto ha sido enviado al cliente satisfactoriamente');

      // Resetear los estados para limpiar los datos renderizados
      setPresupuestoNombre('');
      setPresupuestoDescripcion('');
      setFormVisible(false);
      setError(null);
      setSuccess(null);
    } catch (error) {
      console.log("Error en el envío del presupuesto:", error.message);
      setError('Error al enviar el presupuesto: ' + error.message);
    }
  };

  return (
    <div className='presupuestos-page'>
      <div className='black-section'>
        <section className='logo-phone'>
          <div className='ms-div-logo'>
            <img
              className='ms-logo'
              src={empresa_url_logo}
              alt='Logo de la Empresa'
            />
          </div>
          <div className='phone'>
            <img
              src='https://www.maquetaciones.pro/presupuesto//wp-content/plugins/gestion-presupesto/includes/images/ico-telefono.png'
              alt='ícono teléfono'
              className='phone-icon'
            />
            <p className='text'>{formatPhoneNumber(empresa_telefono)}</p>
          </div>
        </section>
      </div>

      <section className='cliente-jefeProyecto'>
        {/* Sección Cliente */}
        <div className='cliente-info'>
          <div className='nombre-icon-cliente'>
            <div className='cliente-icon'>
              <img
                src='https://www.maquetaciones.pro/presupuesto//wp-content/plugins/gestion-presupesto/includes/images/ico-info-cliente.png'
                alt='ícono-cliente'
              />
            </div>
            <div className='nombre-cliente'>
              <h3 className='p-nombre'><span className='span-cleinte-jefe'> {cliente_nombre}</span></h3>
            </div>
          </div>
          <div className='text-cliente'>
            <p className="empresa-cliente"><span className='span-cleinte-jefe'>{cliente_empresa_nombre}</span></p>
            <p className='textos-clientes'><strong>Teléfono:</strong> <span className='span-cleinte-jefe'>{formatPhoneNumber(cliente_telefono)}</span></p>
            <p id='email-cliente' className='textos-clientes'><strong>Email:</strong> <span className='span-cleinte-jefe'>{cliente_email}</span></p>
          </div>
        </div>

        {/* Sección Jefe de Proyecto */}
        <section className='jefe-info'>
          <div className='url-nombre-jefeProyectos'>
            <div className='img-jefe-proyecto'>
              <img
                className='url-jefe-proyectos'
                src={jefe_proyecto_foto}
                alt='Foto del Jefe de Proyectos'
              />
            </div>
            <div className='sms-jefe-proyecto'>
              <p className='p-sms-jefe'>
                Hola, {cliente_nombre}! Soy {jefe_proyecto_nombre}. Te he creado una propuesta personalizada, adaptada a tus necesidades.
              </p>
            </div>
          </div>
          <div className='jefe-proyecto'>
            <p id='nombre-jefe' className='texto-jefe'><span className='span-cleinte-jefe'>{jefe_proyecto_nombre}</span></p>
            <p id='texto-cargo-jefe' className='texto-jefe'><span className='span-cleinte-jefe'>{jefe_proyecto_cargo}</span></p>
            <p className='texto-jefe'><strong>Teléfono:</strong><span className='span-cleinte-jefe'>{formatPhoneNumber(jefe_proyecto_telefono)}</span></p>
            <p className='texto-jefe'><strong>Email:</strong> <span className='span-cleinte-jefe'>{jefe_proyecto_email}</span></p>
          </div>
        </section>
      </section>

      <div className='presupuesto-contenedor'>
        <div className='presupuesto-content'>
          {/* Mostrar las secciones del presupuesto */}
          {uniqueContenidos.length > 0 ? (
            uniqueContenidos.map((seccion, index) => (
              <div key={index} className='presupuesto-contenido'>
                {seccion.nombre && <h3 className='h3-presupuesto'>{seccion.nombre}</h3>}
                <h4 className='titulo'>{seccion.titulo || ''}</h4>
                <div dangerouslySetInnerHTML={{ __html: seccion.contenido || '' }} />
              </div>
            ))
          ) : (
            <p className="no-content-message">No hay secciones agregadas al presupuesto aún.</p>
          )}
        </div>

        {/* Formas de pago */}
        <aside className='formas-de-pago'>
          {uniqueInformaciones.length > 0 ? (
            uniqueInformaciones.map((info, index) => (
              <div key={index} className='buho-div'>
                <img className='imgs-aside' src={info.icono_url || ''} alt={`icono-${index}`} />
                <div className='buho-text'>
                  <div dangerouslySetInnerHTML={{ __html: info.contenido || '' }} />
                </div>
              </div>
            ))
          ) : (
            <>
              <div className='buho-div'>
                <img
                  src='https://www.maquetaciones.pro/presupuesto/wp-content/uploads/2024/07/ico-logo.jpg'
                  alt='buho-forma-de-pago'
                  className='imgs-aside'
                />
                <div className='buho-text'>
                  <p>¿Sabes que {empresa_nombre} gestiona más de 50.000€ mensuales en campañas online?</p>
                </div>
              </div>
              <div className='informacion-div'>
                <img
                  src='https://www.maquetaciones.pro/presupuesto/wp-content/uploads/2024/07/ico-info.png'
                  alt='informacion-icono-formas-de-pago'
                  className='imgs-aside'
                />
                <p>Todos nuestros productos y servicios son sin compromiso de permanencia. Los precios mostrados no incluyen IVA 21%. Esta propuesta tiene una validez de 60 días desde la fecha arriba indicada.</p>
              </div>
              <div className='tarjeta-div'>
                <img
                  src='https://www.maquetaciones.pro/presupuesto/wp-content/uploads/2024/07/ico-pago.png'
                  alt='formas de pago'
                  className='imgs-aside'
                />
                <div className='div-formas-de-pago-aceptadas'>
                  <p className='formas-de-pago-aceptadas'>Formas de pago aceptadas:</p>
                  <p>Transferencia Bancaria</p>
                  <p>Domiciliación Bancaria</p>
                </div>
              </div>
            </>
          )}
          <div>
            <label className='checkbox-container'>
              <input type='checkbox' />
              <span className='checkmark'></span>
              Acepto los términos y condiciones
            </label>
          </div>

          <div className='imgs-acepto-la-propuesta'>
            <img
              src={Aceptar}
              alt='img-verde'
            />
            <img
              src={TengoDudas}
              alt='img-azul'
            />
          </div>
        </aside>
      </div>
      <div className='floating-button-container'>
        {!isFormVisible && (
          <button className='floating-button' onClick={handleFloatingButtonClick}>
            Enviar Presupuesto a Cliente
          </button>
        )}

        {isFormVisible && (
          <div className="presupuesto-form">
            <div className='label-input'>
              <label className='label-name'>Nombre del Presupuesto:</label>
              <input
                type="text"
                value={presupuestoNombre}
                onChange={(e) => setPresupuestoNombre(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div className='label-input'>
              <label className='label-description'>Descripción del Presupuesto (Opcional):</label>
              <textarea
                value={presupuestoDescripcion}
                onChange={(e) => setPresupuestoDescripcion(e.target.value)}
                className="input-field"
              />
            </div>

            {error && <p className='error-message'>{error}</p>}

            <div className="form-buttons">
              <button className='submit-button' onClick={handleSubmit}>
                Enviar Presupuesto
              </button>

              <button className='submit-button' onClick={() => setFormVisible(false)}>
                Cancelar
              </button>
            </div>

            {success && <p className='success-message'>{success}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default NuevoPresupuesto;
