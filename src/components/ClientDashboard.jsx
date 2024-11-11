import { useEffect, useState } from 'react';
import { fetchEnrollmentsByClientId } from '../services/api'; // Asegúrate de que esta función esté definida en api.js
import "./ClientDashboard.css";

const ClientDashboard = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [clientId, setClientId] = useState(''); // Estado para el ID del cliente
    const [error, setError] = useState(null); // Estado para manejar errores

    const handleFetchEnrollments = async (e) => {
        e.preventDefault(); // Evita el comportamiento por defecto del formulario
        setError(null); // Resetea el error antes de hacer la solicitud
        try {
            const data = await fetchEnrollmentsByClientId(clientId); // Llama a la función con el ID del cliente
            setEnrollments(data || []); // Asegúrate de que se establezca un arreglo vacío si no hay datos
        } catch (error) {
            console.error('Error fetching enrollments:', error);
            setError('Error al obtener las inscripciones.'); // Manejo de errores
        }
    };

    useEffect(() => {
        if (clientId) {
            handleFetchEnrollments(); // Llama a la función para obtener inscripciones si hay un ID
        }
    }, [clientId]); // Se ejecuta cuando el clientId cambia

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
        </div>
    );
};

export default ClientDashboard;