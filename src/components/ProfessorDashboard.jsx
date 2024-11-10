import { useEffect, useState } from 'react';
import "./ProfessorDashboard.css";

const ProfessorDashboard = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            const professorId = 3; // Reemplaza esto con el ID real del profesor
            const token = localStorage.getItem('jwtToken'); // Asegúrate de que el token esté definido correctamente
        
            try {
                const response = await fetch(`https://localhost:7251/api/professor/${professorId}/clients`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Usa el token aquí
                    }
                });
        
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
        
                const data = await response.json();
                setCourses(data); // Asegúrate de que setCourses esté definido
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="professor-dashboard">
            <h1>Dashboard del Profesor</h1>
            <h2>Mis Cursos</h2>
            <ul>
                {courses.map(client => (
                    <li key={client.clientId}>{client.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default ProfessorDashboard;