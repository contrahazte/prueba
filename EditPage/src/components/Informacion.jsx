import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { usePresupuesto } from './PresupuestoContext';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import './components.css';

// Iconos para las diferentes secciones
const iconos = [
    { id: 1, url: 'https://www.maquetaciones.pro/presupuesto/wp-content/uploads/2024/07/ico-info.png', label: 'Información' },
    { id: 2, url: 'https://www.maquetaciones.pro/presupuesto/wp-content/uploads/2024/07/ico-logo.jpg', label: 'Búho' },
    { id: 3, url: 'https://www.maquetaciones.pro/presupuesto/wp-content/uploads/2024/07/ico-pago.png', label: 'Formas de Pago' },
];


function Informacion() {
    const { setDatosPresupuesto } = usePresupuesto();
    const [contenido, setContenido] = useState('');
    const [titulo, setTitulo] = useState('');
    const [detalles, setDetalles] = useState([]);
    const [filteredDetalles, setFilteredDetalles] = useState([]);
    const [selectedIcon, setSelectedIcon] = useState(iconos[0]);
    const [editIndex, setEditIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');


    const navigate = useNavigate();
    const API_URL = 'http://localhost:3000/api/informacion';

    // Función para obtener detalles desde la API
    const fetchDetalles = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            if (response.data && Array.isArray(response.data)) {
                setDetalles(response.data);
                setFilteredDetalles(response.data);
            } else {
                console.error('No se encontraron detalles en la respuesta', response.data);
            }
        } catch (error) {
            console.error('Error al obtener detalles:', error);
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchDetalles();
    }, [fetchDetalles]);

    // Función para manejar búsqueda de detalles
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = detalles.filter(detalle =>
            detalle.contenido.toLowerCase().includes(term) ||
            detalle.titulo.toLowerCase().includes(term) ||
            detalle.id.toString().includes(term)
        );

        setFilteredDetalles(filtered);
    };

    // Función para guardar un nuevo detalle
    const handleSaveDetail = async () => {
        if (!contenido.trim() || !titulo.trim()) {
            alert('Por favor, complete los campos de título y contenido antes de guardar un detalle.');
            return;
        }

        const editorInstance = window.tinymce.activeEditor; // Acceder al editor activo
        const plainTextContent = editorInstance.getContent({ format: 'text' }); // Obtener solo el texto plano

        const newDetail = {
            titulo: titulo,
            contenido: plainTextContent, // Guardar solo texto plano
            icono_url: selectedIcon.url,
        };

        setLoading(true);
        try {
            const response = await axios.post(API_URL, newDetail);
            if (response.data) {
                setDetalles(prevDetalles => [response.data, ...prevDetalles]);
                setFilteredDetalles(prevFiltered => [response.data, ...prevFiltered]);
            } else {
                console.error('Error al agregar detalle:', response.data);
            }
        } catch (error) {
            console.error('Error al agregar detalle:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
            resetFields();
        }
    };

    // Función para eliminar un detalle
    const handleDeleteDetail = async (index) => {
        const detalleId = detalles[index].id;

        setLoading(true);
        try {
            // Enviar solicitud de eliminación al servidor
            await axios.delete(`${API_URL}/${detalleId}`);

            // Actualizar el estado local eliminando el detalle
            const updatedDetalles = detalles.filter((_, i) => i !== index);
            setDetalles(updatedDetalles);
            setFilteredDetalles(updatedDetalles.filter(detalle =>
                detalle.contenido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                detalle.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                detalle.id.toString().includes(searchTerm)
            ));
        } catch (error) {
            console.error('Error al eliminar detalle:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };
    const handleEditSection = (index) => {
        const detalle = detalles[index];
        console.log('Detalles al editar:', detalle); // Ver los detalles al editar
        setContenido(detalle.contenido);
        setTitulo(detalle.titulo);

        const iconoEncontrado = iconos.find(icon => icon.url === detalle.icono_url);
        console.log('Icono encontrado al editar:', iconoEncontrado); // Ver qué ícono se encuentra
        if (iconoEncontrado) {
            setSelectedIcon(iconoEncontrado);
        } else {
            console.error('Icono no encontrado para el url:', detalle.icono_url);
            setSelectedIcon(iconos[0]);
        }

        setEditIndex(index);
    };


    // Función para duplicar un detalle
    const handleDuplicarSeccion = (index) => {
        const detalle = detalles[index];
        setContenido(detalle.contenido);
        setTitulo(detalle.titulo);
        const iconoEncontrado = iconos.find(icon => icon.label === detalle.titulo);
        setSelectedIcon(iconoEncontrado || iconos[0]);
        setEditIndex(null); // Limpiar editIndex para permitir la creación de un nuevo detalle
    };

    // Función para actualizar un detalle
const handleUpdateDetail = async () => {
    const detalleId = detalles[editIndex].id;

    const editorInstance = window.tinymce.activeEditor; // Acceder al editor activo
    const plainTextContent = editorInstance.getContent({ format: 'text' }); // Obtener solo el texto plano

    // Verificamos qué datos estamos a punto de enviar
    console.log("Actualizando detalle con datos:", {
        contenido: plainTextContent,
        titulo,
        icono_url: selectedIcon.url,
    });

    const updatedDetail = {
        ...detalles[editIndex],
        contenido: plainTextContent, // Guardar solo texto plano
        titulo,
        icono_url: selectedIcon.url, // Verificar si `selectedIcon.url` tiene el valor correcto
    };

    setLoading(true);

    try {
        // Enviamos los datos actualizados al servidor
        const response = await axios.put(`${API_URL}/${detalleId}`, updatedDetail);

        if (response.data) {
            console.log('Respuesta del servidor:', response.data);

            // Actualiza la lista de detalles con el detalle modificado
            const updatedDetalles = detalles.map((detalle, index) =>
                index === editIndex ? response.data : detalle
            );

            setDetalles(updatedDetalles);

            // Si deseas simplificar el filtrado, actualizamos filteredDetalles de la misma forma
            setFilteredDetalles(updatedDetalles);

            // Verificamos si la lista se ha actualizado correctamente
            console.log('Detalles actualizados:', updatedDetalles);
        } else {
            console.error('Error al actualizar detalle:', response.data);
        }
    } catch (error) {
        console.error('Error al actualizar detalle:', error.response ? error.response.data : error.message);
    } finally {
        setLoading(false);
        resetFields(); // Limpiamos los campos después de la actualización
    }
};


    const agregarAPresupuesto = (detalle) => {
        setDatosPresupuesto((prevDatos) => ({
            ...prevDatos,
            informacion: [
                ...prevDatos.informacion,
                {
                    id: detalle.id,
                    icono_url: detalle.icono_url,
                    contenido: detalle.contenido,
                    titulo: detalle.titulo,
                },
            ],
        }));
        alert('Detalle agregado al presupuesto correctamente.');
        navigate('/presupuesto/presupuestos');
    };

    const resetFields = () => {
        setContenido('');
        setTitulo('');
        setSelectedIcon(iconos[0]);
        setEditIndex(null);
    };

    const isAnyInputFilled = contenido || titulo;

    // ... (el resto de tu código permanece igual)

    return (
        <div className='ms-div'>
            <h2 className='ms-h2'>Información</h2>

            {/* Nuevo botón para agregar un detalle */}


            <form className='ms-form' onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    placeholder="Título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className='ms-input'
                />

                <select
                    className="ms-select"
                    value={selectedIcon.url} // Usamos el `url` como valor
                    onChange={(e) => {
                        const iconoSeleccionado = iconos.find(icon => icon.url === e.target.value); // Buscar por `url`
                        setSelectedIcon(iconoSeleccionado); // Actualizamos el ícono completo
                    }}
                >
                    {iconos.map((icono) => (
                        <option key={icono.id} value={icono.url}> {/* Ahora el valor es el `url` */}
                            {icono.label}
                        </option>
                    ))}
                </select>




                {/* TinyMCE Editor para el contenido */}
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
                        toolbar: 'undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help',
                    }}
                    onEditorChange={(content) => setContenido(content)}
                />

                <div className='ms-div-button'>
                    <button
                        type="button"
                        className="ms-button agregar-detalle"
                        onClick={editIndex === null ? handleSaveDetail : handleUpdateDetail}
                        disabled={loading}
                    >
                        {editIndex === null ? 'Agregar Detalle' : 'Actualizar Detalle'}
                    </button>

                    {isAnyInputFilled && (
                        <button
                            type="button"
                            className="ms-button ms-button-cancel"
                            onClick={resetFields}
                        >
                            Cancelar
                        </button>
                    )}
                </div>

                {loading && <p>Cargando...</p>}

                <h2 className='ms-h2' id="h2-info-info">Registro de Información</h2>
                <div className='search-table-div' id="info-search-table-div">
                <input
                    type="text"
                    placeholder="Buscar detalles..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className='ms-search'
                    id="search-info"
                />
                {filteredDetalles.length > 0 && (
                    <table id="table-info" className="ms-table-info">
                        <thead>
                            <tr>
                                <th className='th-info'>ID</th>
                                <th className='th-info'>Título</th>
                                <th className='th-info'>Ícono</th>
                                <th>Contenido</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDetalles.map((detalle, index) => (
                                <tr key={detalle.id} className='tr-info'>
                                    <td>{detalle.id}</td>
                                    <td>{detalle.titulo}</td>
                                    <td>
                                        <img src={detalle.icono_url} alt={detalle.titulo} className="icon-image" />
                                    </td>
                                    <td dangerouslySetInnerHTML={{ __html: detalle.contenido }} />
                                    <td className='td-buttons' id="buttons-info">
                                        <button
                                            onClick={() => handleEditSection(index)}
                                            className="ms-button-section"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDetail(index)}
                                            className="ms-button-section"
                                        >
                                            Eliminar
                                        </button>
                                        <button
                                            onClick={() => handleDuplicarSeccion(index)}
                                            className="ms-button-section"
                                        >
                                            Duplicar
                                        </button>
                                        <button
                                            onClick={() => agregarAPresupuesto(detalle)}
                                            className="ms-button-section"
                                        >
                                            Agregar a Presupuesto
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                </div>
            </form>
        </div>

    );

}

export default Informacion;
