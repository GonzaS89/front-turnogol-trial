import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Importamos motion para las animaciones

export const Turno = ({ id, estado, cancha, hora, precio }) => {
  // Función para formatear la hora, tomando solo los primeros 5 caracteres (ej. "HH:MM")
  const formatearHora = (horaStr) => horaStr.slice(0, 5);

  const isDisponible = estado === "disponible";
  const isReservado = estado === "reservado";
  const isPendiente = estado === "pendiente";

  return (
    // Contenedor principal de la tarjeta del turno con animaciones Framer Motion
    <motion.div
      key={id}
      // whileHover: Elevación sutil y sombra con un toque de color esmeralda/verde al pasar el ratón
      whileHover={{ y: -7, boxShadow: "0 15px 25px -5px rgba(52, 211, 153, 0.2), 0 8px 10px -6px rgba(52, 211, 153, 0.1)" }}
      whileTap={{ scale: 0.98 }} // Efecto de presión ligeramente más pronunciado
      transition={{
        type: "spring",
        stiffness: 300, // Mayor rigidez para un toque más enérgico
        damping: 22,    // Amortiguación que suaviza el rebote sin perder energía
      }}
      className="w-full mb-4 px-2 sm:px-3 md:px-4 xl:px-0" // Padding responsivo
    >
      {/* El enlace principal que ocupa toda la tarjeta */}
      <Link
        to={isDisponible ? "/confirmaciondeturno" : "#"}
        state={{ idCancha: cancha, idTurno: id }}
        className={`
          relative block w-full p-4 sm:p-5 xl:p-6 rounded-2xl overflow-hidden
          ${isDisponible
            ? "bg-white border-2 border-emerald-300 hover:border-emerald-500 cursor-pointer" // Fondo blanco, borde esmeralda más claro y hover más intenso
            : isReservado
            ? "bg-gray-100 border border-gray-200 cursor-not-allowed opacity-80" // Fondo gris claro, borde gris suave
            : "bg-yellow-50 border border-yellow-200 cursor-not-allowed opacity-80" // Fondo amarillo pastel para pendiente
          }
          transition-all duration-300 shadow-md hover:shadow-xl focus:outline-none focus:ring-3 focus:ring-emerald-400 focus:ring-opacity-75
        `}
      >
        {/* Shimmer effect - más vibrante y solo para disponibles */}
        {isDisponible && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileHover={{ opacity: 0.4, x: 100 }} // Más opaco al hover
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none" // Brillo más ancho y visible
          />
        )}

        {/* Contenido principal de la tarjeta */}
        <div className="flex items-center justify-between relative z-10 gap-4">
          {/* Sección izquierda: Icono y detalles */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Contenedor del icono - estilo de círculo vibrante */}
            <div className={`p-2 sm:p-3 rounded-full flex-shrink-0 shadow-md ${ // Círculo más grande y con sombra más pronunciada
              isDisponible
                ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white" // Degradado vibrante para disponible
                : isReservado
                ? "bg-gradient-to-br from-gray-400 to-gray-500 text-gray-100" // Degradado gris suave
                : "bg-gradient-to-br from-yellow-500 to-yellow-600 text-yellow-100" // Degradado amarillo vibrante
            }`}>
              <svg
                width="24" // Icono ligeramente más grande
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5" // Grosor de línea más pronunciado
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>

            {/* Detalles de hora, estado y precio */}
            <div>
              <span
                className={`text-2xl sm:text-3xl xl:text-4xl font-extrabold tracking-tight ${ // Hora muy grande y negrita
                  isDisponible ? "text-gray-900" : "text-gray-600" // Texto oscuro
                }`}
              >
                {formatearHora(hora)}
              </span>
              <p
                className={`text-xs sm:text-sm xl:text-base font-medium mt-1 ${ // Texto de estado
                  isDisponible ? "text-emerald-700" : "text-gray-500" // Verde oscuro vibrante
                }`}
              >
                {isDisponible ? "¡Turno Libre!" : isReservado ? "No Disponible" : "En Confirmación"}
              </p>
              <p
                className={`text-base sm:text-xl xl:text-xl font-bold mt-1 ${ // Precio más grande y negrita
                  isDisponible ? "text-gray-800" : "text-gray-600" // Texto oscuro
                }`}
              >
                ${Math.trunc(precio)}
              </p>
            </div>
          </div>

          {/* Sección derecha: Etiqueta de acción/estado */}
          <div
            className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wide shadow-md ${ // Etiqueta compacta y muy prominente
              isDisponible
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white" // Degradado vibrante para acción
                : isReservado
                ? "bg-gray-300 text-gray-700" // Gris claro para ocupado
                : "bg-yellow-300 text-yellow-800" // Amarillo vibrante para pendiente
            }`}
          >
            {isDisponible ? "Reservar" : isReservado ? "Ocupado" : "Pendiente"}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};