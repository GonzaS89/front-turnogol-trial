import { Link } from 'react-router-dom';
import { FcCalendar, FcPlus } from "react-icons/fc";
import { IoSettingsSharp } from "react-icons/io5";

const obtenerIcono = (titulo) => {
  switch (titulo) {
    case 'Ver Turnos':
        return <FcCalendar className="text-3xl xl:text-4xl text-emerald-600" />;
    case 'Agregar Turnos':
        return <FcPlus className="text-3xl xl:text-4xl text-blue-600" />;
    case 'Mi Cuenta':        
        return <IoSettingsSharp className="text-3xl xl:text-4xl text-gray-600" />;
    default:
        return null;
    }
    };

export const SeccionPanelCancha = ({seccion, titulo, cancha}) => {
  return (
     <div
        >
          <Link to={seccion} state={{ cancha }} className="group flex flex-col items-center justify-center w-full h-full">
            <div className="w-full xl:w-[900px] lg:w-auto flex items-center justify-between h-full p-4 sm:p-6 rounded-xl bg-white border border-emerald-200 hover:bg-emerald-50/70 transition-all duration-300 shadow-md hover:shadow-emerald-200/50">
              <div className="flex items-center gap-4">
                <div className="p-3 lg:p-6 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                  {obtenerIcono(titulo)}
                </div>
                <span className="text-lg lg:text-base xl:text-xl font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">
                  {titulo}
                </span>
              </div>
              <div className="text-emerald-500 group-hover:text-emerald-700 transition-colors mt-2 text-right hidden lg:block lg:text-3xl">
                →
              </div>
            </div>
          </Link>
        </div>
  )
}
