// customHooks/useTodosLosTurnos.js
import { useState, useEffect } from "react";
import axios from "axios";

export const useTodosLosTurnos = () => {

  const [turnos, setTurnos] = useState([]);

  const serverLocal = 'http://localhost:3002';
  const serverExterno = 'https://turnogol.site';

  useEffect(() => {
    axios.get(`${serverExterno}/api-pruebas/turnos`)
      .then((res) => setTurnos(res.data))
      .catch((err) => console.error("Error al obtener turnos", err));
  }, []);

  return { turnos };
};
