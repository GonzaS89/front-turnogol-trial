import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import PantallaInicial from './PantallaInicial';
import Canchas from './cliente/Canchas/Canchas';
import ReservaDeTurno from './cliente/Turnos/ReservaDeTurno';
import ConfirmarTurno from './cliente/Confirmacion/ConfirmarTurno';
import LoginCancha from './dueño/LoginCancha';
import PanelCancha from './dueño/PanelCancha';
import VerTurnos from './dueño/VerTurnos';
import AgregarTurno from './dueño/AgregarTurno';
import MiCuenta from './dueño/MiCuenta';
import PrivateRoute from './dueño/PrivateRoute';
import Footer from './Footer'; // Importamos el footer

// Componente para ocultar footer en PantallaInicial
// const Layout = ({ children }) => {
//   const location = useLocation();
//   const showFooter = location.pathname !== '/';

//   return (
//     <>
//       {children}
//       {showFooter && <Footer />}
//     </>
//   );
// };

function App() {
  const [idCancha, setIdCancha] = useState();
  const [idTurno, setIdTurno] = useState();

  return (
    <BrowserRouter>
      <div className="bg-gradient-to-br from-green-50 via-emerald-100 to-emerald-200 min-h-screen flex flex-col items-center justify-around relative">

        <svg className="w-full h-full absolute" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">

          <circle cx="25" cy="25" r="20" class="fill-current text-green-700 opacity-80"></circle>

          <rect x="10" y="55" width="80" height="35" rx="8" ry="8" class="fill-current text-white shadow-md"></rect>

          <circle cx="75" cy="70" r="15" class="fill-current text-green-300 opacity-90"></circle>


          <path d="M 5 5 Q 50 15 95 5 L 95 95 Q 50 85 5 95 Z" class="fill-current text-white opacity-60"></path>


          <ellipse cx="50" cy="50" rx="30" ry="15" class="fill-current text-green-500 opacity-40"></ellipse>
        </svg>
        <Routes>
          {/* Pantalla inicial */}
          <Route path="/" element={<PantallaInicial />} />

          {/* Vista para jugadores */}
          <Route path="/canchas" element={<Canchas idCancha={setIdCancha} />} />
          <Route
            path="/:seccioncancha"
            element={<ReservaDeTurno id={idCancha} enviarIdTurno={setIdTurno} />}
          />
          <Route
            path="/confirmaciondeturno"
            element={<ConfirmarTurno idTurno={idTurno} idCancha={idCancha} />}
          />

          {/* Vista para dueños */}
          <Route path="/login" element={<LoginCancha />} />


          <Route path="/panelcancha" element={<PanelCancha />} />


          <Route path="/verturnos" element={<VerTurnos />} />
          <Route path="/agregarturno" element={<AgregarTurno />} />
          <Route path="/micuenta" element={<MiCuenta />} />
        </Routes>
        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;