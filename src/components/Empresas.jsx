import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './components.css';
import { usePresupuesto } from './PresupuestoContext';

const Empresas = () => {
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [telefonoEmpresa, setTelefonoEmpresa] = useState('');
  const [urlEmpresa, setUrlEmpresa] = useState('');
  const [urlLogo, setUrlLogo] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [error, setError] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedEmpresaId, setSelectedEmpresaId] = useState(null);
  const navigate = useNavigate();
  const { setDatosPresupuesto } = usePresupuesto();

  const handleGetHistorialEmpresas = async (email) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/empresas?usuario_email=${email}`);
      if (response.data && Array.isArray(response.data.data)) {
        setEmpresas(response.data.data);
      } else {
        alert("No se encontraron empresas.");
      }
    } catch (error) {
      console.error("Error al obtener empresas:", error);
      alert("Hubo un error al obtener las empresas.");
    }
  };

  const obtenerUsuarioLogueado = () => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
      handleGetHistorialEmpresas(storedEmail);
    }
  };

  const filteredEmpresas = empresas.filter((empresa) =>
    empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.id.toString().includes(searchTerm) // Convertimos el ID a string para comparar con el término de búsqueda
  );

  useEffect(() => {
    obtenerUsuarioLogueado();
  }, []);

  const handleCreateOrUpdateEmpresa = async (isUpdate = false) => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    const empresaData = {
      nombre: nombreEmpresa,
      telefono: telefonoEmpresa,
      url_empresa: urlEmpresa,
      url_logo: urlLogo,
      ...(isUpdate && { id: selectedEmpresaId }),
    };

    try {
      const response = isUpdate
        ? await axios.put(`http://localhost:3000/api/empresas/${selectedEmpresaId}`, empresaData)
        : await axios.post('http://localhost:3000/api/empresas', { ...empresaData, usuario_email: userEmail });

      if (response.status === (isUpdate ? 200 : 201)) {
        alert(`Empresa ${isUpdate ? 'actualizada' : 'creada'} exitosamente.`);
        resetForm();
        handleGetHistorialEmpresas(userEmail);
      }
    } catch (error) {
      console.error(`Error al ${isUpdate ? 'actualizar' : 'crear'} la empresa:`, error);
      alert(`Hubo un error al ${isUpdate ? 'actualizar' : 'crear'} la empresa.`);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!nombreEmpresa) errors.nombre = "El nombre de la empresa es obligatorio.";
    if (!telefonoEmpresa || !/^\d+([ ]\d+)*$/.test(telefonoEmpresa)) errors.telefono = "Ingrese un número de teléfono válido.";
    if (!urlEmpresa) errors.url_empresa = "La URL de la empresa es obligatoria.";
    if (!urlLogo) errors.url_logo = "La URL del logo es obligatoria.";
    return errors;
  };

  const resetForm = () => {
    setNombreEmpresa('');
    setTelefonoEmpresa('');
    setUrlEmpresa('');
    setUrlLogo('');
    setError({});
    setSelectedEmpresaId(null);
  };

  const handleVisualizar = (empresa) => {
    setDatosPresupuesto(prevState => ({
      ...prevState,
      empresa: {
        id: empresa.id,
        nombre: empresa.nombre,
        telefono: empresa.telefono,
        urlEmpresa: empresa.url_empresa,
        urlLogo: empresa.url_logo,
      }
    }));
    navigate('/presupuesto/presupuestos');
  };

  const handleEditar = (empresa) => {
    setNombreEmpresa(empresa.nombre);
    setTelefonoEmpresa(empresa.telefono);
    setUrlEmpresa(empresa.url_empresa);
    setUrlLogo(empresa.url_logo);
    setSelectedEmpresaId(empresa.id);
  };

  const handleDuplicar = (empresa) => {
    // Cargar datos en los inputs pero sin actualizar la empresa existente
    setNombreEmpresa(empresa.nombre);
    setTelefonoEmpresa(empresa.telefono);
    setUrlEmpresa(empresa.url_empresa);
    setUrlLogo(empresa.url_logo);
    setSelectedEmpresaId(null); // Limpiar el ID seleccionado para crear un nuevo registro
  };

  const handleEliminar = async (empresaId) => {
    const confirmDelete = window.confirm(`¿Está seguro que desea eliminar la empresa?`);
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/api/empresas/${empresaId}`);
        alert("Empresa eliminada exitosamente.");
        handleGetHistorialEmpresas(userEmail);
      } catch (error) {
        console.error("Error al eliminar la empresa:", error);
        alert("Hubo un error al eliminar la empresa.");
      }
    }
  };

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
  };

  const handlePhoneChange = (e) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setTelefonoEmpresa(formattedValue);
  };

  const formatUrl = (value) => {
    const trimmedValue = value.trim();
    if (trimmedValue.endsWith('.com') && !trimmedValue.startsWith('http')) {
      return `https://www.${trimmedValue}`;
    }
    if (!/^https?:\/\//i.test(trimmedValue)) {
      return `https://${trimmedValue}`;
    }
    return trimmedValue;
  };

  const handleUrlChange = (e) => {
    const formattedUrl = formatUrl(e.target.value);
    setUrlEmpresa(formattedUrl);
  };

  // Verificar si hay datos en algún input
  const isAnyInputFilled = nombreEmpresa || telefonoEmpresa || urlEmpresa || urlLogo;

  return (
    <div className="ms-div">
      <h2 className="ms-h2">Crear Empresa</h2>
      <div className="ms-form">
        <label className="ms-label-name">
          Nombre:
          <input
            type="text"
            placeholder="Ingrese el nombre de la empresa"
            className="input-field"
            value={nombreEmpresa}
            onChange={(e) => setNombreEmpresa(e.target.value)}
          />
        </label>
        {error.nombre && <span className="error-message">{error.nombre}</span>}
        <label className="ms-label-name">
          Teléfono:
          <input
            type="tel"
            placeholder="Ingrese el teléfono de la empresa"
            className="input-field"
            value={telefonoEmpresa}
            onChange={handlePhoneChange}
          />
        </label>
        {error.telefono && <span className="error-message">{error.telefono}</span>}
        <label className="ms-label-name">
          URL:
          <input
            type="url"
            placeholder="Ingrese la URL de la empresa"
            className="input-field"
            value={urlEmpresa}
            onChange={handleUrlChange}
          />
        </label>
        {error.url_empresa && <span className="error-message">{error.url_empresa}</span>}
        <label className="ms-label-name">
          URL del Logo:
          <input
            type="text"
            placeholder="Ingrese la URL del logo"
            className="input-field"
            value={urlLogo}
            onChange={(e) => setUrlLogo(e.target.value)}
          />
        </label>
        {error.url_logo && <span className="error-message">{error.url_logo}</span>}

        <div className="ms-div-button">
          <button className="ms-button" onClick={() => handleCreateOrUpdateEmpresa(!!selectedEmpresaId)}>
            {selectedEmpresaId ? 'Actualizar Empresa' : 'Crear Empresa'}
          </button>
          {/* Mostrar botón "Cancelar" solo si algún input está lleno */}
          {isAnyInputFilled && (
            <button className="ms-button ms-button-cancel" onClick={resetForm}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <h2 className="ms-h2">Registro de Empresas</h2>
      <div className='search-table-div' id="search-empresas-div">
      <input
        type="text"
        placeholder="Buscar empresa"
        className="ms-search" // Class with updated styles
        id="search-empresas"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Tabla de empresas */}
      {filteredEmpresas.length > 0 ? (

          <table className="ms-table-info" id="table-empresas">
            <thead>
              <tr>
                <th>ID</th> {/* Nueva columna para el ID */}
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>URL</th>
                <th>Logo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmpresas.map((empresa) => (
                <tr key={empresa.id} className='tr-info'>
                  <td>{empresa.id}</td> {/* Mostrar ID */}
                  <td>{empresa.nombre}</td>
                  <td>{empresa.telefono}</td>
                  <td>{empresa.url_empresa}</td> {/* Mostrar la URL */}
                  <td>
                    <img src={empresa.url_logo} alt={empresa.nombre} className='img-logo' />
                  </td>
                  <td className='td-buttons' id="buttons-info">
                    <button
                      type="button"
                      className="ms-button-section"
                      onClick={() => handleEditar(empresa)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="ms-button-section"
                      onClick={() => handleEliminar(empresa.id)}
                    >
                      Eliminar
                    </button>
                    <button
                      type="button"
                      className="ms-button-section"
                      onClick={() => handleDuplicar(empresa)}
                    >
                      Duplicar
                    </button>
                    <button
                      type="button"
                      className="ms-button-section"
                      onClick={() => handleVisualizar(empresa)}
                    >
                      Visualizar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

      ) : (
        <p>No hay empresas registradas.</p>
      )}
    </div>
    </div>
  );
};

export default Empresas;
