import { useEffect, useState } from 'react';
import "./ClientDashboard.css";


const ClientDashboard = () => {
    const [enrollments, setEnrollments] = useState([]);

    useEffect(() => {
        const fetchEnrollments = async () => {
            const clientId = 2; // Reemplaza esto con el ID real del cliente
            const token = localStorage.getItem('jwtToken'); // Asegúrate de que el token esté definido correctamente
            try {
                const response = await fetch(`https://localhost:7251/api/Client/${clientId}/GetAllSubjectsEnrollments`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Si necesitas autenticación
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                //console.log(data);
                setEnrollments(data);
            } catch (error) {
                console.error('Error fetching enrollments:', error);
            }
        };

        fetchEnrollments();
    }, []);

    return (
        <div className="client-dashboard">
            <h1>Dashboard del Estudiante</h1>
            <h2>Mis Inscripciones</h2>
            <ul>
                {enrollments.map(enrollment => (
                    <li key={enrollment.subjectId}>{enrollment.title}, {enrollment.description}</li>
                ))} {/* Asegúrate de que el campo sea correcto */}
            </ul>
        </div>
    );
};

export default ClientDashboard;