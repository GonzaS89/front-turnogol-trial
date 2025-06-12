import { useState, useEffect } from 'react';
import axios from 'axios';

export const useObtenerTodosLosTurnos = () => {

    const [turnos, setTurnos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const serverLocal = 'http://localhost:3002';
    const serverExterno = 'https://turnogol.site';

    useEffect(() => {
        const obtenerTurnos = async () => {
            try {
                const res = await axios.get(`${serverExterno}/api-pruebas/turnos_canchas`);
                setTurnos(res.data);
            } catch (err) {
                console.error("Error al obtener turnos:", err);
                setError(err.message || "Hubo un error al cargar los turnos");
            } finally {
                setIsLoading(false);
            }
        };

        obtenerTurnos();
    }, []);

    return { turnos, isLoading, error };
}
