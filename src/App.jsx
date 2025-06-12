import { useState } from 'react';
import './App.css'; // Assuming you have a global CSS file for App
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Import your page components
import PantallaInicial from './PantallaInicial';
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
 * It checks the current route and renders the Footer only if the path is not '/'.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components (Routes in this case).
 */
const Layout = ({ children }) => {
  const location = useLocation();
  // Determine if the footer should be shown (true for all paths EXCEPT '/')
  const showFooter = location.pathname !== '/';

  return (
    <>
      {children}
      {showFooter && <Footer />} {/* Render Footer conditionally */}
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
      <div className="bg-gradient-to-br from-green-50 via-emerald-100 to-emerald-200 min-h-screen flex flex-col items-center justify-around relative">

        {/* Background SVG elements for visual flair */}
        <svg className="w-full h-full absolute inset-0 z-0" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <circle cx="25" cy="25" r="20" className="fill-current text-green-700 opacity-80"></circle>
          <rect x="10" y="55" width="80" height="35" rx="8" ry="8" className="fill-current text-white shadow-md"></rect>
          <circle cx="75" cy="70" r="15" className="fill-current text-green-300 opacity-90"></circle>
          <path d="M 5 5 Q 50 15 95 5 L 95 95 Q 50 85 5 95 Z" className="fill-current text-white opacity-60"></path>
          <ellipse cx="50" cy="50" rx="30" ry="15" className="fill-current text-green-500 opacity-40"></ellipse>
        </svg>

        {/* Content area that will hold routes and conditionally the footer */}
        {/* The 'Layout' component wraps the 'Routes' to manage footer visibility */}
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
