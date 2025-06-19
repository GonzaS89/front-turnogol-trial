import { useState } from 'react';
import './App.css'; // Assuming you have a global CSS file for App
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Import your page components
import PantallaInicial from './PantallaInicial'; // Esta es la página principal que el usuario quiere que muestre el footer
import Canchas from './cliente/Canchas/Canchas';
import ReservaDeTurno from './cliente/Turnos/ReservaDeTurno';
import ConfirmarTurno from './cliente/Confirmacion/ConfirmarTurno';
import LoginCancha from './dueño/LoginCancha';
import PanelCancha from './dueño/PanelCancha';
import VerTurnos from './dueño/VerTurnos';
import AgregarTurno from './dueño/AgregarTurno';
import MiCuenta from './dueño/MiCuenta';
import Footer from './Footer'; // Import your Footer component

/**
 * Layout component to conditionally display the Footer.
 * It now renders the Footer on ALL routes, including the home page ('/').
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components (Routes in this case).
 */
const Layout = ({ children }) => {
  // El hook useLocation es necesario si se quisieran condiciones más complejas,
  // pero para mostrar el footer en todas las rutas (incluida la inicial),
  // simplemente renderizamos el Footer incondicionalmente.
  // Si en el futuro quieres ocultarlo en rutas específicas, aquí es donde iría la lógica.
  // Por ejemplo: const showFooter = !['/login', '/otra-ruta-sin-footer'].includes(location.pathname);
  
  return (
    <>
      {children}
      <Footer /> {/* Render Footer siempre */}
    </>
  );
};

/**
 * Main App component that sets up routing and global layout.
 */
export default function App() {
  const [idCancha, setIdCancha] = useState();
  const [idTurno, setIdTurno] = useState();

  return (
    <BrowserRouter>
      {/* Main container with global background and SVG elements */}
      {/* Si el fondo es una imagen, asegúrate de que esté bien posicionada y no oculte el contenido */}
      <div className="bg-gradient-to-br from-green-50 via-emerald-100 to-emerald-200 min-h-screen flex flex-col items-center justify-around relative">

        {/* Background SVG elements for visual flair (se mantienen como estaban) */}
        <svg className="w-full h-full absolute inset-0 z-0" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <circle cx="25" cy="25" r="20" className="fill-current text-green-700 opacity-80"></circle>
          <rect x="10" y="55" width="80" height="35" rx="8" ry="8" className="fill-current text-white shadow-md"></rect>
          <circle cx="75" cy="70" r="15" className="fill-current text-green-300 opacity-90"></circle>
          <path d="M 5 5 Q 50 15 95 5 L 95 95 Q 50 85 5 95 Z" className="fill-current text-white opacity-60"></path>
          <ellipse cx="50" cy="50" rx="30" ry="15" className="fill-current text-green-500 opacity-40"></ellipse>
        </svg>

        {/* Content area that will hold routes and conditionally the footer */}
        {/* El 'Layout' component ahora siempre renderiza el Footer */}
        <Layout>
          <Routes>
            {/* Initial screen route */}
            <Route path="/" element={<PantallaInicial />} />

            {/* Player-facing views */}
            <Route path="/canchas" element={<Canchas setIdCancha={setIdCancha} />} />
            <Route
              path="/:seccioncancha"
              element={<ReservaDeTurno id={idCancha} enviarIdTurno={setIdTurno} />}
            />
            <Route
              path="/confirmaciondeturno"
              element={<ConfirmarTurno idTurno={idTurno} idCancha={idCancha} />}
            />

            {/* Owner-facing views */}
            <Route path="/login" element={<LoginCancha />} />
            {/* PrivateRoute is commented out, assuming it's not actively used or under development */}
            {/* <Route path="/panelcancha" element={<PrivateRoute element={<PanelCancha />} />} /> */}
            <Route path="/panelcancha" element={<PanelCancha />} />
            <Route path="/verturnos" element={<VerTurnos />} />
            <Route path="/agregarturno" element={<AgregarTurno />} />
            <Route path="/micuenta" element={<MiCuenta />} />
          </Routes>
        </Layout>
      </div>
    </BrowserRouter>
  );
}
