import { useEffect, useState } from 'react';
import axios from 'axios';

export const usePropietarios = () => {
  const [datos, setDatos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const serverLocal = 'http://localhost:3002';
  const serverExterno = 'https://turnogol.site';

  useEffect(() => {
    const obtenerDatos = async () => {
      setIsLoading(true);
      setError(null); // Reiniciar error en cada nueva carga

      try {
        const res = await axios.get(`${serverExterno}/api-pruebas/propietarios`);
        setDatos(res.data);
      } catch (err) {
        console.error('Error al obtener propietarios:', err);
        setError(err.message || 'Hubo un error al cargar las propietarios');
        setDatos([]); // Opcional: reiniciar datos en caso de error
      } finally {
        setIsLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  return { datos, isLoading, error };
};