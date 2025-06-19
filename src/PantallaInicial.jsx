import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFutbol,
  FaFacebook,
  FaInstagram,
  FaArrowRight,
  FaWhatsapp,
  FaRegHandshake,
  FaTimes,
  FaCheck,
  FaChartLine,
  FaCalendarCheck,
  FaMobileAlt,
  FaShieldAlt,
  FaPlusCircle,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import logo from '/logo.png'


export default function PantallaInicial() {
  const [showModal, setShowModal] = useState(false);

  // Animaciones Framer Motion
  const textVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 150, delay: 0.3 },
    },
  };

  const buttonVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 150, delay: 0.7 },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", damping: 25, stiffness: 200 },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-emerald-50 to-white font-sans">
      {/* Barra superior con Logo y Acceso Propietarios */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-20 w-full py-4 px-4 sm:px-6 flex justify-between items-center"
      >
        {/* LOGO: Más grande en mobile (h-12) y más pequeño en desktop (sm:h-10) */}
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="TurnoGol Logo" className="h-24 sm:h-10" />{" "}
          {/* Ajusta h-12 y sm:h-10 según necesites */}
        </Link>

        <Link
          to="/login"
          className="group flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base border border-blue-700 hover:bg-blue-700"
        >
          <FaRegHandshake className="text-lg" />
          <span className="hidden sm:inline">Acceso propietarios</span>
          <span className="sm:hidden">Acceso</span>{" "}
          {/* Versión más corta para móviles */}
          <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {/* Contenido principal de la página de beneficios */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 text-gray-800">
        <div className="w-full max-w-7xl mx-auto text-center mb-12">
          {/* Título de la página de beneficios */}
          <motion.h1
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4 sm:mb-6"
          >
            <span className="bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent drop-shadow-lg">
              ¡Digitalizá tu Complejo de Fútbol con TurnoGol!
            </span>
          </motion.h1>
          <motion.p
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-xl mx-auto leading-relaxed drop-shadow-md"
          >
            Aumenta tus reservas, simplifica la gestión y llega a más personas.
          </motion.p>
        </div>

        {/* Sección de Beneficios Clave */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xl border border-gray-200 w-full max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 sm:mb-10 text-center">
            Beneficios Exclusivos para Propietarios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Beneficio 1 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-start p-5 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors duration-300 shadow-md border border-gray-200"
            >
              <FaChartLine className="text-4xl text-emerald-600 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Más Visibilidad y Reservas
                </h3>
                <p className="text-gray-700 text-base">
                  Tu complejo aparecerá en nuestras búsquedas, atrayendo a
                  nuevos jugadores cada día.
                </p>
              </div>
            </motion.div>
            {/* Beneficio 2 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-start p-5 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors duration-300 shadow-md border border-gray-200"
            >
              <FaCalendarCheck className="text-4xl text-emerald-600 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Gestión de Horarios Simple
                </h3>
                <p className="text-gray-700 text-base">
                  Administra tus horarios y disponibilidad desde un panel
                  intuitivo, sin llamadas ni papeles.
                </p>
              </div>
            </motion.div>
            {/* Beneficio 3 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex items-start p-5 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors duration-300 shadow-md border border-gray-200"
            >
              <FaMobileAlt className="text-4xl text-emerald-600 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Acceso 24/7 y desde Cualquier Lugar
                </h3>
                <p className="text-gray-700 text-base">
                  Controla tus reservas desde tu celular o computadora, estés
                  donde estés.
                </p>
              </div>
            </motion.div>
            {/* Beneficio 4 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-start p-5 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors duration-300 shadow-md border border-gray-200"
            >
              <FaShieldAlt className="text-4xl text-emerald-600 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Pagos Seguros y Centralizados
                </h3>
                <p className="text-gray-700 text-base">
                  Ofrece a tus clientes diversas opciones de pago y recibe tus
                  ingresos de forma segura.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Sección "Cómo Funciona para Propietarios" */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xl border border-gray-200 w-full max-w-5xl mx-auto mt-12 sm:mt-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 sm:mb-10 text-center">
            ¡Empezá en 3 Simples Pasos!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Paso 1 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col items-center p-6 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors duration-300 shadow-md border border-gray-200"
            >
              <span className="text-5xl font-bold text-blue-600 mb-4">1</span>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Regístrate en TurnoGol
              </h3>
              <p className="text-gray-700 text-base">
                Ponte en contacto con nosotros para habilitar tu complejo como
                cliente.
              </p>
            </motion.div>
            {/* Paso 2 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-col items-center p-6 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors duration-300 shadow-md border border-gray-200"
            >
              <span className="text-5xl font-bold text-blue-600 mb-4">2</span>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                Configura tus Canchas y Horarios
              </h3>
              <p className="text-gray-700 text-base">
                Añade los detalles de tus canchas y establece tu disponibilidad
                fácilmente.
              </p>
            </motion.div>
            {/* Paso 3 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-col items-center p-6 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors duration-300 shadow-md border border-gray-200"
            >
              <span className="text-5xl font-bold text-blue-600 mb-4">3</span>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                ¡Comienza a Recibir Reservas!
              </h3>
              <p className="text-gray-700 text-base">
                Nuestra plataforma se encarga de conectar tus canchas con los
                jugadores.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA Final */}
        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          className="mt-12 sm:mt-16 text-center"
        >
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 px-8 sm:py-5 sm:px-10 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:scale-95 text-lg sm:text-xl whitespace-nowrap"
          >
            <FaPlusCircle className="text-xl sm:text-2xl" />
            <span>Quiero Unirme a TurnoGol Hoy</span>
            <FaArrowRight className="text-base hidden sm:inline-block" />
          </button>
        </motion.div>
      </main>

      {/* Footer fijo en la parte inferior */}
      {/* Puedes agregar tu footer aquí si lo deseas */}
 

      {/* Modal para más información */}
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
                    ].map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
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