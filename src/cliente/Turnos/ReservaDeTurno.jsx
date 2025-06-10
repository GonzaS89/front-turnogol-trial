import { useLocation, useParams } from "react-router-dom";
import { useCanchas } from "../../customHooks/useCanchas";
import { useObtenerTurnosxCancha } from "../../customHooks/useObtenerTurnosxCancha";
import { FaFutbol } from "react-icons/fa";
import { Turno } from "./components/Turno";
import { useMemo, useState, useEffect } from "react";
import { motion } from 'framer-motion'

export default function ReservaDeTurno() {
  const location = useLocation();
  const { seccioncancha: seccion } = useParams();
  const { idCancha: canchaId } = location.state || {};
  const { datos: canchas, isLoading: loadingCancha } = useCanchas();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  const cancha = useMemo(() => {
    return canchas?.find(
      (item) => item.seccion === seccion || item.id === canchaId
    );
  }, [canchas, seccion, canchaId]);

  const { turnos, isLoading, error } = useObtenerTurnosxCancha(cancha?.id);

  // Agrupar y filtrar turnos por fecha (solo fechas actuales o futuras)
  const turnosAgrupadosPorFecha = useMemo(() => {
    if (!turnos || !Array.isArray(turnos)) return [];

    const agrupados = {};

    turnos.forEach((turno) => {
      if (!turno.fecha) return;

      const fechaStr = turno.fecha.split("T")[0]; // Formato "YYYY-MM-DD"

      if (!agrupados[fechaStr]) {
        agrupados[fechaStr] = [];
      }

      agrupados[fechaStr].push(turno);
    });

    // Obtener fecha actual en horario local (-03:00)
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const argentinaTime = new Date(utcTime + 3 * 60 * 60 * 1000); // UTC-3
    const todayStr = argentinaTime.toISOString().split("T")[0];

    // Filtramos y ordenamos las fechas
    const fechasFiltradas = Object.entries(agrupados)
      .map(([fecha, turnos]) => ({ fecha, turnos }))
      .filter(({ fecha }) => fecha >= todayStr)
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    return fechasFiltradas;
  }, [turnos]);

  // Seleccionar automáticamente la primera fecha si no hay ninguna seleccionada
  useEffect(() => {
    if (turnosAgrupadosPorFecha.length > 0 && !fechaSeleccionada) {
      setFechaSeleccionada(turnosAgrupadosPorFecha[0].fecha);
    }
  }, [turnosAgrupadosPorFecha, fechaSeleccionada]);

  // Función para convertir hora en formato "HH:mm" a minutos totales
  const convertirHoraAMinutos = (horaStr) => {
    const [hora, minutos] = horaStr.split(":").map(Number);
    return hora * 60 + minutos;
  };

  // Filtrar y ordenar turnos por hora según la fecha seleccionada
  const turnosFiltrados = fechaSeleccionada
    ? [...(turnos?.filter((turno) => turno.fecha?.startsWith(fechaSeleccionada)) || [])]
      .sort((a, b) => convertirHoraAMinutos(a.hora) - convertirHoraAMinutos(b.hora))
    : [];

  const getDiaSemana = (fechaStr) => {
    const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const fecha = new Date(fechaStr);
    const dia = fecha.getDay(); // 0 = domingo, ..., 6 = sábado
    return dias[dia];
  };

  const formatearFecha = (fecha) => {
    const fechaValida = new Date(fecha);
    if (isNaN(fechaValida.getTime())) {
      return "Fecha inválida";
    }
    const dia = fechaValida.getUTCDate().toString().padStart(2, "0");
    const mes = (fechaValida.getUTCMonth() + 1).toString().padStart(2, "0"); // Mes empieza en 0
    return `${dia}/${mes}`;
  };

  return (
    <div className="w-full min-h-screen flex flex-col gap-4 sm:gap-6">
      {/* Header con logo y banner */}
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
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-emerald-300 border-t-transparent rounded-full animate-spin"></div>
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

              {/* Información de la cancha */}
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
                  Precios por turno: $ {Math.trunc(cancha?.tarifa1)} - $
                  {Math.trunc(cancha?.tarifa2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="mt-8 sm:mt-16 md:mt-2 lg:px-4 sm:px-5 pb-4 sm:pb-5 flex-1 flex flex-col xl:w-[1200px] lg:mx-auto">
        <header className="mb-3 sm:mb-4 text-center">
          <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-emerald-600 animate-gradient-x tracking-tight">
            Elegí tu Turno
          </h1>
        </header>

        <div className="flex-1 flex flex-col items-center">
          {/* Carrusel de fechas */}
          <div className="w-full md:max-w-3xl xl:max-w-7xl mt-6 relative px-6">
            {/* Botón izquierdo */}
            <button
              onClick={() =>
                document.getElementById("carrusel-fechas").scrollBy({ left: -120, behavior: "smooth" })
              }
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
                         w-10 h-10 rounded-full flex items-center justify-center
                         text-emerald-600 bg-white/60 backdrop-blur-sm shadow-lg
                         hover:bg-white/80 active:bg-white transition-all duration-200"
              aria-label="Anterior"
            >
              ❮
            </button>

            {/* Carrusel de fechas */}
            <div
              id="carrusel-fechas"
              className="flex gap-3 overflow-x-auto hide-scrollbar py-2 px-6 md:px-12 scrollbar-thin scrollbar-thumb-emerald-400 scrollbar-track-gray-100"
            >
              {turnosAgrupadosPorFecha.map(({ fecha }, index) => {
                const isToday =
                  fecha ===
                  new Date(
                    new Date().getTime() +
                    new Date().getTimezoneOffset() * 60000 +
                    3 * 60 * 60 * 1000
                  )
                    .toISOString()
                    .split("T")[0];

                // Extraemos el día de la semana y mes
                const date = new Date(fecha);
                const diaSemana = date.toLocaleDateString("es-ES", { weekday: "short" }); // Ej: "lun"
                const mesAbreviado = date.toLocaleDateString("es-ES", { month: "short" }); // Ej: "abr"

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setFechaSeleccionada(fecha)}
                    className={`min-w-[100px] px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 text-center
          ${fechaSeleccionada === fecha
                        ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-md scale-105"
                        : "bg-white hover:bg-emerald-50 border border-emerald-100"
                      }
          ${isToday && fechaSeleccionada !== fecha ? "ring-2 ring-emerald-500" : ""}
        `}
                  >
                    {/* Día de la semana */}
                    <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                      {isToday ? "Hoy" : diaSemana}
                    </p>

                    {/* Fecha (DD/MM) - sin cambios al formato original */}
                    <p className={`font-semibold text-sm md:text-base ${fechaSeleccionada === fecha ? "text-white" : "text-emerald-800"}`}>
                      {formatearFecha(fecha).split("/")[0]}
                    </p>

                    {/* Mes abreviado */}
                    <p className={`text-xs mt-1 ${fechaSeleccionada === fecha ? "text-white/90" : "text-emerald-500"}`}>
                      {mesAbreviado}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Botón derecho */}
            <button
              onClick={() =>
                document.getElementById("carrusel-fechas").scrollBy({ left: 120, behavior: "smooth" })
              }
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
                         w-10 h-10 rounded-full flex items-center justify-center
                         text-emerald-600 bg-white/60 backdrop-blur-sm shadow-lg
                         hover:bg-white/80 active:bg-white transition-all duration-200"
              aria-label="Siguiente"
            >
              ❯
            </button>
          </div>

          {/* Lista de turnos filtrados por fecha */}
          <div className="mt-8 w-full px-4 sm:px-6">
            {turnosFiltrados && turnosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 gap-1">
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
    </div>
  );
}