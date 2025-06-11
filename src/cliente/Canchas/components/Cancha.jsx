import { Link } from "react-router-dom";
import { FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";

export const Cancha = ({ id, nombre, seccion, logo, direccion, index, localidad, turnosDisponibles }) => {

  return (
    <div
      key={index}
     
      className={`
        transform overflow-hidden rounded-2xl shadow-xl bg-white
        hover:shadow-xl transition-all duration-300 border border-gray-100
      `}
    >
      {/* Link covering the entire card for navigation */}
      <Link
        to={`/${seccion}`}
        state={{ idCancha: id }}
        className={`
          flex items-center gap-4 sm:gap-6 p-4 sm:p-5 pr-5 group
          border-l-4 border-transparent hover:border-emerald-400 transition-all duration-300
        `}
        aria-label={`Reservar en cancha ${nombre}`}
        role="button"
      >

        <div className="w-16 h-16 sm:w-20 sm:h-20 xl:w-24 xl:h-24 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
          <img
            src={logo}
            alt={`Logo de ${nombre}`}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/100x100/A3A3A3/FFFFFF?text=${nombre.charAt(0)}`; // Placeholder image
            }}
          />
        </div>

        {/* Information section */}
        <div className="flex-1 min-w-0">
          {/* Court Name */}
          <h3 className="text-base sm:text-xl xl:text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors capitalize truncate">
            {nombre}
          </h3>

          {/* Address and Locality */}
          <div className="mt-1 flex flex-col text-xs sm:text-sm text-gray-600">
            <span className="truncate flex items-center">
              <FaMapMarkerAlt className="w-3 h-3 text-gray-400 mr-1.5" />
              {direccion}
            </span>
            <span className="text-xs text-gray-500 mt-0.5 ml-4">
              {localidad}
            </span>
          </div>
        </div>
        <div className={`
            flex-shrink-0 opacity-70 group-hover:opacity-100
            transition-all duration-200 transform group-hover:translate-x-1
            text-emerald-500 group-hover:text-emerald-600 // Always green
          `}
        >
          <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </Link>
    </div>
  );
};