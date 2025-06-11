import React from 'react';
import { FaWhatsapp } from 'react-icons/fa'; // Importa el icono de WhatsApp

/**
 * Componente Footer minimalista de la aplicación.
 * Muestra el nombre de la página, la atribución del desarrollador,
 * y un botón de contacto por WhatsApp.
 * Tiene un fondo oscuro para un alto contraste.
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // Contenedor principal del footer.
    // - `relative z-10`: Asegura que el footer esté por encima de otros elementos de fondo.
    // - `w-full`: Ocupa todo el ancho disponible.
    // - `py-8 sm:py-10`: Padding vertical responsivo.
    // - `bg-gray-950`: Fondo gris muy oscuro para contraste.
    // - `text-gray-300`: Color de texto base claro.
    // - `text-sm sm:text-base`: Tamaño de fuente responsivo.
    <footer className="relative z-10 w-full bg-gray-950 py-8 sm:py-10 text-gray-300 text-sm sm:text-base">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

        {/* Nombre de la página y Descripción */}
        <div className="mb-6">
          <h3 className="font-bold text-xl sm:text-2xl text-white mb-2">
            TurnoGol
          </h3>
          <p className="max-w-prose leading-relaxed">
            Tu plataforma para reservar canchas de fútbol.
          </p>
        </div>

        {/* Botón de Contacto por WhatsApp */}
        <a
          href="https://wa.me/5493814482619"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200 text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mb-8"
        >
          <FaWhatsapp className="text-xl" />
          <span>Contactános</span>
        </a>

        {/* Derechos de Autor y Atribución */}
        <div className="pt-6 border-t border-gray-800 w-full">
          <p className="mb-2 text-gray-500">
            © {currentYear} TurnoGol. Todos los derechos reservados.
          </p>
          <p className="text-gray-500">
            Desarrollada por <span className="font-semibold text-emerald-400">Sinhg Gonzalo</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
