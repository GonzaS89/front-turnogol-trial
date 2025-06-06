import { useEffect, useState } from 'react';
import axios from 'axios';

export const useCanchas = () => {
  const [datos, setDatos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      setIsLoading(true);
      setError(null); // Reiniciar error en cada nueva carga

      try {
        const res = await axios.get(`https://turnogol.site/api-pruebas/canchas`);
        setDatos(res.data);
      } catch (err) {
        console.error('Error al obtener canchas:', err);
        setError(err.message || 'Hubo un error al cargar las canchas');
        setDatos([]); // Opcional: reiniciar datos en caso de error
      } finally {
        setIsLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  return { datos, isLoading, error };
};