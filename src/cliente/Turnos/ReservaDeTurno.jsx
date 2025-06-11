import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCanchas } from "../../customHooks/useCanchas";
import { useObtenerTurnosxCancha } from "../../customHooks/useObtenerTurnosxCancha";
import { FaFutbol, FaArrowLeft } from "react-icons/fa";
import { Turno } from "./components/Turno";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ReservaDeTurno() {
  const location = useLocation();
  const { seccioncancha: seccion } = useParams();
  const { idCancha: canchaId } = location.state || {};
  const { datos: canchas, isLoading: loadingCancha } = useCanchas();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const navigate = useNavigate();

  const cancha = useMemo(() => {
    return canchas?.find(
      (item) => item.seccion === seccion || item.id === canchaId
    );
  }, [canchas, seccion, canchaId]);

  const { turnos, isLoading, error } = useObtenerTurnosxCancha(cancha?.id);

  // --- Funciones de Utilidad de Fecha (Nativas) ---

  // Obtiene la fecha actual en la zona horaria UTC-3 (Argentina) al inicio del día
  const getTodayInArgentina = () => {
    const now = new Date();
    // Calcular el offset para UTC-3 (3 horas * 60 minutos * 60 segundos * 1000 milisegundos)
    const argentinaOffsetMs = -3 * 60 * 60 * 1000;
    // La diferencia entre UTC y la hora local del navegador
    const localOffsetMs = now.getTimezoneOffset() * 60 * 1000;
    // Ajustar la hora actual para que sea UTC y luego restarle el offset de Argentina
    const argentinaTime = new Date(
      now.getTime() + localOffsetMs + argentinaOffsetMs
    );

    // Obtener la fecha en formato YYYY-MM-DD (al inicio del día)
    return new Date(
      argentinaTime.getFullYear(),
      argentinaTime.getMonth(),
      argentinaTime.getDate()
    );
  };

  // Compara solo la parte de la fecha (día, mes, año)
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Función para obtener el día de la semana y la fecha formateada por separado
  const getFormattedDateParts = (fechaStr) => {
    const dateObj = new Date(fechaStr + "T00:00:00"); // Asegura que se parsea como UTC para evitar problemas de TZ

    const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const mesesAbreviados = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
    ];

    const dayOfWeek = dias[dateObj.getDay()];
    const formattedDay = String(dateObj.getDate()).padStart(2, "0");
    const formattedMonth = mesesAbreviados[dateObj.getMonth()];

    return { dayOfWeek, formattedDay, formattedMonth };
  };

  // --- Lógica del Componente ---

  // Agrupar y filtrar turnos por fecha (solo fechas actuales o futuras)
  const turnosAgrupadosPorFecha = useMemo(() => {
    if (!turnos || !Array.isArray(turnos)) return [];

    const agrupados = {};
    const todayInArgentina = getTodayInArgentina();

    turnos.forEach((turno) => {
      if (!turno.fecha) return;

      const fechaTurno = new Date(turno.fecha.split("T")[0] + "T00:00:00"); // Asegura que la fecha sea al inicio del día en UTC

      // CAMBIO CLAVE AQUÍ: Solo incluir turnos cuya fecha sea hoy o en el futuro
      if (fechaTurno.getTime() >= todayInArgentina.getTime()) { // Eliminamos la resta de 24 horas
        const fechaStr = turno.fecha.split("T")[0]; // Mantener formato YYYY-MM-DD para la clave
        if (!agrupados[fechaStr]) {
          agrupados[fechaStr] = [];
        }
        agrupados[fechaStr].push(turno);
      }
    });

    // Filtramos y ordenamos las fechas
    const fechasFiltradas = Object.entries(agrupados)
      .map(([fecha, turnos]) => ({ fecha, turnos }))
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); // Ordenar por fecha

    return fechasFiltradas;
  }, [turnos]);

  // Seleccionar automáticamente la primera fecha si no hay ninguna seleccionada
  useEffect(() => {
    if (turnosAgrupadosPorFecha.length > 0 && !fechaSeleccionada) {
      setFechaSeleccionada(turnosAgrupadosPorFecha[0].fecha);
    }
  }, [turnosAgrupadosPorFecha, fechaSeleccionada]);

  // Función para convertir hora en formato "HH:mm" a minutos totales
  // Función para convertir hora en formato "HH:mm" a minutos totales
const convertirHoraAMinutos = (horaStr) => {
  const [hora, minutos] = horaStr.split(":").map(Number);
  // Si 00:00 debe ir al final, lo tratamos como 24*60 minutos
  // Si no, simplemente sería hora * 60 + minutos
  const horaNormalizada = (hora === 0 && minutos === 0) ? 24 * 60 : hora * 60 + minutos;
  return horaNormalizada;
};

// Filtrar y ordenar turnos por hora según la fecha seleccionada
const turnosFiltrados = fechaSeleccionada
  ? [
      ...(turnos?.filter((turno) =>
        turno.fecha?.startsWith(fechaSeleccionada)
      ) || []),
    ].sort(
      // La función de comparación ya ordena de menor a mayor
      (a, b) => convertirHoraAMinutos(a.hora) - convertirHoraAMinutos(b.hora)
    )
  : [];

  return (
    <div className="w-full min-h-screen flex flex-col font-sans">
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" fill="none">
          <circle cx="25" cy="25" r="10" fill="url(#gradientCircle)" opacity="0.6"/>
          <circle cx="75" cy="75" r="15" fill="url(#gradientCircle)" opacity="0.6"/>
          <path d="M0 50 L20 70 L50 40 L80 60 L100 40 V0 H0 Z" fill="url(#gradientPath)" opacity="0.3"/>
          <defs>
            <radialGradient id="gradientCircle" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#34D399" /> {/* green-400 */}
              <stop offset="100%" stopColor="#059669" /> {/* emerald-600 */}
            </radialGradient>
            <linearGradient id="gradientPath" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" /> {/* emerald-500 */}
              <stop offset="100%" stopColor="#065F46" /> {/* green-900 */}
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Header con imagen de portada y superposición de información */}
      <div className="relative h-44 sm:h-56 md:h-64 lg:h-72 xl:h-80 w-full overflow-hidden">
        {/* Imagen de portada */}
        {cancha?.portada ? (
          <img
            src={cancha.portada}
            alt={`Portada de ${cancha.nombre}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-green-700 to-emerald-900 animate-pulse"></div>
        )}

        {/* Overlay sutil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent backdrop-brightness-50 backdrop-blur-"></div>

        {/* Loader mientras carga */}
        {loadingCancha && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
            <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Información de la cancha superpuesta */}
        {!loadingCancha && (
          <div className="absolute inset-0 flex items-center justify-start px-4 sm:px-6 lg:px-8 pb-4 sm:pb-0 z-10">
            {" "}
            {/* Botón de volver al panel - similar a VerTurnos */}
            {/* Contenido de la información de la cancha (logo + detalles) */}
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 w-full xl:w-[1200px] xl:mx-auto">
              {/* Logo circular */}
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 xl:w-32 xl:h-32 rounded-full border-3 border-white shadow-xl overflow-hidden flex-shrink-0
              transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
              >
                {cancha?.logo ? (
                  <img
                    src={cancha.logo}
                    alt={`Logo de ${cancha.nombre}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                    <FaFutbol className="text-white text-3xl sm:text-4xl lg:text-5xl drop-shadow-md" />
                  </div>
                )}
              </div>
              {/* Información de la cancha (nombre, dirección, precios) */}
              <div
                className="flex flex-col justify-center
              text-white p-4 sm:p-5 md:p-6 rounded-2xl
              max-w-sm sm:max-w-md lg:max-w-lg shadow-2xl
              transform transition-all duration-300 hover:scale-[1.01]"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold capitalize tracking-wide leading-tight text-shadow-lg">
                  {cancha?.nombre || "Cancha"}
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-white/90 mt-1 flex items-center gap-2">
                  <span className="text-emerald-300 text-lg">📍</span>
                  {cancha?.direccion ? `${cancha.direccion} - ` : ""}
                  <span className="font-semibold">
                    {cancha?.localidad || "Localidad no disponible"}
                  </span>
                </p>
                <p className="text-xs sm:text-sm lg:text-base text-emerald-200 mt-1 flex items-center gap-2">
                  <span className="text-emerald-300 text-base">💰</span>
                  <span className="font-semibold">
                    Precios por turno: ${Math.trunc(cancha?.tarifa1 || 0)} - $
                    {Math.trunc(cancha?.tarifa2 || 0)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contenido principal de la reserva (selector de fechas y turnos) */}
      <div className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-6 shadow-inner mt-2 xl:mt-6 rounded-t-3xl relative z-20">
        <header className="mb-6 sm:mb-8 text-center w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-emerald-600">
            Elegí tu Turno
          </h1>
          {error && (
            <p className="text-red-500 mt-4 text-center">
              Hubo un error al cargar los turnos.
            </p>
          )}
        </header>

        {/* Carrusel de fechas */}
        <div className="w-full max-w-4xl lg:max-w-auto mx-auto mb-8 relative px-8">
          {/* Botones de navegación del carrusel */}
          <button
            onClick={() =>
              document
                .getElementById("carrusel-fechas")
                .scrollBy({ left: -150, behavior: "smooth" })
            }
            className="absolute -left-2 sm:-left-4 top-1/2 transform -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-emerald-700 bg-white/80 backdrop-blur-md shadow-lg hover:bg-white active:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Anterior fecha"
          >
            ❮
          </button>

          <div
            id="carrusel-fechas"
            className="flex gap-4 overflow-x-auto hide-scrollbar py-2 px-1 sm:px-4 scroll-smooth"
          >
            {isLoading ? (
              <div className="flex justify-center items-center w-full min-h-[120px]">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : turnosAgrupadosPorFecha.length === 0 ? (
              <p className="text-gray-500 text-center w-full py-4">
                No hay fechas disponibles para turnos.
              </p>
            ) : (
              turnosAgrupadosPorFecha.map(({ fecha }, index) => {
                const todayInArgentina = getTodayInArgentina();
                const currentCardDate = new Date(fecha + "T00:00:00"); // Fecha de la tarjeta
                const isToday = isSameDay(currentCardDate, todayInArgentina);

                const { dayOfWeek, formattedDay, formattedMonth } =
                  getFormattedDateParts(fecha);

                return (
                  <div
                    key={fecha}
                    onClick={() => {
                      setFechaSeleccionada(fecha);
                      // Opcional: Desplazar la fecha seleccionada al centro si está fuera de vista
                      const targetElement = document.getElementById(
                        `date-card-${fecha}`
                      );
                      const carouselContainer =
                        document.getElementById("carrusel-fechas");
                      if (carouselContainer && targetElement) {
                        const containerRect =
                          carouselContainer.getBoundingClientRect();
                        const elementRect =
                          targetElement.getBoundingClientRect();
                        const scrollPosition =
                          elementRect.left -
                          containerRect.left +
                          carouselContainer.scrollLeft -
                          containerRect.width / 2 +
                          elementRect.width / 2;
                        carouselContainer.scrollTo({
                          left: scrollPosition,
                          behavior: "smooth",
                        });
                      }
                    }}
                    id={`date-card-${fecha}`} // Añadir un ID para facilitar el scrollIntoView
                    className={`
                      min-w-[100px] sm:min-w-[120px] lg:min-w-[140px] 
                      px-4 py-3 sm:px-5 sm:py-4 rounded-xl cursor-pointer 
                      transition-all duration-300 transform active:scale-95
                      text-center flex flex-col justify-center items-center
                      ${
                        fechaSeleccionada === fecha
                          ? "bg-gradient-to-br from-emerald-600 to-green-700 text-white shadow-lg shadow-emerald-400/50 scale-105 ring-2 ring-emerald-300"
                          : "bg-white border border-gray-200 text-gray-800 hover:bg-emerald-50 hover:shadow-md"
                      }
                      ${
                        isToday && fechaSeleccionada !== fecha
                          ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-white"
                          : ""
                      }
                    `}
                  >
                    <p
                      className={`text-sm font-semibold uppercase tracking-wide ${
                        fechaSeleccionada === fecha
                          ? "text-white"
                          : "text-emerald-600"
                      }`}
                    >
                      {isToday ? "Hoy" : dayOfWeek}
                    </p>
                    <p
                      className={`font-extrabold text-3xl sm:text-4xl ${
                        fechaSeleccionada === fecha
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {formattedDay}
                    </p>
                    <p
                      className={`text-sm mt-1 ${
                        fechaSeleccionada === fecha
                          ? "text-white/90"
                          : "text-emerald-500"
                      }`}
                    >
                      {formattedMonth}.
                    </p>
                  </div>
                );
              })
            )}
          </div>

          <button
            onClick={() =>
              document
                .getElementById("carrusel-fechas")
                .scrollBy({ left: 150, behavior: "smooth" })
            }
            className="absolute -right-2 sm:-right-4 top-1/2 transform -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-emerald-700 bg-white/80 backdrop-blur-md shadow-lg hover:bg-white active:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Siguiente fecha"
          >
            ❯
          </button>
        </div>

        {/* Lista de turnos filtrados por fecha */}
        <div className="mt-8 w-full lg:max-w-7xl sm:px-6">
  {turnosFiltrados && turnosFiltrados.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-1 lg:gap-2">
      {/* Esto se mapea sobre turnosFiltrados, que ya está ordenado */}
      {turnosFiltrados.map((turno, i) => (
        <Turno
          key={i}
          id={turno.id}
          estado={turno.estado}
          cancha={turno.cancha_id}
          hora={turno.hora}
          precio={turno.precio}
          fecha={turno.fecha}
        />
      ))}
    </div>
  ) : (
    <p className="text-gray-500 text-center py-8">
      No hay turnos disponibles para esta fecha.
    </p>
  )}
</div>
      </div>
    </div>
  );
}
