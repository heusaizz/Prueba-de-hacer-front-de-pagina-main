import { useState } from 'react';
import { fetchEnrollmentsByClientId } from '../services/api';

const useEnrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [error, setError] = useState(null);

    const getEnrollments = async (clientId) => {
        setError(null); // Resetea el error antes de hacer la solicitud
        try {
            const data = await fetchEnrollmentsByClientId(clientId);
            setEnrollments(data || []);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
            setError('Error al obtener las inscripciones.'); // Manejo de errores
        }
    };

    return { enrollments, error, getEnrollments };
};

export default useEnrollments;