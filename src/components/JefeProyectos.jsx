import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './components.css';
import { usePresupuesto } from './PresupuestoContext';

const JefeProyectos = () => {
  const [nombreJefe, setNombreJefe] = useState(localStorage.getItem('nombreJefe') || '');
  const [cargoJefe, setCargoJefe] = useState(localStorage.getItem('cargoJefe') || '');
  const [telefonoJefe, setTelefonoJefe] = useState(localStorage.getItem('telefonoJefe') || '');
  const [emailJefe, setEmailJefe] = useState(localStorage.getItem('emailJefe') || '');
  const [urlJefe, setUrlJefe] = useState(localStorage.getItem('urlJefe') || '');
  const [jefesProyectos, setJefesProyectos] = useState([]);
  const [filteredJefes, setFilteredJefes] = useState([]); // Estado para jefes filtrados
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const [selectedJefeId, setSelectedJefeId] = useState(null); // Estado para el ID del jefe seleccionado
  const navigate = useNavigate();
  const { setDatosPresupuesto } = usePresupuesto();

  // Comprobar si el usuario ha iniciado sesión
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      handleGetJefesProyectos(); // Ejecutar GET al montar el componente si el usuario está logueado
    }
  }, []);

  const handleCreateJefeProyecto = async () => {
    if (!nombreJefe) {
      alert("El nombre del jefe de proyecto es obligatorio.");
      return;
    }
    if (!cargoJefe) {
      alert("El cargo es obligatorio.");
      return;
    }
    if (!telefonoJefe || !/^\d+$/.test(telefonoJefe)) {
      alert("Ingrese un número de teléfono válido.");
      return;
    }
    if (!emailJefe || !/\S+@\S+\.\S+/.test(emailJefe)) {
      alert("Ingrese un correo electrónico válido.");
      return;
    }
    if (!urlJefe) {
      alert("La URL de la foto es obligatoria.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/jefes-proyectos', {
        nombreJefe,
        cargoJefe,
        telefonoJefe,
        emailJefe,
        urlJefe,
      });

      if (response.status === 201) {
        alert("Jefe de proyecto creado exitosamente.");
        resetFields();
        handleGetJefesProyectos();
      }
    } catch (error) {
      console.error("Error al crear jefe de proyecto:", error);
      alert("Hubo un error al crear el jefe de proyecto.");
    }
  };

  const handleGetJefesProyectos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/jefes-proyectos');
      console.log("Respuesta del servidor:", response.data);

      if (response.data && Array.isArray(response.data.data)) {
        setJefesProyectos(response.data.data);
        setFilteredJefes(response.data.data); // Inicializa los jefes filtrados
      } else {
        console.error("La estructura de datos no es la esperada:", response.data);
        alert("No se encontraron jefes de proyecto.");
      }
    } catch (error) {
      console.error("Error al obtener jefes de proyectos:", error);
      alert("Hubo un error al obtener los jefes de proyecto.");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = jefesProyectos.filter(jefe =>
      jefe.nombreJefe.toLowerCase().includes(term) || jefe.id.toString().includes(term)
    );

    setFilteredJefes(filtered);
  };

  const handleVisualizar = (index) => {
    const selectedJefe = filteredJefes[index];
    setDatosPresupuesto(prevState => ({
      ...prevState,
      jefeProyectos: {
        id: selectedJefe.id,
        nombre: selectedJefe.nombreJefe,
        telefono: selectedJefe.telefonoJefe,
        email: selectedJefe.emailJefe,
        cargo: selectedJefe.cargoJefe,
        urlFotoJefe: selectedJefe.urlJefe,
      }
    }));
    navigate('/presupuesto/presupuestos');
  };

  const handleEditar = (jefe) => {
    setNombreJefe(jefe.nombreJefe);
    setCargoJefe(jefe.cargoJefe);
    setTelefonoJefe(jefe.telefonoJefe);
    setEmailJefe(jefe.emailJefe);
    setUrlJefe(jefe.urlJefe);
    setSelectedJefeId(jefe.id); // Almacena el ID del jefe seleccionado
  };

  const handleUpdateJefeProyecto = async () => {
    if (!nombreJefe) {
      alert("El nombre del jefe de proyecto es obligatorio.");
      return;
    }
    if (!cargoJefe) {
      alert("El cargo es obligatorio.");
      return;
    }
    if (!telefonoJefe || !/^\d+$/.test(telefonoJefe)) {
      alert("Ingrese un número de teléfono válido.");
      return;
    }
    if (!emailJefe || !/\S+@\S+\.\S+/.test(emailJefe)) {
      alert("Ingrese un correo electrónico válido.");
      return;
    }
    if (!urlJefe) {
      alert("La URL de la foto es obligatoria.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3000/api/jefes-proyectos/${selectedJefeId}`, {
        nombreJefe,
        cargoJefe,
        telefonoJefe,
        emailJefe,
        urlJefe,
      });

      if (response.status === 200) {
        alert("Jefe de proyecto actualizado exitosamente.");
        resetFields();
        handleGetJefesProyectos();
      }
    } catch (error) {
      console.error("Error al actualizar jefe de proyecto:", error);
      alert("Hubo un error al actualizar el jefe de proyecto.");
    }
  };

  const handleEliminarJefeProyecto = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este jefe de proyecto?")) {
      return;
    }

    try {
      console.log(`Intentando eliminar jefe de proyecto con ID: ${id}`);
      const response = await axios.delete(`http://localhost:3000/api/jefes-proyectos/${id}`);

      console.log(`Respuesta del servidor al intentar eliminar:`, response);

      if (response.status === 204 || response.status === 200) { // Verifica si es 204 o 200
        alert("Jefe de proyecto eliminado exitosamente.");

        // Actualizar la lista de jefes localmente eliminando el jefe eliminado
        const updatedJefes = jefesProyectos.filter(jefe => jefe.id !== id);
        setJefesProyectos(updatedJefes);
        setFilteredJefes(updatedJefes); // Asegurarse de actualizar también la lista filtrada
      } else {
        console.log(`Error: Estado de respuesta inesperado: ${response.status}`);
        alert("No se pudo eliminar el jefe de proyecto.");
      }
    } catch (error) {
      console.error("Error al eliminar jefe de proyecto:", error);
      alert("Hubo un error al eliminar el jefe de proyecto.");
    }
  };


  const handleDuplicarJefe = (jefe) => {
    // Cargar los datos del jefe en los inputs
    setNombreJefe(jefe.nombreJefe);
    setCargoJefe(jefe.cargoJefe);
    setTelefonoJefe(jefe.telefonoJefe);
    setEmailJefe(jefe.emailJefe);
    setUrlJefe(jefe.urlJefe);

    // Limpiar selectedJefeId para crear un nuevo jefe
    setSelectedJefeId(null);
  };

  // Verificar si hay datos en algún input
  const isAnyInputFilled = nombreJefe || cargoJefe || telefonoJefe || emailJefe || urlJefe;

  // Función para limpiar los campos
  const resetFields = () => {
    setNombreJefe('');
    setCargoJefe('');
    setTelefonoJefe('');
    setEmailJefe('');
    setUrlJefe('');
    setSelectedJefeId(null); // Reinicia el ID seleccionado
  };

  useEffect(() => {
    localStorage.setItem('nombreJefe', nombreJefe);
    localStorage.setItem('cargoJefe', cargoJefe);
    localStorage.setItem('telefonoJefe', telefonoJefe);
    localStorage.setItem('emailJefe', emailJefe);
    localStorage.setItem('urlJefe', urlJefe);
  }, [nombreJefe, cargoJefe, telefonoJefe, emailJefe, urlJefe]);

  return (
    <div className="ms-div">
      <h2 className="ms-h2">Crear o Editar Jefe de Proyecto</h2>
      <div className="ms-form">
        <label className="ms-label-name">
          Nombre:
          <input
            type="text"
            placeholder="Ingrese el nombre del jefe de proyecto"
            className="input-field"
            value={nombreJefe}
            onChange={(e) => setNombreJefe(e.target.value)}
          />
        </label>
        <label className="ms-label-name">
          Cargo:
          <input
            type="text"
            placeholder="Ingrese el cargo"
            className="input-field"
            value={cargoJefe}
            onChange={(e) => setCargoJefe(e.target.value)}
          />
        </label>
        <label className="ms-label-name">
          Teléfono:
          <input
            type="tel"
            placeholder="Ingrese el teléfono"
            className="input-field"
            value={telefonoJefe}
            onChange={(e) => setTelefonoJefe(e.target.value)}
          />
        </label>
        <label className="ms-label-name">
          Email:
          <input
            type="email"
            placeholder="Ingrese el email"
            className="input-field"
            value={emailJefe}
            onChange={(e) => setEmailJefe(e.target.value)}
          />
        </label>
        <label className="ms-label-name">
          URL de Foto:
          <input
            type="text"
            placeholder="Ingrese la URL de la foto"
            className="input-field"
            value={urlJefe}
            onChange={(e) => setUrlJefe(e.target.value)}
          />
        </label>

        <div className="ms-div-button">
          {selectedJefeId ? (
            <button className="ms-button" onClick={handleUpdateJefeProyecto}>
              Actualizar
            </button>
          ) : (
            <button className="ms-button" onClick={handleCreateJefeProyecto}>
              Guardar
            </button>
          )}
          {/* Mostrar botón "Cancelar" solo si algún input está lleno */}
          {isAnyInputFilled && (
            <button className="ms-button ms-button-cancel" onClick={resetFields}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <h2 className="ms-h2">Registro de Jefes de Proyecto</h2>
      <div className='search-table-div' id="search-table-jefe-div">
      <input
        type="text"
        placeholder="Buscar por nombre o ID"
        value={searchTerm}
        onChange={handleSearch}
        className="ms-search"
        id="search-jefeProyectos"
      />

      {/* Tabla de jefes de proyecto */}
      {filteredJefes.length > 0 ? (
        <table className="ms-table-info" id="jefes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Cargo</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Foto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredJefes.map((jefe) => (
              <tr key={jefe.id} className='tr-info'>
                <td>{jefe.id}</td>
                <td>{jefe.nombreJefe}</td>
                <td>{jefe.cargoJefe}</td>
                <td>{jefe.telefonoJefe}</td>
                <td>{jefe.emailJefe}</td>
                <td>
                  {jefe.urlJefe ? (
                    <img
                      src={jefe.urlJefe}
                      alt={`${jefe.nombreJefe}'s foto`}
                      className="jefe-foto"

                    />
                  ) : (
                    <div>No disponible</div>
                  )}
                </td>
                <td className='td-buttons' id="buttons-jefe">
                  <button
                    type="button"
                    className="ms-button-section"
                    onClick={() => handleEditar(jefe)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="ms-button-section"
                    onClick={() => handleEliminarJefeProyecto(jefe.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    type="button"
                    className="ms-button-section"
                    onClick={() => handleDuplicarJefe(jefe)} // Nuevo botón para duplicar
                  >
                    Duplicar
                  </button>
                  <button
                    type="button"
                    className="ms-button-section"
                    onClick={() => handleVisualizar(filteredJefes.indexOf(jefe))}
                  >
                    Visualizar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron resultados para la búsqueda.</p>
      )}
    </div>
    </div>
  );
};

export default JefeProyectos;

