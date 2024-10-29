import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './components.css';
import { usePresupuesto } from './PresupuestoContext';

const Clientes = () => {
  const [nombreCliente, setNombreCliente] = useState('');
  const [empresaCliente, setEmpresaCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [emailCliente, setEmailCliente] = useState('');
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null); // Estado para el ID del cliente en edición
  const navigate = useNavigate();
  const { setDatosPresupuesto } = usePresupuesto();

  // Función para manejar la creación de un cliente
  const handleCreateCliente = async () => {
    if (!nombreCliente || !empresaCliente || !telefonoCliente || !/^\d+$/.test(telefonoCliente) || !/\S+@\S+\.\S+/.test(emailCliente)) {
      alert('Por favor, complete todos los campos con información válida.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/clientes', {
        nombre: nombreCliente,
        empresa_nombre: empresaCliente,
        telefono: telefonoCliente,
        email: emailCliente,
      });

      if (response.status === 201) {
        alert('Cliente creado exitosamente.');
        resetFields(); // Limpiar campos
        handleGetClientes(); // Obtener la lista de clientes nuevamente
      }
    } catch (error) {
      console.error('Error al crear cliente:', error);
      alert('Hubo un error al crear el cliente.');
    }
  };

  // Función para obtener todos los clientes
  const handleGetClientes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/clientes');
      if (response.data && Array.isArray(response.data.data)) {
        setClientes(response.data.data);
        setFilteredClientes(response.data.data);
      } else {
        alert('No se encontraron clientes.');
      }
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      alert('Hubo un error al obtener los clientes.');
    }
  };

  // Función para manejar la visualización de un cliente
  const handleVisualizar = (index) => {
    const selectedCliente = filteredClientes[index];
    setDatosPresupuesto(prevState => ({
      ...prevState,
      cliente: {
        id: selectedCliente.id,
        nombre: selectedCliente.nombre,
        empresa: selectedCliente.empresa_nombre,
        telefono: selectedCliente.telefono,
        email: selectedCliente.email,
      },
    }));
    navigate('/presupuesto/presupuestos');
  };

  // Manejar el término de búsqueda
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(term) || cliente.id.toString().includes(term)
    );
    setFilteredClientes(filtered);
  };

  // Función para manejar la actualización de un cliente
  const handleUpdateCliente = async (id) => {
    if (!nombreCliente || !empresaCliente || !telefonoCliente || !/^\d+$/.test(telefonoCliente) || !/\S+@\S+\.\S+/.test(emailCliente)) {
      alert('Por favor, complete todos los campos con información válida.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3000/api/clientes/${id}`, {
        nombre: nombreCliente,
        empresa_nombre: empresaCliente,
        telefono: telefonoCliente,
        email: emailCliente,
      });

      if (response.status === 200) {
        alert('Cliente actualizado exitosamente.');
        resetFields();
        handleGetClientes();
        setEditingId(null); // Resetear el ID de edición
      }
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      alert('Hubo un error al actualizar el cliente.');
    }
  };

  // Función para manejar la eliminación de un cliente
  const handleDeleteCliente = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/clientes/${id}`);
        if (response.status === 200) {
          alert('Cliente eliminado exitosamente.');
          handleGetClientes();
        }
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
        alert('Hubo un error al eliminar el cliente.');
      }
    }
  };

  // Función para manejar la duplicación de un cliente
  const handleDuplicarCliente = (cliente) => {
    setNombreCliente(cliente.nombre);
    setEmpresaCliente(cliente.empresa_nombre);
    setTelefonoCliente(cliente.telefono);
    setEmailCliente(cliente.email);
    setEditingId(null); // Limpiar el estado de edición
  };

  // Función para limpiar los campos
  const resetFields = () => {
    setNombreCliente('');
    setEmpresaCliente('');
    setTelefonoCliente('');
    setEmailCliente('');
    setEditingId(null); // Limpiar el estado de edición
  };

  // Verificar si hay datos en algún input
  const isAnyInputFilled = nombreCliente || empresaCliente || telefonoCliente || emailCliente;

  useEffect(() => {
    handleGetClientes();
  }, []);

  return (
    <div className="ms-div">
      <h2 className="ms-h2">Crear Cliente</h2>
      <div className="ms-form">
        <label className="ms-label-name">
          Nombre:
          <input
            type="text"
            placeholder="Ingrese el nombre del cliente"
            className="input-field"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
          />
        </label>
        <label className="ms-label-name">
          Empresa:
          <input
            type="text"
            placeholder="Ingrese la empresa"
            className="input-field"
            value={empresaCliente}
            onChange={(e) => setEmpresaCliente(e.target.value)}
          />
        </label>
        <label className="ms-label-name">
          Teléfono:
          <input
            type="tel"
            placeholder="Ingrese el teléfono"
            className="input-field"
            value={telefonoCliente}
            onChange={(e) => setTelefonoCliente(e.target.value)}
          />
        </label>
        <label className="ms-label-name">
          Email:
          <input
            type="email"
            placeholder="Ingrese el email"
            className="input-field"
            value={emailCliente}
            onChange={(e) => setEmailCliente(e.target.value)}
          />
        </label>

        <div className="ms-div-button">
          <button className="ms-button" onClick={editingId ? () => handleUpdateCliente(editingId) : handleCreateCliente}>
            {editingId ? 'Actualizar' : 'Guardar'}
          </button>
          {/* Mostrar botón "Cancelar" solo si algún input está lleno */}
          {isAnyInputFilled && (
            <button className="ms-button ms-button-cancel" onClick={resetFields}>
              Cancelar
            </button>
          )}
        </div>
      </div>
      <h2 className="ms-h2">Registro de Clientes</h2>

      <div className='search-table-div' id="clientes-search-table-div">
        <input
          type="text"
          placeholder="Buscar por nombre o ID"
          value={searchTerm}
          onChange={handleSearch}
          className="ms-search"
          id="search-clientes"
        />



      {filteredClientes.length > 0 && (
        <table className="ms-table-info" id="clientes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Empresa</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.map((cliente) => (
              <tr key={cliente.id} className="tr-info">
                <td>{cliente.id}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.empresa_nombre}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.email}</td>
                <td className="td-buttons" id="buttons-info">
                  <button
                    type="button"
                    className="ms-button-section"
                    onClick={() => {
                      setNombreCliente(cliente.nombre);
                      setEmpresaCliente(cliente.empresa_nombre);
                      setTelefonoCliente(cliente.telefono);
                      setEmailCliente(cliente.email);
                      setEditingId(cliente.id); // Establecer el ID del cliente en edición
                    }}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="ms-button-section"
                    onClick={() => handleDeleteCliente(cliente.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    type="button"
                    className="ms-button-section"
                    onClick={() => handleDuplicarCliente(cliente)} // Nuevo botón para duplicar
                  >
                    Duplicar
                  </button>
                  <button
                    type="button"
                    className="ms-button-section"
                    onClick={() => handleVisualizar(filteredClientes.indexOf(cliente))}
                  >
                    Visualizar
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

export default Clientes;
