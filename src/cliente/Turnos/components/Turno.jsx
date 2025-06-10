import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Import motion for animations

export const Turno = ({ id, estado, cancha, hora, precio }) => {
  // Function to format the hour string, taking only the first 5 characters (e.g., "HH:MM")
  const formatearHora = (horaStr) => horaStr.slice(0, 5);

  return (
    // Outer container for the turno card, applying subtle hover and tap animations
    <motion.div
      key={id}
      whileHover={{ y: -6 }} // Lifts the card slightly on hover
      whileTap={{ scale: 0.98 }} // Provides a gentle press effect on tap/click
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20, // Reduced damping for a slightly snappier feel
        mass: 0.8, // Adjusted mass for a more natural spring effect
      }}
      className="w-full sm:mb-4 px-2 sm:px-3 md:px-4 lg:px-0" // Responsive padding
    >
      {/* The main clickable link for the turno */}
      <Link
        to={estado === "disponible" ? "/confirmaciondeturno" : "#"} // Link to confirmation page if available, otherwise no navigation
        state={{ idCancha: cancha, idTurno: id }} // Pass state for use on the confirmation page
        className={`
          block w-full p-4 xl:py-10 sm:p-5 rounded-xl sm:rounded-2xl relative overflow-hidden
          ${
            estado === "disponible"
              ? "bg-white border-2 border-emerald-300/40 hover:border-emerald-500/60" // Styles for available turno
              : estado === 'reservado'
              ? "bg-gray-100 border-2 border-gray-200/50 cursor-not-allowed opacity-80" // Styles for reserved turno
              : "bg-yellow-50 border-2 border-yellow-200/50 cursor-not-allowed opacity-80" // Styles for pending turno
          }
          transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75
        `}
      >
        {/* Conditional shimmer effect for available turnos on hover */}
        {estado === "disponible" && (
          <motion.div
            initial={{ opacity: 0, x: -100 }} // Starts off-screen to the left and invisible
            whileHover={{ opacity: 0.4, x: 100 }} // Moves across the card and becomes visible on hover
            transition={{ duration: 0.8, ease: "easeOut" }} // Smooth transition for the shimmer
            className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" // Shimmer styling
          />
        )}

        {/* Content of the turno card */}
        <div className="flex items-center justify-between relative z-10 gap-4 sm:gap-10">
          {/* Left section: Icon and time/status details */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Icon container with animation */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1], // Subtle pulse animation for the icon
                transition: { repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }, // Loop indefinitely
              }}
              className={`p-2 sm:p-3 rounded-xl ${ // Icon container styling
                estado === "disponible"
                  ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-400/50"
                  : estado === 'reservado'
                  ? "bg-gradient-to-br from-gray-400 to-gray-500 text-gray-100 shadow-gray-400/30"
                  : "bg-gradient-to-br from-yellow-500 to-yellow-700 text-gray-100 shadow-yellow-400/30"
              } shadow-lg`}
            >
              {/* Clock SVG icon */}
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </motion.div>

            {/* Time, status, and price details */}
            <div>
              <span
                className={`text-xl md:text-2xl xl:text-4xl font-extrabold ${ // Time text styling
                  estado === "disponible" ? "text-gray-900" : "text-gray-600"
                }`}
              >
                {formatearHora(hora)}
              </span>
              <p
                className={`text-xs md:text-sm xl:text-lg ${ // Status text styling
                  estado === "disponible" ? "text-emerald-600" : "text-gray-500"
                } font-medium mt-1`}
              >
                {estado === "disponible" ? "Disponible ahora" : estado === 'reservado' ? "Turno ocupado" : "En proceso de reserva"}
              </p>
              <p
                className={`text-sm lg:text-base xl:text-2xl ${ // Price text styling
                  estado === "disponible" ? "text-gray-700" : "text-gray-500"
                } font-bold mt-1`}
              >
                ${Math.trunc(precio)}
              </p>
            </div>
          </div>

          {/* Right section: Action/Status badge */}
          <motion.div
            whileHover={{ scale: 1.05 }} // Enlarges slightly on hover
            whileTap={{ scale: 0.95 }} // Shrinks slightly on tap/click
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-xl ${ // Badge container styling
              estado === "disponible"
                ? "bg-gradient-to-r from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-400/40"
                : estado === 'reservado'
                ? "bg-gradient-to-r from-gray-400 to-gray-500 shadow-gray-400/30"
                : "bg-gradient-to-br from-yellow-500 to-yellow-700 shadow-yellow-400/30"
            }`}
          >
            <span
              className={`text-xs sm:text-sm font-extrabold tracking-wider uppercase ${ // Badge text styling
                estado === "disponible" ? "text-white" : "text-gray-100"
              }`}
            >
              {estado === "disponible" ? "Reservar" : estado === "reservado" ? "Ocupado" : "Pendiente"}
            </span>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};
