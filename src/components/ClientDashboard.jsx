import { useState, useEffect } from 'react';
import { fetchAllSubjects, createEnrollment, fetchEnrollmentsByClientId, deleteEnrollment } from '../services/api'; // Asegúrate de importar la función para eliminar inscripciones
import "./ClientDashboard.css";

const ClientDashboard = () => {
    const [clientId, setClientId] = useState(''); 
    const [subjects, setSubjects] = useState([]); 
    const [enrollments, setEnrollments] = useState([]); 
    const [error, setError] = useState(null); 
    const [enrollmentError, setEnrollmentError] = useState(null); 

    const fetchSubjects = async () => {
        try {
            const subjectsData = await fetchAllSubjects();
            setSubjects(subjectsData);
        } catch (err) {
            setError('Error al obtener las asignaturas.');
            console.error(err);
        }
    };

    const fetchEnrollments = async () => {
        setEnrollmentError(null); 
        try {
            const enrollmentsData = await fetchEnrollmentsByClientId(clientId); 
            setEnrollments(enrollmentsData); 
        } catch (error) {
            setEnrollmentError('Error al obtener las inscripciones.');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchSubjects(); 
    }, []);

    const handleEnroll = async (subjectId) => {
        setEnrollmentError(null); 
        try {
            const enrollmentData = {
                subjectId: subjectId,
                clientId: clientId,
            };
            await createEnrollment(enrollmentData); 
            alert('Inscripción exitosa'); 
            fetchEnrollments(); 
        } catch (error) {
            setEnrollmentError('Error al inscribirse en la asignatura.');
            console.error(error);
        }
    };

    const handleDeleteEnrollment = async (enrollmentId) => {
        setEnrollmentError(null); 
        try {
            await deleteEnrollment(enrollmentId); 
            alert('Inscripción eliminada exitosamente'); 
            fetchEnrollments(); 
        } catch (error) {
            setEnrollmentError('Error al eliminar la inscripción.');
            console.error(error);
        }
    };

    return (
        <div className="client-dashboard">
            <h1>Dashboard del Estudiante</h1>
            <form onSubmit={(e) => e.preventDefault()}>
                <input 
                    type="number" 
                    placeholder="Ingrese ID del Estudiante" 
                    value={clientId} 
                    onChange={(e) => setClientId(e.target.value)} 
                    required 
                />
                <button type="button" onClick={fetchEnrollments}>Buscar</button> {/* Botón para buscar inscripciones */}
            </form>
            {error && <p className="error-message">{error}</p>}
            {enrollmentError && <p className="error-message">{enrollmentError}</p>}
            <h2>Inscripciones</h2>
            <ul>
                {enrollments.length > 0 ? (
                    enrollments.map(enrollment => (
                        <li key={enrollment.enrollmentId}>
                            {enrollment.title} - {enrollment.description}
                            <button onClick={() => handleDeleteEnrollment(enrollment.enrollmentId)}>Eliminar</button> {/* Botón para eliminar la inscripción */}
                        </li>
                    ))
                ) : (
                    <p>No hay inscripciones disponibles.</p>
                )}
            </ul>
            <h2>Asignaturas Disponibles</h2>
            <ul>
                {subjects.map(subject => (
                    <li key={subject.subjectId}>
                        {subject.title} - {subject.description}
                        <button onClick={() => handleEnroll(subject.subjectId)}>Inscribirse </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClientDashboard;