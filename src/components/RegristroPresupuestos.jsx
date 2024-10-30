import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegistroPresupuestos.css';

const RegistroPresupuesto = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [filteredPresupuestos, setFilteredPresupuestos] = useState([]); // Estado para almacenar los presupuestos filtrados
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newCliente, setNewCliente] = useState({ nombre: '', empresa_nombre: '', telefono: '', email: '' });
  const [newJefeProyecto, setNewJefeProyecto] = useState({ nombre: '', cargo: '', telefono: '', email: '', foto_url: '' });
  const [showClienteForm, setShowClienteForm] = useState(false);
  const [showJefeProyectoForm, setShowJefeProyectoForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Estado para almacenar la consulta de búsqueda
  const [userRole, setUserRole] = useState(''); // Estado para el rol del usuario

  const navigate = useNavigate();

  // Obtener los presupuestos desde el backend
  const fetchPresupuestos = async () => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userRole'); // Obtener el rol del usuario desde el localStorage
      setUserRole(role);

      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:3000/api/presupuestos', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setPresupuestos(response.data.data);
        setFilteredPresupuestos(response.data.data); // Inicializar con todos los presupuestos
      } else {
        setErrorMessage('Error al obtener los presupuestos');
      }
    } catch (error) {
      setErrorMessage('Error al conectar con el servidor: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Crear un nuevo cliente si se han proporcionado datos
  const handleCreateCliente = async () => {
    if (
      newCliente.nombre.trim() === '' ||
      newCliente.empresa_nombre.trim() === '' ||
      newCliente.telefono.trim() === '' ||
      newCliente.email.trim() === ''
    ) {
      alert('Todos los campos del cliente son requeridos.');
      return null;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post('http://localhost:3000/api/clientes', newCliente, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (response.status === 201) {
        return response.data.data.id;
      } else {
        setErrorMessage('Error al crear el cliente');
        return null;
      }
    } catch (error) {
      setErrorMessage('Error al crear el cliente: ' + error.message);
      return null;
    }
  };

  // Crear un nuevo jefe de proyectos si se han proporcionado datos
  const handleCreateJefeProyecto = async () => {
    if (
      newJefeProyecto.nombre.trim() === '' ||
      newJefeProyecto.cargo.trim() === '' ||
      newJefeProyecto.telefono.trim() === '' ||
      newJefeProyecto.email.trim() === '' ||
      newJefeProyecto.foto_url.trim() === ''
    ) {
      alert('Todos los campos del jefe de proyectos son requeridos.');
      return null;
    }

    const jefeProyectoPayload = {
      nombreJefe: newJefeProyecto.nombre,
      cargoJefe: newJefeProyecto.cargo,
      telefonoJefe: newJefeProyecto.telefono,
      emailJefe: newJefeProyecto.email,
      urlJefe: newJefeProyecto.foto_url,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post('http://localhost:3000/api/jefes-proyectos', jefeProyectoPayload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (response.status === 201) {
        alert('Jefe de proyecto creado exitosamente.');
        return response.data.data.id;
      } else {
        setErrorMessage('Error al crear el jefe de proyectos');
        return null;
      }
    } catch (error) {
      setErrorMessage('Error al crear el jefe de proyectos: ' + error.message);
      return null;
    }
  };

  // Manejo de duplicación de presupuestos
  const handleDuplicatePresupuesto = async (index) => {
    const presupuesto = presupuestos[index];
    try {
      let newClienteId = presupuesto.cliente_id;
      let newJefeProyectoId = presupuesto.jefe_proyecto_id;

      // Crear un nuevo cliente si se ha seleccionado
      if (
        showClienteForm &&
        (newCliente.nombre.trim() ||
          newCliente.empresa_nombre.trim() ||
          newCliente.telefono.trim() ||
          newCliente.email.trim())
      ) {
        newClienteId = await handleCreateCliente();
        if (!newClienteId) {
          setErrorMessage('Error: No se pudo crear un nuevo cliente. Revisa los datos ingresados.');
          return;
        }
      }

      // Crear un nuevo jefe de proyectos si se ha seleccionado
      if (
        showJefeProyectoForm &&
        (newJefeProyecto.nombre.trim() ||
          newJefeProyecto.cargo.trim() ||
          newJefeProyecto.telefono.trim() ||
          newJefeProyecto.email.trim() ||
          newJefeProyecto.foto_url.trim())
      ) {
        newJefeProyectoId = await handleCreateJefeProyecto();
        if (!newJefeProyectoId) {
          setErrorMessage('Error: No se pudo crear un nuevo jefe de proyectos. Revisa los datos ingresados.');
          return;
        }
      }

      // Preparar los datos del presupuesto para duplicación
      const uniqueContenidos = [...new Map(presupuesto.contenidos.map((item) => [item.id, item])).values()];
      const uniqueInformaciones = [...new Map(presupuesto.informaciones.map((item) => [item.id, item])).values()];

      const newPresupuesto = {
        ...presupuesto,
        cliente_id: newClienteId || presupuesto.cliente_id,
        jefe_proyecto_id: newJefeProyectoId || presupuesto.jefe_proyecto_id,
        cliente_nombre: showClienteForm ? newCliente.nombre : presupuesto.cliente_nombre,
        cliente_empresa_nombre: showClienteForm ? newCliente.empresa_nombre : presupuesto.cliente_empresa_nombre,
        cliente_telefono: showClienteForm ? newCliente.telefono : presupuesto.cliente_telefono,
        cliente_email: showClienteForm ? newCliente.email : presupuesto.cliente_email,
        jefe_proyecto_nombre: showJefeProyectoForm ? newJefeProyecto.nombre : presupuesto.jefe_proyecto_nombre,
        jefe_proyecto_cargo: showJefeProyectoForm ? newJefeProyecto.cargo : presupuesto.jefe_proyecto_cargo,
        jefe_proyecto_telefono: showJefeProyectoForm ? newJefeProyecto.telefono : presupuesto.jefe_proyecto_telefono,
        jefe_proyecto_email: showJefeProyectoForm ? newJefeProyecto.email : presupuesto.jefe_proyecto_email,
        jefe_proyecto_foto_url: showJefeProyectoForm ? newJefeProyecto.foto_url : presupuesto.jefe_proyecto_foto_url,
        contenidos: uniqueContenidos,
        informaciones: uniqueInformaciones,
      };

      navigate('/presupuesto/nuevoPresupuesto', { state: { presupuesto: newPresupuesto, editable: true } });
      setEditingIndex(null); // Limpiar el índice de edición
    } catch (error) {
      console.error('Error al duplicar el presupuesto:', error.message);
      setErrorMessage('Error al duplicar el presupuesto: ' + error.message);
    }
  };

 // Lógica para eliminar presupuesto
const handleDeletePresupuesto = async (id) => {
  const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este presupuesto?');
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`http://localhost:3000/api/presupuestos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Verificamos que la respuesta fue exitosa
    if (response.status === 200 || response.status === 204) {
      // Actualizamos el estado de manera atómica con el estado anterior
      setPresupuestos((prevPresupuestos) =>
        prevPresupuestos.filter((presupuesto) => presupuesto.id !== id)
      );
      setFilteredPresupuestos((prevFilteredPresupuestos) =>
        prevFilteredPresupuestos.filter((presupuesto) => presupuesto.id !== id)
      );

      alert('Presupuesto eliminado exitosamente.');
    } else {
      setErrorMessage(`Error al eliminar el presupuesto: Código de estado ${response.status}`);
    }
  } catch (error) {
    console.error('Error al eliminar el presupuesto:', error);
    setErrorMessage('Error al eliminar el presupuesto: ' + (error.response?.data?.message || error.message));
  }
};


  // Filtrar presupuestos según la búsqueda por ID o nombre de cliente
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);

    const filtered = presupuestos.filter((presupuesto) => {
      return (
        presupuesto.id.toString().includes(value) ||
        presupuesto.cliente_nombre.toLowerCase().includes(value)
      );
    });

    setFilteredPresupuestos(filtered);
  };

  // Función para formatear la fecha
  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  useEffect(() => {
    fetchPresupuestos();
  }, []);

  if (loading) {
    return <p>Cargando presupuestos...</p>;
  }

  if (errorMessage) {
    return <p style={{ color: 'red' }}>{errorMessage}</p>;
  }

  return (
    <div className='first-div'>
      <div className="h2-search-div">
        <h2 className="h2">Registro de Presupuestos</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por ID o Cliente"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <table className="registro-presupuestos-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Cliente</th>
            <th>Empresa</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredPresupuestos.length > 0 ? (
            filteredPresupuestos.map((presupuesto, index) => (
              <React.Fragment key={presupuesto.id}>
                <tr>
                  <td>{presupuesto.id}</td>
                  <td>{presupuesto.nombre_presupuesto}</td>
                  <td>{presupuesto.descripcion_presupuesto || 'Sin descripción'}</td>
                  <td>
                    <strong className='p-elements'>{presupuesto.cliente_nombre}</strong>
                    <br />
                    <span className='p-elements'> {presupuesto.cliente_telefono || 'N/A'}</span>
                    <br />
                    <span className='p-elements'> {presupuesto.cliente_email || 'N/A'}</span>
                    <br />
                    <span className='p-elements'>{presupuesto.cliente_empresa_nombre || 'N/A'}</span>
                  </td>
                  <td>
                    <strong className='p-elements'>{presupuesto.empresa_nombre}</strong>
                    <br />
                    <span className='p-elements'> {presupuesto.empresa_telefono || 'N/A'}</span>
                    <br />
                    <span> {presupuesto.empresa_url_empresa}</span>
                    <br />
                    <span className='p-elements'>
                      <img
                        src={presupuesto.empresa_url_logo}
                        alt="Logo de la empresa"
                        style={{ maxHeight: '30px' }}
                      />
                    </span >
                  </td>
                  <td>{formatFecha(presupuesto.fecha)}</td>
                  <td>
                    <div className='buttons-regitro'>
                    <button className="button"onClick={() => setEditingIndex(index)}>Duplicar</button>
                    {/* Mostrar botón de eliminar solo si el usuario es "boss" */}
                    {userRole === 'boss' && (
                      <button className="button" onClick={() => handleDeletePresupuesto(presupuesto.id)}>Eliminar</button>
                    )}
                    </div>

                  </td>
                </tr>

                {editingIndex === index && (
                  <tr>
                    <td colSpan="7">
                      <div className="duplicar-presupuesto-container">
                        <div className="duplicar-form-container">
                          {/* Cuadro de Cliente */}
                          <div className="duplicar-card">
                            <label className="check-cliente">
                              <input
                                className="input-check"
                                type="checkbox"
                                checked={showClienteForm}
                                onChange={(e) => setShowClienteForm(e.target.checked)}
                              />
                              ¿Crear nuevo cliente?
                            </label>

                            {showClienteForm && (
                              <>
                                <h4>Crear Cliente</h4>
                                <div className="formulario-presupuesto">
                                  <label className="formulario-label-cliente">Nombre del cliente:</label>
                                  <input
                                    type="text"
                                    className="formulario-input-cliente"
                                    value={newCliente.nombre}
                                    onChange={(e) => setNewCliente({ ...newCliente, nombre: e.target.value })}
                                  />
                                  <label className="formulario-label-cliente">Empresa del cliente:</label>
                                  <input
                                    type="text"
                                    className="formulario-input-cliente"
                                    value={newCliente.empresa_nombre}
                                    onChange={(e) => setNewCliente({ ...newCliente, empresa_nombre: e.target.value })}
                                  />
                                  <label className="formulario-label-cliente">Teléfono del cliente:</label>
                                  <input
                                    type="text"
                                    className="formulario-input-cliente"
                                    value={newCliente.telefono}
                                    onChange={(e) => setNewCliente({ ...newCliente, telefono: e.target.value })}
                                  />
                                  <label className="formulario-label-cliente">Email del cliente:</label>
                                  <input
                                    type="email"
                                    className="formulario-input-cliente"
                                    value={newCliente.email}
                                    onChange={(e) => setNewCliente({ ...newCliente, email: e.target.value })}
                                  />
                                </div>
                              </>
                            )}
                          </div>

                          {/* Cuadro de Jefe de Proyectos */}
                          <div className="duplicar-card">
                            <label className="check-jefe">
                              <input
                                className="input-check"
                                type="checkbox"
                                checked={showJefeProyectoForm}
                                onChange={(e) => setShowJefeProyectoForm(e.target.checked)}
                              />
                              ¿Crear nuevo jefe de proyectos?
                            </label>

                            {showJefeProyectoForm && (
                              <>
                                <h4>Crear Jefe de Proyectos</h4>
                                <div className="formulario-presupuesto">
                                  <label className="formulario-label-jefe">Nombre del Jefe de Proyectos:</label>
                                  <input
                                    type="text"
                                    className="formulario-input-jefe"
                                    value={newJefeProyecto.nombre}
                                    onChange={(e) => setNewJefeProyecto({ ...newJefeProyecto, nombre: e.target.value })}
                                  />
                                  <label className="formulario-label-jefe">Cargo del Jefe de Proyectos:</label>
                                  <input
                                    type="text"
                                    className="formulario-input-jefe"
                                    value={newJefeProyecto.cargo}
                                    onChange={(e) => setNewJefeProyecto({ ...newJefeProyecto, cargo: e.target.value })}
                                  />
                                  <label className="formulario-label-jefe">Teléfono del Jefe de Proyectos:</label>
                                  <input
                                    type="text"
                                    className="formulario-input-jefe"
                                    value={newJefeProyecto.telefono}
                                    onChange={(e) => setNewJefeProyecto({ ...newJefeProyecto, telefono: e.target.value })}
                                  />
                                  <label className="formulario-label-jefe">Email del Jefe de Proyectos:</label>
                                  <input
                                    type="email"
                                    className="formulario-input-jefe"
                                    value={newJefeProyecto.email}
                                    onChange={(e) => setNewJefeProyecto({ ...newJefeProyecto, email: e.target.value })}
                                  />
                                  <label className="formulario-label-jefe">URL de la Foto del Jefe de Proyectos:</label>
                                  <input
                                    type="text"
                                    className="formulario-input-jefe"
                                    value={newJefeProyecto.foto_url}
                                    onChange={(e) => setNewJefeProyecto({ ...newJefeProyecto, foto_url: e.target.value })}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="formulario-buttons-div">
                          <button className="formulario-button" onClick={() => handleDuplicatePresupuesto(index)}>
                            Visualizar en Presupuesto
                          </button>
                          <button className="formulario-button cancelar" onClick={() => setEditingIndex(null)}>
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay presupuestos registrados aún.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RegistroPresupuesto;
