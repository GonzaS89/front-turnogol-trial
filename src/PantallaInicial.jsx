import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import {
  FaFutbol,
  FaArrowRight,
  FaWhatsapp,
  FaRegHandshake,
  FaTimes,
  FaCheck
} from "react-icons/fa";
import imgHero from "/hero-cancha.jpeg";
import logo from "/logo.png"; // Asegúrate de tener esta imagen
// Asegúrate de tener esta imagen

export default function PantallaInicial () {
  const [showModal, setShowModal] = useState(false);

  return (
     <section className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-emerald-900 to-emerald-700">
      {/* Fondo - solo en móvil */}
      <div className="lg:hidden absolute h-screen inset-0 bg-black/20 backdrop-blur-sm z-10">
        <img
          src={imgHero}
          alt="Fondo de cancha"
          className="w-full h-full object-cover blur-md brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70"></div>
      </div>

      {/* Imagen derecha - solo en desktop */}
      <div className="hidden lg:block lg:w-1/2 lg:h-full lg:absolute lg:top-0 lg:right-0 z-0">
        <img
          src={imgHero}
          alt="Fondo de cancha"
          className="w-full h-full object-cover blur-xs brightness-75"
        />
      </div>

      {/* Backdrop difuminado - solo en desktop */}
      <div className="hidden lg:block absolute top-0 right-0 w-1/2 h-full bg-black/30 backdrop-blur-sm z-10"></div>

      {/* Contenido - siempre a la izquierda */}
      <div className="relative z-20 flex items-center justify-center lg:justify-start h-full px-6 text-white">
        <div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl lg:w-1/2 text-center lg:text-left space-y-6 p-6 lg:p-8 flex flex-col justify-center h-[75vh] lg:h-auto lg:justify-around"
        >
          {/* Logo */}
          <img
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            src="/logo.png"
            alt="TurnoGol Logo"
            className="w-[140px] sm:w-[180px] xl:w-[250px] mx-auto lg:mx-0"
          />  
          {/* Espacio entre logo y título */}
          <div className="flex flex-col justify-center gap-6 h-2/3">
              {/* Título */}
              <div>
              <h1 className="text-4xl sm:text-5xl xl:text-7xl font-extrabold leading-tight bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
            Bienvenido a TurnoGol
          </h1>

          {/* Descripción */}
          <p className="text-base sm:text-lg md:text-base xl:text-2xl text-gray-200 max-w-lg mx-auto lg:mx-0 w-full">
            Tu plataforma para reservar canchas de fútbol de forma rápida y sencilla. ¡Disfruta del mejor fútbol con amigos!
          </p>
              </div>
          

          {/* Botón */}
          <Link
            to="/canchas"
            className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 active:scale-95 w-full sm:w-auto xl:text-2xl xl:py-4"
          >
            <FaFutbol className="text-lg xl:text-2xl" />
            <span>Quiero reservar un turno</span>
            <FaArrowRight className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          </div>
          

          {/* Info trabajo */}
          <div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center lg:text-left xl:text-xl text-gray-300 flex flex-col items-center lg:items-start"
          >
            <p>¿Querés trabajar con nosotros?</p>
            <button
              onClick={() => setShowModal(true)}
              className="font-medium text-gray-800 mt-1 inline-flex items-center gap-1 bg-gray-50 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors duration-300 group xl:text-lg"
            >
              Más info aquí
              <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal para dueños de canchas */}
      <AnimatePresence>
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
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón cerrar */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Cerrar modal"
              >
                <FaTimes className="text-xl" />
              </button>

              {/* Contenido del modal */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-emerald-100 rounded-full">
                    <FaRegHandshake className="text-emerald-600 text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-emerald-800">Sumá tu cancha a TurnoGol</h2>
                </div>

                <p className="text-gray-600 mb-6">
                  Si sos dueño de una cancha de fútbol y querés aumentar tus reservas, ¡este es el momento! Con TurnoGol, podés gestionar tus turnos de forma fácil y rápida.
                </p>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-emerald-700 mb-3">Beneficios:</h3>
                  <ul className="space-y-3">
                    {[
                      "Gestión automatizada de reservas 24/7",
                      "Aumento de visibilidad",
                      "Panel de control intuitivo y fácil de usar",
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <FaCheck className="text-emerald-500 mt-1" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-emerald-700 mb-4">Contacto directo:</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="https://wa.me/5493814482619" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-center sm:justify-start gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-4 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <FaWhatsapp className="text-green-600 group-hover:scale-110 transition-transform" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};