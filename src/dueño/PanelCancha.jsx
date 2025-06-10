import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaCalendarAlt,
  FaRegClock,
  FaUserCog,
} from "react-icons/fa";
import { SeccionPanelCancha } from "./components/SeccionPanelCancha"; // Asegúrate de que este componente también sea estilizado
import { useEffect, useState } from "react";

export default function PanelCancha() {
  const location = useLocation();
  const navigate = useNavigate();
  const [canchaData, setCanchaData] = useState(null);

  // Cargar datos desde location.state (solo al montar)
  useEffect(() => {
    if (location.state?.cancha) {
      const canchaDesdeLogin = location.state.cancha;
      localStorage.setItem("datosCancha", JSON.stringify(canchaDesdeLogin));
      setCanchaData(canchaDesdeLogin);
    }
  }, []);

  // Si no hay datos en estado, intentar recuperar de localStorage
  useEffect(() => {
    if (!canchaData) {
      const storedCancha = localStorage.getItem("datosCancha");

      if (storedCancha) {
        try {
          const parsed = JSON.parse(storedCancha);

          // Validamos campos mínimos
          if (parsed && parsed.nombre && parsed.propietario_nombre) {
            setCanchaData(parsed);
          } else {
            console.warn("Datos incompletos en localStorage");
            navigate("/login", { replace: true });
          }
        } catch (error) {
          console.error("Error al parsear datos:", error);
          navigate("/login", { replace: true });
        }
      } else {
        console.warn("No hay datos guardados");
        navigate("/login", { replace: true });
      }
    }
  }, [canchaData, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("datosCancha");
    navigate("/login", { replace: true });
  };

  const secciones = [
    { seccion: "/verturnos", titulo: "Ver Turnos", icono: <FaCalendarAlt /> },
    { seccion: "/agregarturno", titulo: "Gestionar Turnos", icono: <FaRegClock /> }, // Cambié el texto para ser más general
    { seccion: "/micuenta", titulo: "Mi Perfil", icono: <FaUserCog /> }, // Cambié el texto
  ];

  // Mientras carga o si no hay datos
  if (!canchaData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="text-center p-8 bg-white shadow-xl rounded-lg border border-gray-200">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Cargando datos...</h2>
          <p className="mt-2 text-gray-600">Por favor espera un momento.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-emerald-50 to-green-100 font-sans p-4 sm:p-6 lg:p-8"
    >
      {/* Botón de cerrar sesión */}
      <div className="w-full max-w-5xl flex justify-end mb-6 sm:mb-8">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-base sm:text-lg text-gray-600 hover:text-red-600 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          aria-label="Cerrar sesión"
        >
          <FaSignOutAlt className="text-xl text-gray-500 group-hover:text-red-600 transition-colors" />
          <span>Cerrar sesión</span>
        </button>
      </div>

      {/* Bienvenida y Datos de la Cancha */}
      <header className="text-center mb-10 sm:mb-14 flex flex-col items-center bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200 max-w-xl lg:max-w-3xl w-full">
        {/* Logo circular con borde degradado */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-r from-green-500 to-emerald-700 p-1.5 mb-5 sm:mb-6 shadow-2xl overflow-hidden">
          <img
            src={canchaData?.logo || "/default-logo.png"}
            alt="Logo de la cancha"
            className="rounded-full object-cover w-full h-full border-4 border-white"
          />
        </div>

        {/* Títulos de bienvenida */}
        <div className="flex flex-col gap-2">
          <p className="text-xl sm:text-2xl lg:text-3xl text-emerald-700 font-bold mb-1">
            Hola, {canchaData?.propietario_nombre || "Propietario"} 👋
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-transparent leading-tight">
            Panel de Gestión
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mt-2">
            Cancha:{" "}
            <span className="font-semibold text-gray-800 uppercase tracking-wide">
              {canchaData?.nombre || "Tu cancha"}
            </span>
          </p>
        </div>
      </header>

      {/* Tarjetas de Acción - Responsive Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-2 sm:px-0">
        {secciones.map((item, index) => (
          <motion.div // Envuelve SeccionPanelCancha con motion.div para animaciones si el componente padre no lo hace
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <SeccionPanelCancha
              seccion={item.seccion}
              titulo={item.titulo}
              cancha={canchaData}
              icono={item.icono}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}