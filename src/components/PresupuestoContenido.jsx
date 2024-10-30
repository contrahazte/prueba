import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './components.css';
import { usePresupuesto } from './PresupuestoContext';
import { Editor } from '@tinymce/tinymce-react';
import sanitizeHtml from 'sanitize-html';

const ContenidoPresupuesto = () => {
  const [nombre, setNombre] = useState('');
  const [tituloSeccion, setTituloSeccion] = useState('');
  const [contenido, setContenido] = useState('');
  const [secciones, setSecciones] = useState([]);
  const [seccionesFiltradas, setSeccionesFiltradas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedSeccionId, setSelectedSeccionId] = useState(null);
  const navigate = useNavigate();
  const { setDatosPresupuesto } = usePresupuesto();

  const handleGetSecciones = async (email) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/contenido_presupuesto?usuario_email=${email}`);
      if (response.data && Array.isArray(response.data.data)) {
        setSecciones(response.data.data);
      } else {
        alert("No se encontraron secciones.");
      }
    } catch (error) {
      console.error("Error al obtener secciones:", error);
      alert("Hubo un error al obtener las secciones.");
    }
  };

  const obtenerUsuarioLogueado = () => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
      handleGetSecciones(storedEmail);
    }
  };

  const handleCreateOrUpdateSeccion = async () => {
    if (!tituloSeccion || !contenido) {
      alert("Los campos título y contenido son obligatorios.");
      return;
    }

    try {
      // Limpiar el contenido HTML antes de guardarlo
      const cleanContent = sanitizeHtml(contenido, {
        allowedTags: ['b', 'i', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'p', 'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
        allowedAttributes: { a: ['href', 'target'], table: [], thead: [], tbody: [], tr: [], th: [], td: [] },
      });

      const sectionData = {
        nombre: nombre !== '' ? nombre : null,
        titulo: tituloSeccion,
        contenido: cleanContent, // Utiliza el contenido limpio
        usuario_email: userEmail,
      };

      if (selectedSeccionId) {
        await axios.put(`http://localhost:3000/api/contenido_presupuesto/${selectedSeccionId}`, sectionData);
        alert("Sección actualizada exitosamente.");
      } else {
        await axios.post('http://localhost:3000/api/contenido_presupuesto', sectionData);
        alert("Sección creada exitosamente.");
      }

      resetFields();
      handleGetSecciones(userEmail);
    } catch (error) {
      console.error(`Error al ${selectedSeccionId ? 'actualizar' : 'crear'} la sección:`, error);
      alert(`Hubo un error al ${selectedSeccionId ? 'actualizar' : 'crear'} la sección: ${error.response?.data?.message || error.message}`);
    }
  };

  const resetFields = () => {
    setNombre('');
    setTituloSeccion('');
    setContenido('');
    setSelectedSeccionId(null);
  };

  const handleEditarSeccion = (seccion) => {
    setNombre(seccion.nombre);
    setTituloSeccion(seccion.titulo);
    setContenido(seccion.contenido);
    setSelectedSeccionId(seccion.id);
  };

  const handleDuplicarSeccion = (seccion) => {
    setNombre(seccion.nombre);
    setTituloSeccion(seccion.titulo);
    setContenido(seccion.contenido);
    setSelectedSeccionId(null); // Limpiamos el ID para crear una nueva sección en lugar de actualizar
  };

  const handleEliminarSeccion = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta sección?")) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:3000/api/contenido_presupuesto/${id}`);
      if (response.status === 204) {
        alert("Sección eliminada exitosamente.");
        handleGetSecciones(userEmail);
      }
    } catch (error) {
      console.error("Error al eliminar sección:", error);
      alert("Hubo un error al eliminar la sección.");
    }
  };

  const handleAgregarAPresupuesto = (seccion) => {
    setDatosPresupuesto(prevState => ({
      ...prevState,
      contenidoPresupuesto: [
        ...prevState.contenidoPresupuesto,
        {
          id: seccion.id,
          nombre: seccion.nombre,
          titulo: seccion.titulo,
          contenido: seccion.contenido,
        }
      ],
    }));

    alert("Sección agregada al presupuesto.");
    navigate('/presupuesto/presupuestos');
  };

  useEffect(() => {
    obtenerUsuarioLogueado();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = secciones.filter((seccion) =>
        seccion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seccion.id.toString().includes(searchTerm)
      );
      setSeccionesFiltradas(filtered);
    } else {
      setSeccionesFiltradas(secciones);
    }
  }, [searchTerm, secciones]);

  // Verificar si hay datos en algún input para mostrar el botón "Cancelar"
  const isAnyInputFilled = nombre || tituloSeccion || contenido;

  return (
    <div className="ms-div">
      <h2 className="ms-h2">{selectedSeccionId ? 'Editar Sección' : 'Crear Sección'}</h2>
      <div className="ms-form">
        <label className="ms-label-name">
          Nombre:
          <input
            type="text"
            placeholder="Ingrese el nombre (opcional)"
            className="input-field"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </label>
        <label className="ms-label-name">
          Título de Sección:
          <input
            type="text"
            placeholder="Ingrese el título de la sección"
            className="input-field"
            value={tituloSeccion}
            onChange={(e) => setTituloSeccion(e.target.value)}
          />
        </label>
        <label className="ms-label-name">
          Contenido:
          <Editor
            apiKey='9avnbgppnlh9d3elvi43c639ve31c56t2v8h4c9kp3sn4b60'
            value={contenido}
            init={{
              height: 300,
              menubar: true,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
              forced_root_block: 'div',
              content_style: 'p, div, table, th, td { margin: 0; padding: 0; line-height: 1.2em; border-collapse: collapse; }', // Cambia la raíz a 'div' en lugar de 'p'
              remove_linebreaks: true, // Elimina los saltos de línea innecesarios
            }}
            onEditorChange={(content) => setContenido(content)}
          />
        </label>

        <div className="ms-div-button">
          <button className="ms-button" onClick={handleCreateOrUpdateSeccion}>
            {selectedSeccionId ? 'Actualizar Sección' : 'Agregar Sección'}
          </button>
          {isAnyInputFilled && (
            <button className="ms-button ms-button-cancel" onClick={resetFields}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <h2 className="ms-h2"> Contenido en Presupuesto</h2>
      <div className='search-table-contenido-div'>
      <input
        type="text"
        placeholder="Buscar por nombre o ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="ms-search"
        id="search-contenido"
        style={{ marginLeft: '20px', padding: '10px' }}
      />

      {seccionesFiltradas.length > 0 && (
        <table className="ms-table-info" id="table-contenido">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Título</th>
              <th>Contenido</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {seccionesFiltradas.map((seccion) => (
              <tr key={seccion.id}>
                <td>{seccion.id}</td>
                <td>{seccion.nombre}</td>
                <td>{seccion.titulo}</td>
                <td style={{ lineHeight: '1.2em' }}>{sanitizeHtml(seccion.contenido, { allowedTags: [], allowedAttributes: {} })}</td> {/* Renderizado limpio */}
                <td className='td-buttons' id="buttons-info">
                  <button className="ms-button-section" onClick={() => handleEditarSeccion(seccion)}>
                    Editar
                  </button>
                  <button className="ms-button-section" onClick={() => handleEliminarSeccion(seccion.id)}>
                    Eliminar
                  </button>
                  <button className="ms-button-section" onClick={() => handleDuplicarSeccion(seccion)}>
                    Duplicar
                  </button>
                  <button className="ms-button-section" onClick={() => handleAgregarAPresupuesto(seccion)}>
                    Agregar a Presupuesto
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
};

export default ContenidoPresupuesto;