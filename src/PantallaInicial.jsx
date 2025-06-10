import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import {
  FaFutbol,
  FaArrowRight,
  FaWhatsapp,
  FaRegHandshake,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import imgHero from "/hero-cancha.jpeg";
import logo from "/logo.png";

export default function PantallaInicial() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-emerald-900 to-emerald-800 font-sans">
      {/* Fondo fijo */}
      <div className="fixed inset-0 z-0">
        <img
          src={imgHero}
          alt="Fondo de cancha"
          className="w-full h-full object-cover"
          style={{
            filter: "brightness(0.4) blur(3px)",
            transform: "scale(1.02)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/80"></div>
      </div>

      {/* Top bar for "Acceso propietarios" - Always at top-right */}
      <div className="relative z-20 w-full py-3 px-4 sm:px-6 flex justify-end">
        <Link
          to="/login"
          className="group flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
        >
          <FaRegHandshake className="text-lg" />
          <span className="hidden sm:inline">Acceso propietarios</span>{" "}
          {/* Hidden on small screens */}
          <span className="sm:hidden">Propietarios</span>{" "}
          {/* Visible on small screens */}
          <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Contenido principal centrado para todas las pantallas */}
      <main className="relative z-10 flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 rounded-xl shadow-2xl text-center">
          {/* Logo - Centered and larger */}
          <div className="mb-6 sm:mb-8 md:mb-10 flex justify-center">
            <img
              src={logo}
              alt="TurnoGol Logo"
              className="w-40 sm:w-48 md:w-56 lg:w-72 drop-shadow-lg" /* Increased logo size */
            />
          </div>

          {/* Título y descripción - Centered */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Bienvenido a TurnoGol
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-md mx-auto leading-relaxed">
              Tu plataforma para reservar canchas de fútbol de forma rápida y
              sencilla.
            </p>
          </div>

          {/* Botón "Reservar turno" - Centered */}
          <div className="mt-8 sm:mt-10 md:mt-12 flex justify-center">
            <Link
              to="/canchas"
              className="group flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 sm:py-3.5 sm:px-8 md:py-4 md:px-10 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-base sm:text-lg md:text-xl"
            >
              <FaFutbol className="text-lg sm:text-xl" />
              <span>Reservar turno</span>
              <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer fijo en la parte inferior */}
      <footer className="relative z-10 w-full py-4 sm:py-6 bg-black/20 backdrop-blur-sm border-t border-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm sm:text-base text-gray-400 mb-2">
            ¿Querés trabajar con nosotros?
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="text-sm sm:text-base font-medium text-white inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 py-2 px-4 rounded-md transition-colors duration-200 group shadow-sm"
          >
            Más información
            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </footer>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <FaRegHandshake className="text-emerald-600" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Sumá tu cancha
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-4 sm:p-6">
                <p className="text-gray-600 mb-4 sm:mb-6">
                  Si sos dueño de una cancha de fútbol y querés aumentar tus
                  reservas, ¡este es el momento!
                </p>

                <div className="mb-6 sm:mb-8">
                  <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4">
                    Beneficios:
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Gestión automatizada de reservas 24/7",
                      "Aumento de visibilidad",
                      "Panel de control intuitivo",
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <FaCheck className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4">
                    Contacto directo:
                  </h3>
                  <a
                    href="https://wa.me/5493814482619"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 sm:py-3 px-4 sm:px-5 rounded-lg transition-colors duration-200 text-sm sm:text-base"
                  >
                    <FaWhatsapp className="text-lg" />
                    <span>Contactar por WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}