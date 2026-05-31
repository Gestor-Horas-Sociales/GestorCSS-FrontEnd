import { getCarreras } from "@/api/carreras";
import { useEffect, useState } from "react";
import type { CareerType } from "@/Types/CareerType";

export const useCarrera = () => { 
    const [carreras, setCarreras] = useState<CareerType[]>([]);
    const [error, setError] = useState("");
    
    // Cargar las carreras al iniciar el hook
    useEffect(() => {
        const fetchCarreras = async () => {
        try {
            const data = await getCarreras();
            setCarreras(data);
        } catch (error) {
            console.error("Error al cargar carreras:", error);
            setError("No se pudieron cargar las carreras");
        }
        };
        fetchCarreras();
    }, []);
    
    return { carreras, error };
 }