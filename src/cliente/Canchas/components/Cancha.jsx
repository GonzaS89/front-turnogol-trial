import { Link } from "react-router-dom";
import { FaArrowRight, FaMapMarkerAlt,FaBan,FaCheckCircle } from "react-icons/fa";
import { useObtenerTodosLosTurnos } from "../../../customHooks/useObtenerTodosLosTurnos";
import { format } from "date-fns";

export const Cancha = ({ id, nombre, seccion, logo, direccion, index, localidad, turnosDisponibles }) => {
  const { turnos } = useObtenerTodosLosTurnos();

  function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    return format(fecha, "dd-MM-yyyy");
  }

  function getFechaHoy() {
    const hoy = new Date();

    const dia = String(hoy.getDate()).padStart(2, "0");
    const mes = String(hoy.getMonth() + 1).padStart(2, "0"); // Los meses empiezan en 0
    const anio = hoy.getFullYear();

    return `${dia}-${mes}-${anio}`;
  }

  

  return (
   <div
  key={index}
  className="transform overflow-hidden rounded-2xl shadow-md bg-white hover:shadow-xl transition-all duration-300 border border-gray-100"
>
  <Link
    to={`/${seccion}`}
    state={{ idCancha : id }}
    className={`flex items-center gap-4 sm:gap-6 p-4 sm:p-5 pr-5 group ${
      turnosDisponibles === 0 ? "opacity-70" : ""
    } border-l-4 border-transparent hover:border-emerald-400 transition-all duration-300`}
    aria-label={`Reservar en cancha ${nombre}`}
    role="button"
  >
    {/* Imagen - responsive */}
    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
      <img
        src={logo}
        alt={`Logo de ${nombre}`}
        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
        loading="lazy"
      />
    </div>

    {/* Información */}
    <div className="flex-1 min-w-0">
      {/* Nombre */}
      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors capitalize truncate">
        {nombre}
      </h3>

      {/* Dirección y localidad */}
      <div className="mt-1 flex flex-col text-xs sm:text-sm text-gray-600">
        <span className="truncate flex items-center">
          <FaMapMarkerAlt className="w-3 h-3 text-gray-400 mr-1.5" />
          {direccion}
        </span>
        <span className="text-xs text-gray-500 mt-0.5 ml-4">
          {localidad}
        </span>
      </div>

      {/* Estado de disponibilidad */}
      <div
        className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
          turnosDisponibles > 0
            ? "bg-emerald-100 text-emerald-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {turnosDisponibles > 0 ? (
          <>
            <FaCheckCircle className="mr-1.5 text-emerald-600" />
            {turnosDisponibles}{" "}
            {turnosDisponibles !== 1 ? "turnos disponibles" : "turno disponible"}
          </>
        ) : (
          <>
            <FaBan className="mr-1.5 text-red-500" />
            Sin turnos disponibles
          </>
        )}
      </div>
    </div>

    {/* Flecha de acción */}
    <div className="flex-shrink-0 text-emerald-500 opacity-70 group-hover:opacity-100 group-hover:text-emerald-600 transition-all duration-200 transform group-hover:translate-x-1">
      <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
    </div>
  </Link>
</div>
  );
};
