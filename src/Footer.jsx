// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className=" w-full bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-gray-200 py-6 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-600 transition-colors duration-200 hover:text-emerald-700">
          <p className="tracking-wide text-sm lg:text-xl">
            © {new Date().getFullYear()} TurnoGol. Todos los derechos reservados.
          </p>
          <p className="mt-1 font-medium text-sm xl:text-xl">
            Desarrollado por{' '}
            <span className="text-emerald-700">Sinhg Gonzalo</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;