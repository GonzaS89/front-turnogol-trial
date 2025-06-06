import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaCalendarAlt,
  FaRegClock,
  FaUserCog,
} from "react-icons/fa";
import { SeccionPanelCancha } from "./components/SeccionPanelCancha";
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
    { seccion: "/agregarturno", titulo: "Agregar Turnos", icono: <FaRegClock /> },
    { seccion: "/micuenta", titulo: "Mi Cuenta", icono: <FaUserCog /> },
  ];

  // Mientras carga o si no hay datos
  if (!canchaData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold text-red-600">Sin datos</h2>
          <p className="mt-2 text-gray-600">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full text-gray-800 flex flex-col items-center justify-start px-4 py-6 sm:py-12"
    >
      {/* Botón de cerrar sesión */}
      <div className="w-full max-w-4xl flex justify-end mb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-red-500 bg-transparent px-3 py-1.5 rounded-lg transition-all duration-200 group focus:outline-none"
          aria-label="Cerrar sesión"
        >
          <FaSignOutAlt className="text-gray-400 group-hover:text-red-500 transition-colors" />
          <span>Cerrar sesión</span>
        </button>
      </div>

      {/* Bienvenida */}
      <header className="text-center mb-8 sm:mb-12 flex flex-col items-center gap-5">
        {/* Logo circular */}
        <div className="w-24 h-24 lg:h-auto rounded-full bg-gradient-to-r from-green-400 to-emerald-600 p-[2px] shadow-xl">
          <img
            src={canchaData?.logo || "/default-logo.png"}
            alt="Logo de la cancha"
            className="rounded-full object-cover w-full h-full"
          />
        </div>

        {/* Título */}
        <div className="flex flex-col gap-3">
          <p className="text-xl sm:text-2xl lg:text-lg text-emerald-700 font-semibold mb-1">
            Hola, {canchaData?.propietario_nombre || "Propietario"} 👋
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-2xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-transparent">
            Panel de Gestión
          </h1>
          <p className="text-sm sm:text-base lg:text-sm text-gray-500 mt-1">
            Cancha:{" "}
            <span className="font-medium text-gray-700 uppercase">
              {canchaData?.nombre || "Tu cancha"}
            </span>
          </p>
        </div>
      </header>

      {/* Tarjetas de Acción - Más modernas y responsivas */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1 gap-5 sm:gap-6 px-2 sm:px-4">
        {secciones.map((item, index) => (
         
            <SeccionPanelCancha
              seccion={item.seccion}
              titulo={item.titulo}
              cancha={canchaData}
              icono={item.icono}
            />
         
        ))}
      </div>
    </motion.div>
  );
}