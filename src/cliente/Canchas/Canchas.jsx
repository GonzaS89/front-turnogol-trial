import { useState } from "react";
import { useCanchas } from "../../customHooks/useCanchas";
import { useObtenerTodosLosTurnos } from "../../customHooks/useObtenerTodosLosTurnos";
import { Cancha } from "./components/Cancha";
import { format } from "date-fns";

export default function Canchas () {
  const { datos: canchas, isLoading, error } = useCanchas();
  const [searchTerm, setSearchTerm] = useState("");
  const { turnos } = useObtenerTodosLosTurnos();

  const turnosLibres = (id) =>
    turnos.reduce(
      (total, turno) =>
        turno.estado === "disponible" &&
        turno.cancha_id === id &&
        formatearFecha(turno.fecha) === getFechaHoy()
          ? total + 1
          : total,
      0
    );

    function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    return format(fecha, "dd-MM-yyyy");
  }

  const filteredCanchas = canchas
  .filter((cancha) =>
    cancha.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    const turnosA = turnosLibres(a.id);
    const turnosB = turnosLibres(b.id);
    return turnosB - turnosA; // De mayor a menor
  });


  function getFechaHoy() {
    const hoy = new Date();

    const dia = String(hoy.getDate()).padStart(2, "0");
    const mes = String(hoy.getMonth() + 1).padStart(2, "0"); // Los meses empiezan en 0
    const anio = hoy.getFullYear();

    return `${dia}-${mes}-${anio}`;
  }

  

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-around py-6 px-2 sm:px-4">
  {/* Header */}
  <header 
    className="mb-8 sm:mb-10 text-center w-full max-w-md px-3 sm:px-5 py-4"
  >
    <h1 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-3xl md:text-4xl xl:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 bg-clip-text text-emerald-700"
    >
      Canchas disponibles 

    </h1>

  </header>

  {/* Contenedor de resultados */}
  <div className="w-full lg:max-w-5xl xl:max-w-7xl py-3 sm:p-4 backdrop-blur-sm">
    {/* Estado de carga */}
    {isLoading ? (
      <div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-40 sm:h-48 flex flex-col justify-center items-center bg-white/70 backdrop-blur-sm rounded-xl shadow-inner"
      >
        <div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-emerald-500 border-t-transparent rounded-full mb-2 sm:mb-3"
        />
        <p className="text-xs sm:text-sm md:text-base font-medium text-gray-600">
          Cargando canchas...
        </p>
      </div>
    ) : error ? (
      <div className="p-3 text-xs sm:text-sm text-red-700 text-center">
        Hubo un error al cargar las canchas. Inténtalo nuevamente.
      </div>
    ) : filteredCanchas.length === 0 ? (
      <div className="text-center py-4 text-gray-500 text-sm">
        No se encontraron canchas con ese nombre
      </div>
    ) : (
      <div>
           <p 
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="text-gray-600 mt-2 text-base xl:text-2xl text-center xl-mb-6 mb-4 md:mb-6 lg:mb-8 font-medium"
    >
      Seleccioná una cancha para reservar tu turno
    </p>
      <div className="flex flex-col gap-3 md:grid xl:grid-cols-2 overflow-y-auto px-2 sm:px-3">
        {filteredCanchas.map((cancha, index) => (
          <Cancha id={cancha.id} seccion={cancha.seccion} nombre={cancha.nombre} index={cancha.id} localidad={cancha.localidad} logo={cancha.logo} direccion={cancha.direccion} key={cancha.id}/>
        ))}
      </div>
      </div>
    )}
  </div>
</section>
  );
};