// import axios from "axios";

// // Ajusta tu URL base según tu configuración (ej. variables de entorno)
// const API_URL = "http://localhost:3000/api/reports";

// const downloadPdf = async (endpoint, defaultFilename) => {
//     try {
//         const response = await axios.get(`${API_URL}/${endpoint}`, {
//             responseType: "blob", // <--- ¡VITAL! Esto dice que esperamos un archivo, no JSON
//         });

//         // Crear un objeto URL para el blob
//         const url = window.URL.createObjectURL(new Blob([response.data]));

//         // Crear un elemento <a> temporal en el DOM
//         const link = document.createElement("a");
//         link.href = url;

//         // Intentar obtener el nombre del archivo desde el header del backend
//         // (Requiere que tu backend exponga el header 'content-disposition' en CORS)
//         // Si no, usamos el defaultFilename
//         const contentDisposition = response.headers['content-disposition'];
//         let fileName = defaultFilename;

//         if (contentDisposition) {
//             const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
//             if (fileNameMatch && fileNameMatch.length === 2)
//                 fileName = fileNameMatch[1];
//         }

//         link.setAttribute("download", fileName);

//         // Añadir al documento, hacer click y remover
//         document.body.appendChild(link);
//         link.click();
//         link.parentNode.removeChild(link);
//         window.URL.revokeObjectURL(url); // Limpiar memoria

//     } catch (error) {
//         console.error("Error descargando el reporte:", error);
//         alert("Hubo un error al descargar el reporte.");
//     }
// };

// export default {
//     downloadStudentReport: (id) => downloadPdf(`student/${id}`, `Estudiante_${id}.pdf`),
//     downloadProjectReport: (id) => downloadPdf(`project/${id}`, `Proyecto_${id}.pdf`),
//     downloadAnnualReport: (year) => downloadPdf(`annual/${year || ''}`, `Memoria_Anual.pdf`),
// };