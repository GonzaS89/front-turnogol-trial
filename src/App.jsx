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
      <div class="bg-gradient-to-br from-green-50 via-emerald-100 to-emerald-200 min-h-screen flex flex-col items-center justify-around relative">
  

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

      </div>
    </BrowserRouter>
  );
}

export default App;