import { useState } from 'react';
import useEnrollment from '../hooks/useEnrollment'; // Importa el custom hook
import "./ClientDashboard.css";

const ClientDashboard = () => {
    const [clientId, setClientId] = useState(''); // Estado para el ID del cliente
    const { enrollments, error, getEnrollments } = useEnrollment(); // Usa el custom hook

    const handleFetchEnrollments = async (e) => {
        e.preventDefault(); // Evita el comportamiento por defecto del formulario
        await getEnrollments(clientId); // Llama a la función del hook con el ID del cliente
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
        </div>
    );
};

export default ClientDashboard;