import { useState, useEffect } from 'react';
import useEnrollment from '../hooks/useEnrollment'; // Importa el custom hook
import { fetchEnrollmentsByClientId, updateUser  } from '../services/api'; // Asegúrate de importar la función updateUser  
import "./ClientDashboard.css";

const ClientDashboard = () => {
    const [clientId, setClientId] = useState(''); // Estado para el ID del cliente
    const [clientData, setClientData] = useState({ id: "", name: '', username: '', email: '', password: '', role: '' }); // Estado para los datos del cliente
    const { enrollments, error, getEnrollments } = useEnrollment(); // Usa el custom hook

    useEffect(() => {
        const id = localStorage.getItem('clientId'); // Suponiendo que guardas el ID del cliente
        if (id) {
            setClientId(id);
            fetchClientData(id); // Llama a la función para cargar los datos del cliente
        }
    }, []);

    const fetchClientData = async (id) => {
        try {
            const data = await fetchEnrollmentsByClientId(id); // Asegúrate de que esta función devuelva los datos del cliente
            setClientData(data); // Ajusta esto según la estructura de los datos
        } catch (error) {
            console.error('Error fetching client data:', error);
        }
    };

    const handleFetchEnrollments = async (e) => {
        e.preventDefault(); // Evita el comportamiento por defecto del formulario
        await getEnrollments(clientId); // Llama a la función del hook con el ID del cliente
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setClientData({ ...clientData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userDataToUpdate = {
            id: clientData.id,
            name: clientData.name,
            username: clientData.username,
            email: clientData.email,
            ...(clientData.password && { password: clientData.password }),
            role: clientData.role,
        };
        
        console.log("Datos a enviar para actualizar el usuario:", userDataToUpdate); // Verifica los datos aquí
    
        try {
            const response = await updateUser (clientId, userDataToUpdate);
            if (!response.ok) {
                throw new Error('Error al actualizar los datos.');
            }
            alert('Datos actualizados exitosamente.');
        } catch (error) {
            console.error('Error al actualizar los datos:', error);
            alert('Error al actualizar los datos.');
        }
    };

    return (
        <div className="client-dashboard">
            <h1>Dashboard del Estudiante</h1>
            <form onSubmit={handleFetchEnrollments}>
                <input 
                    type="number" 
                    placeholder="Ingrese ID del Estudiante" 
                    value={clientId} 
                    onChange={(e) => setClientId(e.target.value)} 
                    required 
                />
                <button type="submit">Mostrar Inscripciones</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            <h2>Mis Inscripciones</h2>
            <ul>
                {enrollments.map(enrollment => (
                    <li key={enrollment.subjectId}>{enrollment.title}, {enrollment.description}</li>
                ))}
            </ul>

            <h2>Actualizar Mis Datos</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="id"
                    value={clientData.id}
                    onChange={handleFormChange}
                    placeholder="ID del Cliente"
                    required
                />
                <input
                    type="text"
                    name="name"
                    value={clientData.name}
                    onChange={handleFormChange}
                    placeholder="Nombre"
                    required
                />
                <input
                    type="text"
                    name="username"
                    value={clientData.username}
                    onChange={handleFormChange}
                    placeholder="Nombre de usuario"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={clientData.email}
                    onChange={handleFormChange}
                    placeholder="Correo electrónico"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={clientData.password}
                    onChange={handleFormChange}
                    placeholder="Nueva contraseña"
                />
                <select
                    name="role"
                    value={clientData.role}
                    onChange={handleFormChange}
                    required
                >
                    <option value="" disabled>
                    Seleccione un rol
                    </option>
                    <option value={1}>Rol Alumno</option>
                </select>
                <button type="submit">Actualizar Datos</button>
            </form>
        </div>
    );
};

export default ClientDashboard;