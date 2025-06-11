import { Link } from "react-router-dom";
import {
  CalendarDays, // Nuevo: Para 'Ver Turnos' - Representa días en un calendario
  PlusSquare, // Nuevo: Para 'Agregar Turnos' - Un cuadrado con un signo más, más robusto
  UserCircle, // Nuevo: Para 'Mi Cuenta' - Un icono de usuario más reconocible
  ArrowRight,
} from "lucide-react"; // Usamos lucide-react para los íconos

// Función de ayuda para obtener el icono dinámicamente según el título
const obtenerIcono = (titulo) => {
  switch (titulo) {
    case "Ver Turnos":
      // Icono para ver turnos: CalendarDays (más claro y directo)
      return (
        <CalendarDays className="text-3xl xl:text-4xl text-emerald-600 group-hover:text-emerald-700 transition-colors duration-200" />
      );
    case "Gestionar Turnos":
      // Icono para agregar turnos: PlusSquare (más visible y con una forma definida)
      return (
        <PlusSquare className="text-3xl xl:text-4xl text-blue-600 group-hover:text-blue-700 transition-colors duration-200" />
      );
    case "Mi Perfil":
      // Icono para la configuración de la cuenta: UserCircle (un icono de persona dentro de un círculo, muy estándar)
      return (
        <UserCircle className="text-3xl xl:text-4xl text-gray-600 group-hover:text-gray-700 transition-colors duration-200" />
      );
    default:
      return null;
  }
};

export const SeccionPanelCancha = ({ seccion, titulo, cancha }) => {
  // Determina el color principal del icono y del borde hover basado en el título
  const colorClass =
    titulo === "Ver Turnos"
      ? "border-emerald-200 hover:border-emerald-500"
      : titulo === "Agregar Turnos"
      ? "border-blue-200 hover:border-blue-500"
      : "border-gray-200 hover:border-gray-500";

  const bgColorClass =
    titulo === "Ver Turnos"
      ? "bg-emerald-50/70 hover:bg-emerald-100"
      : titulo === "Agregar Turnos"
      ? "bg-blue-50/70 hover:bg-blue-100"
      : "bg-gray-50/70 hover:bg-gray-100";

  const shadowColorClass =
    titulo === "Ver Turnos"
      ? "shadow-emerald-200/50 hover:shadow-emerald-300/60"
      : titulo === "Agregar Turnos"
      ? "shadow-blue-200/50 hover:shadow-blue-300/60"
      : "shadow-gray-200/50 hover:shadow-gray-300/60";

  const iconBgColorClass =
    titulo === "Ver Turnos"
      ? "bg-emerald-100 group-hover:bg-emerald-200"
      : titulo === "Agregar Turnos"
      ? "bg-blue-100 group-hover:bg-blue-200"
      : "bg-gray-100 group-hover:bg-gray-200";

  const titleColorClass =
    titulo === "Ver Turnos"
      ? "group-hover:text-emerald-700"
      : titulo === "Agregar Turnos"
      ? "group-hover:text-blue-700"
      : "group-hover:text-gray-700";

  const arrowColorClass =
    titulo === "Ver Turnos"
      ? "text-emerald-500 group-hover:text-emerald-700"
      : titulo === "Agregar Turnos"
      ? "text-blue-500 group-hover:text-blue-700"
      : "text-gray-500 group-hover:text-gray-700";

  return (
    <div className="w-full px-2 sm:px-3 md:px-4 lg:px-0">
      <Link
        to={seccion}
        state={{ cancha }}
        className={`
          group flex flex-col items-center justify-center w-full min-h-[120px] xl:min-h-[180px]
          p-4 sm:p-6 rounded-2xl bg-white border ${colorClass}
          ${bgColorClass} transition-all duration-300
          shadow-md ${shadowColorClass}
          transform hover:-translate-y-1 active:scale-98
          focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75
          overflow-hidden relative
        `}
      >
        <div className="flex items-center justify-between w-full h-full relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div
              className={`p-3 lg:p-5 rounded-xl ${iconBgColorClass} transition-colors duration-200 shadow-sm`}
            >
              {obtenerIcono(titulo)}
            </div>
            <span
              className={`text-lg sm:text-xl xl:text-3xl font-bold text-gray-800 ${titleColorClass} transition-colors duration-200`}
            >
              {titulo}
            </span>
          </div>

          <div
            className={`text-2xl lg:text-3xl xl:text-4xl ${arrowColorClass} transition-colors duration-200
                         hidden sm:block opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2`}
          >
            <ArrowRight className="w-8 h-8" />
          </div>
        </div>
      </Link>
    </div>
  );
};
