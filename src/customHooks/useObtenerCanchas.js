import { useEffect, useState } from 'react';
import axios from 'axios';

export const useObtenerCanchas = (id) => {
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
        const res = await axios.get(`${serverLocal}/api-pruebas/canchas`);
        const filteredData = res.data.filter(prop => prop.id_propietario === id);
        setDatos(filteredData);
      } catch (err) {
        console.error('Error al obtener canchas:', err);
        setError(err.message || 'Hubo un error al cargar las canchas');
        setDatos([]); // Opcional: reiniciar datos en caso de error
      } finally {
        setIsLoading(false);
      }
    };

    if (id) { 
      obtenerDatos();
    } else {
      setIsLoading(false); 
      setDatos([]);
    }
  }, [id]); // 

  return { datos, isLoading, error };
};