import { api } from "./axios"; // <--- Usamos tu instancia configurada

// Helper interno para la lógica de descarga
const downloadPdf = async (endpoint: string, defaultFilename: string) => {
    try {
        // Nota: Agregamos "/reports/" al inicio porque tus rutas son /api/reports/...
        // La instancia 'api' ya se encarga de la parte "/api" (si así la configuraste)
        const response = await api.get(`/reports/${endpoint}`, {
            responseType: "blob",
        });

        // Crear URL del Blob
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Crear enlace temporal
        const link = document.createElement("a");
        link.href = url;

        // Intentar sacar el nombre real del archivo desde los headers
        const contentDisposition = response.headers['content-disposition'];
        let fileName = defaultFilename;

        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (fileNameMatch && fileNameMatch.length === 2)
                fileName = fileNameMatch[1];
        }

        link.setAttribute("download", fileName);

        // Simular click y limpiar Reporte
        document.body.appendChild(link);
        link.click();
        if (link.parentNode) {
            link.parentNode.removeChild(link);
        }
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Error descargando el reporte:", error);
        // Aquí puedes lanzar una alerta visual si usas una librería (ej. toast)
        alert("No se pudo descargar el reporte. Verifique permisos o intente más tarde.");
    }
};

// Exportamos las funciones listas para usar en tus componentes
export const downloadStudentReport = (id: number) =>
    downloadPdf(`student/${id}`, `Estudiante_${id}.pdf`);

export const downloadProjectReport = (id: number) =>
    downloadPdf(`project/${id}`, `Proyecto_${id}.pdf`);

export const downloadAnnualReport = (year?: number) =>
    downloadPdf(`annual/${year || ''}`, `Reporte_Anual.pdf`);

export const downloadCareerReport = (id: number) =>
    downloadPdf(`career/${id}`, `Reporte_Carrera_${id}.pdf`);
