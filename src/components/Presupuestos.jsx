import React, { useState, useEffect } from 'react';
import { usePresupuesto } from './PresupuestoContext';
import './Presupuestos.css';
import Aceptar from "../assets/aceptar.png";
import TengoDudas from "../assets/tengoDudas.png";

function Presupuestos() {
  const { datosPresupuesto } = usePresupuesto();

  // Estado para manejar el spinner de carga
  const [isLoading, setIsLoading] = useState(false);

  // Realiza un scroll a la parte superior cada vez que se renderice el componente
  useEffect(() => {
    window.scrollTo(0, 0); // Desplaza el scroll a la parte superior
  }, []);

  const {
    nombrePresupuesto = 'Sin nombre',
    descripcionPresupuesto = 'Sin descripción',
    cliente = {},
    empresa = {},
    jefeProyectos = {},
    contenidoPresupuesto = [],
    informacion = [],
    url_presupuesto = ''
  } = datosPresupuesto || {};

  const {
    id: idCliente = "",
    nombre: nombreCliente = 'No especificado',
    empresa: empresaCliente = 'No especificado',
    telefono: telefonoCliente = 'No especificado',
    email: emailCliente = 'No especificado',
  } = cliente;

  const {
    id: idEmpresa = "",
    nombre: nombreEmpresa = 'No especificado',
    telefono: telefonoEmpresa = 'No especificado',
    url: urlEmpresa = 'https://www.seomalaga.com',
    urlLogo: urlLogoEmpresa = 'No especificado',
  } = empresa;

  const {
    id: idJefeProyecto = "",
    nombre: nombreJefe = 'No especificado',
    telefono: telefonoJefe = 'No especificado',
    email: emailJefe = 'No especificado',
    cargo: cargoJefe = 'No especificado',
    urlFotoJefe: urlJefe = 'https://img.freepik.com/foto-gratis/retrato-mujer-casual-sonriente_171337-4168.jpg',
  } = jefeProyectos;

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false); // Mostrar el formulario al hacer clic
  const [presupuestoNombre, setPresupuestoNombre] = useState('');
  const [presupuestoDescripcion, setPresupuestoDescripcion] = useState('');

  // Función para generar una URL única
  const generarUrlPresupuesto = () => {
    const baseURL = "https://www.mipresupuesto.com/presupuesto";
    const uniqueId = Math.random().toString(36).substr(2, 9); // Genera un identificador único
    return `${baseURL}/${uniqueId}`;
  };

  // Función para formatear números de teléfono con un espacio cada 3 dígitos
  const formatPhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Manejar el click del botón de enviar presupuesto
  const handleFloatingButtonClick = () => {
    setFormVisible(true); // Mostrar los inputs
  };

  const handleSubmit = async () => {
    if (!presupuestoNombre) {
      setError("El nombre del presupuesto es obligatorio.");
      return;
    }

    setIsLoading(true); // Inicia el spinner

    // Generar la URL del presupuesto
    const urlPresupuestoGenerada = generarUrlPresupuesto();

    // Preparar los datos a enviar al backend
    const dataToSend = {
      nombre_presupuesto: presupuestoNombre,
      descripcion_presupuesto: presupuestoDescripcion || null,
      cliente_id: idCliente || null,
      empresa_id: idEmpresa || null,
      jefe_proyecto_id: idJefeProyecto || null,
      fecha: new Date().toISOString(),
      url_presupuesto: urlPresupuestoGenerada,
      contenido_ids: contenidoPresupuesto.map(item => item.id).filter(id => id !== undefined),
      informacion_ids: informacion.map(item => item.id).filter(id => id !== undefined),
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

    setIsLoading(false); // Detén el spinner al finalizar
  };

  return (
    <div className='presupuestos-page'>
      <div className='black-section'>
        <section className='logo-phone'>
          <div className='ms-div-logo'>
            <img
              className='ms-logo'
              src={urlLogoEmpresa || 'https://www.seomalaga.com/wp-content/uploads/2023/04/seomalaga-agencia-marketing-logo.png'}
              alt='Logo de la Empresa'
            />
          </div>
          <div className='phone'>
            <img
              src='https://www.maquetaciones.pro/presupuesto//wp-content/plugins/gestion-presupesto/includes/images/ico-telefono.png'
              alt='ícono teléfono'
              className='phone-icon'
            />
            <p className='text'>{formatPhoneNumber(telefonoEmpresa) || '670 607 006'}</p>
          </div>
        </section>
      </div>

      {/* Mostrar el spinner si está cargando */}
      {isLoading && <div className="spinner">Enviando presupuesto...</div>}

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
              <h3 className='p-nombre'><span className='span-cleinte-jefe'> {nombreCliente}</span></h3>

            </div>
          </div>
          <div className='text-cliente'>
            <p className="empresa-cliente" ><span className='span-cleinte-jefe'>{empresaCliente}</span></p>
            <p className='textos-clientes'><strong>Teléfono:</strong> <span className='span-cleinte-jefe'>{formatPhoneNumber(telefonoCliente)} </span></p>
            <p id='email-cliente' className='textos-clientes'><strong>Email:</strong> <span className='span-cleinte-jefe'>{emailCliente}</span></p>
          </div>
        </div>

        {/* Sección Jefe de Proyecto */}
        <section className='jefe-info'>
          <div className='url-nombre-jefeProyectos'>
            <div className='img-jefe-proyecto'>
              <img
                className='url-jefe-proyectos'
                src={urlJefe}
                alt='Foto del Jefe de Proyectos'
              />
            </div>
            <div className='sms-jefe-proyecto'>
              <p className='p-sms-jefe'>
                Hola, {nombreCliente || '{Ingrese Nombre Cliente}'}! Soy {nombreJefe || '{Inserte el nombre del jefe de proyecto}'}.
                Te he creado una propuesta personalizada, adaptada a tus necesidades.

              </p>
            </div>
          </div>
          <div className='jefe-proyecto'>
            <p id='nombre-jefe' className='texto-jefe'><span className='span-cleinte-jefe'>{nombreJefe} </span></p>
            <p id='texto-cargo-jefe' className='texto-jefe'><span className='span-cleinte-jefe'>{cargoJefe || '{Cargo Jefe de Proyectos}'} </span></p>
            <p className='texto-jefe'><strong>Teléfono:</strong><span className='span-cleinte-jefe'>{formatPhoneNumber(telefonoJefe)}</span> </p>
            <p className='texto-jefe'><strong>Email:</strong> <span className='span-cleinte-jefe'>{emailJefe} </span></p>

          </div>
        </section>
      </section>

      <div className='presupuesto-contenedor'>
        <div className='presupuesto-content'>
          {/* Mostrar las secciones del presupuesto */}
          {contenidoPresupuesto.length > 0 ? (
            contenidoPresupuesto.map((seccion, index) => (
              <div key={index} className='presupuesto-contenido'>
                {/* Renderizar solo si seccion.nombre tiene un valor */}
                {seccion.nombre && <h3 className='h3-presupuesto'>{seccion.nombre}</h3>}
                <h4 className='titulo'>{seccion.titulo || ''}</h4>
                {/* Renderizar el contenido en HTML */}
                <div dangerouslySetInnerHTML={{ __html: seccion.contenido || '' }} />
              </div>
            ))
          ) : (
            <p className="no-content-message">No hay secciones agregadas al presupuesto aún.</p>
          )}
        </div>


        {/* Formas de pago */}
        <aside className='formas-de-pago'>
          {informacion.length > 0 ? (
            informacion.map((info, index) => (
              <div key={index} className='buho-div'>
                <img className='imgs-aside' src={info.icono_url || ''} alt={`icono-${index}`} />
                <div className='buho-text'>
                  {/* Renderizar el contenido en HTML */}
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
                  <p>
                    ¿Sabes que {nombreEmpresa} gestiona más de 50.000€ mensuales en campañas online?
                  </p>
                </div>
              </div>

              <div className='informacion-div'>
                <img
                  src='https://www.maquetaciones.pro/presupuesto/wp-content/uploads/2024/07/ico-info.png'
                  alt='informacion-icono-formas-de-pago'
                  className='imgs-aside'
                />
                <p>
                  Todos nuestros productos y servicios son sin compromiso de permanencia. Los precios mostrados no incluyen IVA 21%. Esta propuesta tiene una validez de 60 días desde la fecha arriba indicada.
                </p>
              </div>
              <div className='tarjeta-div'>
                <img
                  src='https://www.maquetaciones.pro/presupuesto/wp-content/uploads/2024/07/ico-pago.png'
                  alt='formas de pago'
                  className='imgs-aside'
                />
                <div className='div-formas-de-pago-aceptadas'>
                  <p id='formas-de-pago-aceptadas'>Formas de pago aceptadas:</p>
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
              <label className='label-name'>
                Nombre del Presupuesto:
              </label>
              <input
                type="text"
                value={presupuestoNombre}
                onChange={(e) => setPresupuestoNombre(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div className='label-input'>
              <label className='label-description'>
                Descripción del Presupuesto (Opcional):
              </label>
              <textarea
                value={presupuestoDescripcion}
                onChange={(e) => setPresupuestoDescripcion(e.target.value)}
                className="input-field"
              />
            </div>

            {error && <p className='error-message'>{error}</p>}

            <div className="form-buttons">
              <button className='submit-button' onClick={handleSubmit}>
                {isLoading ? 'Enviando...' : 'Enviar Presupuesto'}
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

export default Presupuestos;
