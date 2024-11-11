import { useEffect, useState } from "react";
import {
  fetchAllUsers,
  fetchAllEnrollments,
  fetchAllSubjects,
  createUser ,
  updateUser ,
  deleteUser ,
  createSubject,
  updateSubject,
  deleteSubject, // Asegúrate de importar la función deleteSubject
} from "../services/api"; // Asegúrate de que estas funciones están correctamente definidas en api.js
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    role: "",
    id: "",
  });

  const [subjectData, setSubjectData] = useState({
    SubjectId: "",
    title: "",
    description: "",
    professorId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await fetchAllUsers();
        const enrollmentsData = await fetchAllEnrollments();
        const subjectsData = await fetchAllSubjects();
        console.log("Datos de asignaturas:", subjectsData); // Verifica la estructura de los datos
        setUsers(usersData);
        setEnrollments(enrollmentsData);
        setSubjects(subjectsData); // Aquí se establece el estado de las asignaturas
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const newValue = name == "role" ? Number(value) : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubjectFormChange = (e) => {
    const { name, value } = e.target;
    setSubjectData({ ...subjectData, [name]: value });
  };

  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      password: user.password,
      role: user.role,
    });
    setShowForm(true); // Mostrar el formulario al editar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        id: formData.id,
        name: formData.name,
        email: formData.email,
        username: formData.username,
        ...(formData.password && { password: formData.password }),
        role: formData.role,
      };

      console.log("Datos a enviar:", dataToSubmit); // Verifica los datos aquí

      if (formData.id) {
        await updateUser(formData.id, dataToSubmit);
      } else {
        await createUser(dataToSubmit);
      }

      const usersData = await fetchAllUsers();
      setUsers(usersData);
      setShowForm(false);
      setFormData({
        name: "",
        username: "",
        password: "",
        email: "",
        role: "",
        id: "",
      });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert(`Error al crear el usuario: ${error.message}`); // Muestra el mensaje de error al usuario
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      const usersData = await fetchAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Error al eliminar el usuario: ", error);
    }
  };

  const handleEditSubject = (subject) => {
    setSubjectData({
      id: subject.id,
      title: subject.title,
      description: subject.description,
    });
    setShowSubjectForm(true);
  };

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    try {
      if (subjectData.id) {
        await updateSubject(subjectData.id, subjectData);
      } else {
        await createSubject(subjectData);
      }
      const subjectsData = await fetchAllSubjects();
      setSubjects(subjectsData);
      setShowSubjectForm(false);
      setSubjectData({ id: "", title: "", description: "" });
    } catch (error) {
      console.error("Error al enviar el formulario de asignatura:", error);
      alert(`Error al gestionar la asignatura: ${error.message}`);
    }
  };


  const handleDeleteSubject = async (subjectId) => {
    console.log("ID de la asignatura a eliminar:", subjectId); // Verifica el ID

    if (!subjectId) {
      console.error("El ID de la asignatura es inválido.");
      return; // Salir si el ID es inválido
    }

    try {
      await deleteSubject(subjectId); // Llama a la función de eliminación
      const subjectsData = await fetchAllSubjects(); // Vuelve a obtener la lista de asignaturas
      setSubjects(subjectsData); // Actualiza el estado con la nueva lista
    } catch (error) {
      console.error("Error al eliminar la asignatura:", error);
      alert(`Error al eliminar la asignatura: ${error.message}`); // Muestra el mensaje de error
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-dashboard">
      <h1>Vista Administrador</h1>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cerrar Formulario" : "Agregar/Editar Usuario"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            placeholder="Nombre de la persona"
            required
          />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleFormChange}
            placeholder="Nombre de usuario"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleFormChange}
            placeholder="Contraseña"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleFormChange}
            placeholder="Correo electrónico"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleFormChange}
            required
          >
            <option value="" disabled>
              Seleccione un rol
            </option>{" "}
            <option value={0}>Rol Admin</option>{" "}
            <option value={1}>Rol Alumno</option>{" "}
            <option value={2}>Rol Profesor</option>{" "}
          </select>
          <input type="hidden" name="id" value={formData.id} />
          <button type="submit">Enviar</button>
        </form>
      )}

      <section>
        <h2>Usuarios</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} - {user.username} - {user.role}
              <button onClick={() => handleEdit(user)}>Editar</button>
              <button onClick={() => handleDelete(user.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Usuarios</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} - {user.role} <h3>Legajo: </h3> {user.id}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Inscripciones</h2>
        <ul>
          {enrollments.map((enrollment) => (
            <li key={enrollment.id}>
              {enrollment.subjectTitle} <h3>Legajo: </h3> {enrollment.clientId}{" "}
            </li>
          ))}
        </ul>
      </section>

      <button onClick={() => setShowSubjectForm(!showSubjectForm)}>
        {showSubjectForm ? "Cerrar Formulario de Asignatura" : "Agregar/Editar Asignatura"}
      </button>

      {showSubjectForm && (
        <form onSubmit={handleSubjectSubmit}>
          <input
            type="text"
            name="title"
            value={subjectData.title}
            onChange={handleSubjectFormChange}
            placeholder="Título de la Asignatura"
            required
          />
          <textarea
            name="description"
            value={subjectData.description}
            onChange={handleSubjectFormChange}
            placeholder="Descripción de la Asignatura"
            required
          />
          <input
            type="number"
            name="professorId" 
            value={subjectData.professorId}
            onChange={handleSubjectFormChange}
            placeholder="ID del Profesor"
            required
          />
          <input type="hidden" name="Subjectid" value={subjectData.id} />
          <button type="submit">Enviar</button>
        </form>
      )};
      <section>
        <h2>Asignaturas</h2>
        <ul>
          {subjects.map((subject) => (
            <li key={subject.subjectId}> {/* Asegúrate de usar subject.subjectId */}
              {subject.title}
              <button onClick={() => {
                console.log("Botón de eliminar clickeado para el ID:", subject.subjectId); // Verifica el ID al hacer clic
                handleDeleteSubject(subject.subjectId); // Usa subject.subjectId aquí
              }}>
                Eliminar
              </button>
              <button onClick={() => handleEditSubject(subject)}>Editar</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;