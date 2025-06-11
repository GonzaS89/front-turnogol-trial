import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFutbol,
  FaArrowRight,
  FaWhatsapp,
  FaRegHandshake,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import imgHero from "/hero2.jpg";
import logo from "/logo.png";

export default function PantallaInicial() {
  const [showModal, setShowModal] = useState(false);

  // Animaciones Framer Motion
  const textVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 150, delay: 0.3 } },
  };

  const imagePanelVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 150, delay: 0.5 } },
  };

  const buttonVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 150, delay: 0.7 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", damping: 25, stiffness: 200 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-emerald-900 to-emerald-800 font-sans">
      {/* Fondo fijo con efecto de profundidad */}
      <div className="fixed inset-0 z-0">
        <img
          src={imgHero}
          alt="Fondo de cancha de fútbol"
          className="w-full h-full object-cover object-center animate-fade-in"
          style={{
            filter: "brightness(.6) blur(2px)",
            transform: "scale(1.03)",
          }}
        />
        {/* Degradado para integrar el fondo con los bordes de la pantalla */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 backdrop-blur-sm"></div>
      </div>

      {/* Barra superior para "Acceso propietarios" */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-20 w-full py-4 px-4 sm:px-6 flex justify-end"
      >
        <Link
          to="/login"
          className="group flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base border border-white/20 backdrop-blur-sm"
        >
          <FaRegHandshake className="text-lg" />
          <span className="hidden sm:inline">Acceso propietarios</span>
          <span className="sm:hidden">Acceso propietarios</span>
          <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {/* Contenido principal: Orden adaptable según tamaño de pantalla */}
      <main className="relative z-10 flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center lg:items-center gap-8 lg:gap-12">
          {/* Sección de Texto (Izquierda en desktop, abajo en mobile) */}
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 text-center lg:text-left p-4 sm:p-6 lg:p-0"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent drop-shadow-lg">
                ¡Reservá tu cancha!
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 max-w-xl lg:max-w-none mx-auto lg:mx-0 leading-relaxed mb-8 sm:mb-10 drop-shadow-md">
              Encontrá, reservá y jugá. Así de fácil con TurnoGol.
            </p>
            <motion.div variants={buttonVariants}>
              <Link
                to="/canchas"
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-extrabold py-4 px-8 sm:py-5 sm:px-10 md:py-6 md:px-12 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:scale-95 text-lg sm:text-xl md:text-2xl whitespace-nowrap"
              >
                <FaFutbol className="text-xl sm:text-2xl" />
                <span>Reservar ahora</span>
                <FaArrowRight className="text-base group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Sección de Imagen/Logo (Derecha en desktop, arriba en mobile) */}
          {/* ELIMINADO EL FONDO Y AJUSTADO EL TAMAÑO RESPONSIVE DEL LOGO */}
          <motion.div
            variants={imagePanelVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 w-full lg:max-w-lg text-center" // Eliminado padding, shadow, backdrop-blur y border. Centrado el contenido.
          >
            <img
              src={logo}
              alt="TurnoGol Logo"
              className="w-48 sm:w-56 md:w-64 lg:w-[600px] mx-auto drop-shadow-2xl" // Ajustado el tamaño base a w-48 y escalado en sm, md, lg
            />
          </motion.div>
        </div>
      </main>

      {/* Footer fijo en la parte inferior */}
      <footer className="relative z-10 w-full py-5 sm:py-6 bg-black/30 backdrop-blur-sm border-t border-gray-700/50">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm sm:text-base text-gray-400 mb-3">
            ¿Tenés una cancha y querés sumarla?
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="text-sm sm:text-base font-medium text-white inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 py-2.5 px-5 rounded-lg transition-colors duration-200 group shadow-md hover:shadow-lg"
          >
            Más información
            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </footer>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 transform scale-100">
              <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-green-700 z-10 p-4 sm:p-5 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg shadow-sm">
                    <FaRegHandshake className="text-emerald-600 text-xl sm:text-2xl" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Sumá tu cancha
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-emerald-100 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="p-4 sm:p-6 text-gray-800">
                <p className="text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                  Si sos dueño de una cancha de fútbol y querés aumentar tus
                  reservas, ¡esta es tu oportunidad!
                </p>

                <div className="mb-6 sm:mb-8">
                  <h3 className="font-bold text-xl sm:text-2xl text-gray-800 mb-3 sm:mb-4">
                    Beneficios:
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Gestión automatizada de reservas 24/7",
                      "Aumento de visibilidad y nuevos clientes",
                      "Panel de control intuitivo y reportes detallados",
                      "Soporte y acompañamiento continuo",
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <FaCheck className="text-emerald-500 mt-1 flex-shrink-0 text-lg" />
                        <span className="text-gray-700 text-base sm:text-lg">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="font-bold text-xl sm:text-2xl text-gray-800 mb-3 sm:mb-4">
                    Contactanos:
                  </h3>
                  <p className="text-gray-700 mb-4 text-base sm:text-lg">
                    Estamos listos para resolver tus dudas y ayudarte a crecer.
                  </p>
                  <a
                    href="https://wa.me/5493814482619"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 sm:py-3.5 px-6 sm:px-8 rounded-lg transition-colors duration-200 text-base sm:text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <FaWhatsapp className="text-xl" />
                    <span>Enviar WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}