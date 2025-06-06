import { Link } from "react-router-dom";

export const Turno = ({ id, estado, cancha, hora, precio }) => {

    const formatearHora = (horaStr) => horaStr.slice(0, 5);
    
  return (
    <div
      key={id}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.96 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
        mass: 0.5,
      }}
      className="w-full sm:mb-4 px-2 sm:px-3 md:px-4 lg:px-0"
    >
      <Link
        to={estado === "disponible" ? "/confirmaciondeturno" : "#"}
        state={{ idCancha: cancha, idTurno: id }}
        className={`block w-full p-4 xl:py-10 sm:p-5 rounded-xl sm:rounded-2xl relative overflow-hidden ${
          estado === "disponible"
            ? "bg-white border-2 border-emerald-300/30 hover:border-emerald-400/50"
            : "bg-gray-100 border-2 border-gray-200/50"
        } transition-all duration-300 shadow-sm hover:shadow-md`}
      >
        {estado === "disponible" && (
          <div
            initial={{ opacity: 0, x: -100 }}
            whileHover={{ opacity: 0.4, x: 100 }}
            transition={{ duration: 0.8 }}
            className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
          />
        )}

        <div className="flex items-center justify-between relative z-10 gap-10">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div
              animate={{
                scale: [1, 1.05, 1],
                transition: { repeat: Infinity, duration: 2 },
              }}
              className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${
                estado === "disponible"
                  ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-300/50"
                  : estado === 'reservado' ? "bg-gradient-to-br from-gray-400 to-gray-500 text-gray-100 shadow-gray-400/30" : "bg-gradient-to-br from-yellow-500 to-yellow-700 text-gray-100 shadow-yellow-400/30"
              } shadow-md`}
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>

            <div>
              <span
                className={`text-xl md:text-2xl xl:text-4xl font-bold ${
                  estado === "disponible" ? "text-gray-900" : "text-gray-600"
                }`}
              >
                {formatearHora(hora)}
              </span>
              <p
                className={`text-xs md:text-sm xl:text-lg ${
                  estado === "disponible" ? "text-emerald-600" : "text-gray-500"
                } font-medium mt-1`}
              >
                {estado === "disponible" ? "Disponible ahora" : estado === 'reservado' ? "Turno ocupado" : "En proceso de reserva"}
              </p>
              <p
                className={`text-xs lg:text-base xl:text-2xl ${
                  estado === "disponible" ? "text-emerald-600" : "text-gray-500"
                } font-medium`}
              >
                {" "}
                $ {Math.trunc(precio)}
              </p>
            </div>
          </div>

          <div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl ${
              estado === "disponible"
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-400/30"
                : estado === 'reservado' ? "bg-gradient-to-r from-gray-400 to-gray-500 shadow-gray-400/20" : "bg-gradient-to-br from-yellow-500 to-yellow-700 text-gray-100 shadow-yellow-400/30"
            }`}
          >
            <span
              className={`text-xs sm:text-sm font-extrabold tracking-wider ${
                estado === "disponible" ? "text-white" : "text-gray-100"
              }`}
            >
              {estado === "disponible" ? "RESERVAR" : estado === "reservado" ? "RESERVADO" : "PENDIENTE"}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
