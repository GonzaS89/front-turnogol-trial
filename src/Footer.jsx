import React from 'react';
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa'; // Importa el icono de WhatsApp
import {Link} from 'react-router-dom'

/**
 * Componente Footer minimalista de la aplicación.
 * Muestra el nombre de la página, la atribución del desarrollador,
 * y un botón de contacto por WhatsApp.
 * Tiene un fondo oscuro para un alto contraste.
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (

    <footer className="relative z-10 w-full py-5 sm:py-6 bg-gray-800"> {/* Fondo oscuro para el footer */}
    <div className="container mx-auto px-4 sm:px-6 text-center">
      {/* Contenido del footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left text-gray-300">
        {/* Columna 1: Navegación */}
        {/* <div>
          <h3 className="text-white text-lg font-semibold mb-4">Navegación</h3>
          <ul>
            <li className="mb-2"><Link to="#" className="hover:text-emerald-400 transition-colors">Quiénes Somos</Link></li>
            <li className="mb-2"><Link to="#" className="hover:text-emerald-400 transition-colors">Términos y Condiciones</Link></li>
            <li className="mb-2"><Link to="#" className="hover:text-emerald-400 transition-colors">Política de Privacidad</Link></li>
          </ul>
        </div> */}

        {/* Columna 2: Contacto */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Contacto</h3>
          <p className="mb-2">Email: propietarios@turnogol.com</p>
          <p className="mb-2">Teléfono: +54 9 381 987-6543</p>
          <p>San Miguel de Tucumán, Argentina</p>
        </div>

        {/* Columna 3: Redes Sociales */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Síguenos</h3>
          <div className="flex justify-center md:justify-start space-x-4 text-2xl">
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors"><FaInstagram /></a>
            <a href="https://wa.me/5493814482619" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors"><FaWhatsapp /></a>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center border-t border-gray-700 pt-4 text-gray-500">
        &copy; 2025 TurnoGol. Todos los derechos reservados.
      </div>
    </div>
  </footer>
  );
}

export default Footer;