import { useLocation, useParams } from "react-router-dom";
import { useCanchas } from "../../customHooks/useCanchas";
import { useObtenerTurnosxCancha } from "../../customHooks/useObtenerTurnosxCancha";
import { FaFutbol, FaClock } from "react-icons/fa";
import { Turno } from "./components/Turno";
// Obtener el id de la cancha desde el estado de la ubicación

export default function ReservaDeTurno() {
  const location = useLocation();
  const { seccioncancha: seccion } = useParams();
  const { idCancha: canchaId } = location.state || {};
  const { datos: canchas, isLoading: loadingCancha } = useCanchas();
  const cancha = canchas.find((item) => item.seccion === seccion || item.id === canchaId);
  const { turnos, isLoading, error } = useObtenerTurnosxCancha(canchaId);

  console.log("Datos de la cancha:", canchaId);

  const fechaHoy = new Date().toLocaleDateString("sv-SE"); // "YYYY-MM-DD"

  // Función para ordenar los turnos por hora
  const ordenarTurnos = (turnos) => {
    return turnos?.sort((a, b) => {
      const getMinutos = (horaStr) => {
        const [hora, minutos] = horaStr.split(":").map(Number);
        return hora === 0 ? 1440 : hora * 60 + minutos;
      };
      return getMinutos(a.hora) - getMinutos(b.hora);
    });
  };

  // Filtrar y ordenar turnos de hoy
  const turnosDeHoy = ordenarTurnos(
    turnos?.filter((turno) => turno.fecha.split("T")[0] === fechaHoy)
  );

  return (
    <div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen flex flex-col gap-4 sm:gap-6"
    >
      {/* Header con efecto blur, logo dentro y texto destacado */}
      {/* Banner con loader */}
      <div className="relative">
        {/* Imagen de portada */}
        <div className="h-44 xl:h-60 w-full bg-gray-200 overflow-hidden relative">
          {cancha?.portada ? (
            <img
              src={cancha.portada}
              alt={`Portada de ${cancha.nombre}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-green-600 to-emerald-800"></div>
          )}

          {/* Overlay sutil */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent backdrop-brightness-50 backdrop-blur-sm"></div>
        </div>

        {/* Loader mientras carga */}
        {loadingCancha ? (
          <div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center backdrop-blur-sm"
          >
            <div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-emerald-300 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-between px-4 sm:px-6 xl:w-[1200px] xl:mx-auto">
            {/* Logo circular */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-28 lg:h-28 xl:w-32 xl:h-32 rounded-full border-2 border-white shadow-lg overflow-hidden flex-shrink-0 z-10">
                {cancha?.logo ? (
                  <img
                    src={cancha.logo}
                    alt={`Logo de ${cancha.nombre}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-500 flex items-center justify-center">
                    <FaFutbol className="text-white text-xl sm:text-2xl" />
                  </div>
                )}
              </div>
              {/* Texto del nombre y ubicación */}
              <div className="text-white drop-shadow-lg px-4 py-3 sm:px-5 sm:py-4 rounded-xl inline-block max-w-md">
                <h2 className="text-xl lg:text-3xl xl:text-4xl font-extrabold capitalize tracking-wide">
                  {cancha?.nombre || "Cancha"}
                </h2>
                <p className="text-sm sm:text-base xl:text-xl text-white/90 mt-1 flex items-center gap-2">
                  <span className="text-emerald-300">📍</span>
                  {cancha?.direccion ? `${cancha.direccion} - ` : ""}
                  {cancha?.localidad || "Localidad no disponible"}
                </p>
                <p className="text-xs sm:text-sm xl:text-lg text-emerald-200 mt-1 flex items-center gap-2">
                  <span className="text-emerald-300">💰</span>
                  Precios por turno: $ {Math.trunc(cancha?.tarifa1)} - ${" "}
                  {Math.trunc(cancha?.tarifa2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="mt-8 sm:mt-16 md:mt-2 lg:px-4 sm:px-5 pb-4 sm:pb-5 flex-1 flex flex-col xl:w-[1200x] lg:mx-auto">
        <header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-3 sm:mb-4 text-center"
        >
          <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-emerald-600 animate-gradient-x tracking-tight">
            Elegí tu Turno
          </h1>
        </header>

        <div className="flex-1 flex flex-col items-center">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm sm:text-base text-red-700 text-center max-w-md w-full">
              Error al cargar los turnos. Intente nuevamente.
            </div>
          ) : turnosDeHoy?.length === 0 ? (
            <div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 text-center max-w-md w-full"
            >
              <FaClock className="mx-auto text-3xl sm:text-4xl text-gray-400 mb-2 sm:mb-3" />
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-1">
                No hay turnos disponibles
              </h3>
              <p className="text-sm sm:text-base text-gray-500">
                No hay turnos disponibles para hoy en esta cancha.
              </p>
            </div>
          ) : (
            <div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-full md:max-w-3xl xl:max-w-7xl"
            >
              <div className="rounded-lg sm:rounded-xl p-3 sm:p-4 xl:py-6 mb-1 sm:mb-2">
                <p className="text-center text-sm sm:text-sm md:text-xl xl:text-2xl font-medium text-emerald-700">
                  Turnos disponibles para hoy
                </p>
              </div>

              <div className="flex flex-col md:grid md:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 place-items-center">
                {turnosDeHoy?.map((turno) => (
                  <Turno
                    id={turno.id}
                    hora={turno.hora}
                    estado={turno.estado}
                    precio={turno.precio}
                    cancha={cancha.id}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
