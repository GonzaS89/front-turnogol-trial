import { Link } from 'react-router-dom';
import { CalendarCheck, PlusCircle, Settings, ArrowRight } from 'lucide-react'; // Using lucide-react for icons

// Helper function to dynamically get the icon based on the title
const obtenerIcono = (titulo) => {
  switch (titulo) {
    case 'Ver Turnos':
      // Icon for viewing turns, with a vibrant green color
      return <CalendarCheck className="text-3xl xl:text-4xl text-emerald-600 group-hover:text-emerald-700 transition-colors duration-200" />;
    case 'Agregar Turnos':
      // Icon for adding turns, with a distinct blue color
      return <PlusCircle className="text-3xl xl:text-4xl text-blue-600 group-hover:text-blue-700 transition-colors duration-200" />;
    case 'Mi Cuenta':
      // Icon for account settings, with a neutral gray color
      return <Settings className="text-3xl xl:text-4xl text-gray-600 group-hover:text-gray-700 transition-colors duration-200" />;
    default:
      return null; // Return null if no matching icon
  }
};

export const SeccionPanelCancha = ({seccion, titulo, cancha}) => {
  return (
    // Outer container for responsive padding and layout
    <div className="w-full px-2 sm:px-3 md:px-4 lg:px-0">
      {/* The main clickable link, styled as a card */}
      <Link
        to={seccion} // Navigation path
        state={{ cancha }} // State passed to the linked route
        className="
          group flex flex-col items-center justify-center w-full min-h-[120px] sm:min-h-[140px] lg:min-h-[160px] xl:min-h-[180px]
          p-4 sm:p-6 rounded-2xl bg-white border border-emerald-200
          hover:bg-emerald-50/70 transition-all duration-300
          shadow-md hover:shadow-lg hover:shadow-emerald-200/50
          transform hover:-translate-y-1 active:scale-98
          focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75
          overflow-hidden relative
        "
      >
        {/* Inner content wrapper to allow flex items */}
        <div className="flex items-center justify-between w-full h-full relative z-10">
          {/* Left section: Icon and Title */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Icon container with a subtle background and hover effect */}
            <div className="p-3 sm:p-4 lg:p-5 bg-emerald-100 rounded-xl group-hover:bg-emerald-200 transition-colors duration-200 shadow-sm">
              {obtenerIcono(titulo)} {/* Render the dynamic icon */}
            </div>
            {/* Title text with responsive sizing and hover color */}
            <span className="text-lg sm:text-xl md:text-2xl xl:text-3xl font-bold text-gray-800 group-hover:text-emerald-700 transition-colors duration-200">
              {titulo}
            </span>
          </div>

          {/* Right section: Arrow icon for visual indication of navigation */}
          {/* Hidden on small screens, visible and larger on larger screens */}
          <div className="text-emerald-500 group-hover:text-emerald-700 transition-colors duration-200
                        text-2xl lg:text-3xl xl:text-4xl
                        hidden sm:block opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2">
            <ArrowRight className="w-8 h-8" /> {/* Lucide arrow icon */}
          </div>
        </div>
      </Link>
    </div>
  );
};