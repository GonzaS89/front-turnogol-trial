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

    <footer className="relative z-10 w-full bg-gray-950 py-4 text-gray-300 text-sm sm:text-base">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">    
          <p className="mb-2 text-gray-500">
            © {currentYear} TurnoGol. Todos los derechos reservados.
          </p>
          <p className="text-gray-500 mb-4 sm:mb-6"> {/* Añadido margen inferior para separar del botón */}
            Desarrollada por <span className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">Sinhg Gonzalo</span>.
          </p>
          
          <a
            href="https://wa.me/5493814482619"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 text-base shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
            aria-label="Contactar por WhatsApp"
          >
            <FaWhatsapp className="text-xl group-hover:text-2xl transition-all duration-300" />
            <span>Contactános</span>
          </a>
     
      </div>
    </footer>
  );
}

export default Footer;