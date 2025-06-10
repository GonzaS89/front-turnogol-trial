import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Handshake,
  X,
  Check,
  // Imported specific icons from lucide-react
} from 'lucide-react'; 

import logo from '/logo.png';
import hero from '/hero-cancha.jpeg'

export default function PantallaInicial() {
  const [showModal, setShowModal] = useState(false);

  // Placeholder URLs for images as the original paths were unresolved
  const imgHeroPlaceholder = "https://placehold.co/1200x800/22c55e/ffffff?text=Cancha+de+Fútbol";
  const logoPlaceholder = "https://placehold.co/180x80/10b981/ffffff?text=TurnoGol+Logo";

  // Inline SVG for a simple soccer ball
  const SoccerBallIcon = ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0 0-8 4v.5L12 22l8-15.5V6a10 10 0 0 0-8-4z" />
      <path d="M12 2v20" />
      <path d="M22 6L2 6" />
      <path d="M10 12l-8 4" />
      <path d="M14 12l8 4" />
    </svg>
  );

  // Inline SVG for WhatsApp icon
  const WhatsappIcon = ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.52 3.48 1.48 4.98L2 22l5.25-1.38c1.47.8 3.12 1.25 4.79 1.25 5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zm.04 1.58c4.63 0 8.38 3.75 8.38 8.38 0 4.63-3.75 8.38-8.38 8.38-1.57 0-3.1-.43-4.44-1.2l-3.34.88.9-3.23c-.93-1.39-1.44-3.03-1.44-4.73 0-4.63 3.75-8.38 8.38-8.38zm-2.47 5.56c-.13 0-.25.04-.37.11-.27.16-.47.41-.6.7-.13.3-.2.64-.2 1s.07.7.2 1c.13.3.33.54.6.7.27.16.58.24.9.24.32 0 .63-.08.9-.24.27-.16.47-.41.6-.7.13-.3.2-.64.2-1s-.07-.7-.2-1c-.13-.3-.33-.54-.6-.7-.27-.16-.58-.24-.9-.24zm4.94 0c-.13 0-.25.04-.37.11-.27.16-.47.41-.6.7-.13.3-.2.64-.2 1s.07.7.2 1c.13.3.33.54.6.7.27.16.58.24.9.24.32 0 .63-.08.9-.24.27-.16.47-.41.6-.7.13-.3.2-.64.2-1s-.07-.7-.2-1c-.13-.3-.33-.54-.6-.7-.27-.16-.58-.24-.9-.24z" />
    </svg>
  );

  return (
    // Main section container with a vibrant gradient background
    <section className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-emerald-900 to-emerald-700 font-inter">
      {/* Background image for mobile (visible below large screens) */}
      <div className="lg:hidden absolute h-full w-full inset-0 z-10">
        <img
          src={hero} // Using placeholder image
          alt="Fondo de cancha de fútbol"
          className="w-full h-full object-cover blur-md brightness-75"
        />
        {/* Overlay to enhance text readability on mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70"></div>
      </div>

      {/* Background image for desktop (hidden below large screens) */}
      <div className="hidden lg:block lg:w-1/2 lg:h-full lg:absolute lg:top-0 lg:right-0 z-0">
        <img
          src={hero} // Using placeholder image
          alt="Fondo de cancha de fútbol"
          className="w-full h-full object-cover brightness-75"
        />
      </div>

      {/* Blurred overlay for desktop background image */}
      <div className="hidden lg:block absolute top-0 right-0 w-1/2 h-full bg-black/30 backdrop-blur-sm z-10"></div>

      {/* Main content area */}
      <div className="relative z-20 flex items-center justify-center lg:justify-start h-full px-6 text-white min-h-screen">
        {/* Animated content wrapper */}
        <div
          initial={{ x: -50, opacity: 0 }} // Initial animation state
          animate={{ x: 0, opacity: 1 }} // Animation target state
          transition={{ duration: 0.8, ease: "easeOut" }} // Animation properties
          className="max-w-xl lg:w-1/2 text-center lg:text-left space-y-8 p-6 lg:p-8 flex flex-col justify-center min-h-[75vh] lg:min-h-screen lg:justify-around"
        >
          {/* Logo with animation */}
          <img
            initial={{ y: 30, opacity: 0 }} // Initial animation state
            animate={{ y: 0, opacity: 1 }} // Animation target state
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }} // Animation properties
            src={logo} // Using placeholder logo
            alt="TurnoGol Logo"
            className="w-[160px] sm:w-[200px] xl:w-[280px] mx-auto lg:mx-0 drop-shadow-lg"
          />

          {/* Title and description section */}
          <div className="flex flex-col justify-center gap-6">
            <div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="text-4xl sm:text-5xl xl:text-7xl font-extrabold leading-tight bg-gradient-to-r from-green-400 via-emerald-400 to-teal-500 bg-clip-text text-transparent drop-shadow-md">
                Bienvenido a TurnoGol
              </h1>
              <p className="text-base sm:text-lg md:text-base xl:text-2xl text-gray-200 max-w-lg mx-auto lg:mx-0 w-full mt-4">
                Tu plataforma para reservar canchas de fútbol de forma rápida y
                sencilla. ¡Disfruta del mejor fútbol con amigos!
              </p>
            </div>

            {/* Action buttons */}
            <div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
              className="flex flex-col gap-4 justify-center lg:justify-start mt-6"
            >
              {/* "Reservar Turno" button */}
              <Link
                to="/canchas"
                className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-emerald-500/40 transition-all duration-300 active:scale-95 w-full sm:w-auto xl:text-2xl xl:py-4 xl:px-8 border-2 border-emerald-600 hover:border-emerald-700 transform hover:-translate-y-1"
              >
                {/* <SoccerBallIcon className="text-lg xl:text-2xl" /> Using inline SVG */}
                <span>Quiero reservar un turno</span>
                <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              {/* "Acceso Propietarios" button */}
              <Link
                to="/login"
                className="group inline-flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-gray-900/40 transition-all duration-300 active:scale-95 w-full sm:w-auto xl:text-2xl xl:py-4 xl:px-8 border-2 border-gray-700 hover:border-gray-800 transform hover:-translate-y-1"
              >
                <Handshake className="text-lg xl:text-2xl" /> {/* Using Lucide icon */}
                <span>Acceso para propietarios</span>
                <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* "Trabaja con nosotros" section */}
          <div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
            className="mt-6 text-center lg:text-left xl:text-xl text-gray-300 flex flex-col items-center lg:items-start"
          >
            <p className="text-gray-300 text-lg">¿Querés trabajar con nosotros?</p>
            <button
              onClick={() => setShowModal(true)}
              className="font-medium text-gray-800 mt-2 inline-flex items-center gap-2 bg-gray-100 py-2.5 px-5 rounded-lg hover:bg-gray-200 transition-colors duration-300 group xl:text-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              Más info aquí
              <ArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal for cancha owners */}

        {showModal && (
          <div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative"
              onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
            >
              {/* Close button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10 p-2 rounded-full hover:bg-gray-100"
                aria-label="Cerrar modal"
              >
                <X className="text-xl" /> {/* Using Lucide icon */}
              </button>

              {/* Modal content */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-emerald-100 rounded-full shadow-sm">
                    <Handshake className="text-emerald-600 text-2xl" /> {/* Using Lucide icon */}
                  </div>
                  <h2 className="text-2xl font-bold text-emerald-800">
                    Sumá tu cancha a TurnoGol
                  </h2>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Si sos dueño de una cancha de fútbol y querés aumentar tus
                  reservas, ¡este es el momento! Con TurnoGol, podés gestionar
                  tus turnos de forma fácil y rápida.
                </p>

                <div className="mb-8 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <h3 className="text-lg font-semibold text-emerald-700 mb-3">
                    Beneficios clave:
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Gestión automatizada de reservas 24/7 sin esfuerzo.",
                      "Aumento significativo de visibilidad y nuevos clientes.",
                      "Panel de control intuitivo y fácil de usar para una administración eficiente.",
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="text-emerald-500 mt-1.5 flex-shrink-0" /> {/* Using Lucide icon */}
                        <span className="text-gray-700 text-base">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-emerald-700 mb-4">
                    ¿Listo para empezar? Contactanos:
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="https://wa.me/5493814482619"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-center sm:justify-start gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-emerald-500/30 transform hover:-translate-y-0.5"
                    >
                      <WhatsappIcon className="text-xl group-hover:scale-110 transition-transform" /> {/* Using inline SVG */}
                      <span>Enviar WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </section>
  );
}