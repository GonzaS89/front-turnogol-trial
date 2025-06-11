import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheckCircle,
  FaPlus,
  FaTimes,
  FaArrowLeft,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
import dayjs from "dayjs";
import 'dayjs/locale/es';
dayjs.locale('es');

export default function AgregarTurno() {
  const navigate = useNavigate();
  const location = useLocation();
  const cancha = location.state?.cancha;

  const [horarios, setHorarios] = useState([""]);
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [horariosExistentes, setHorariosExistentes] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(() => {
    return dayjs().format("YYYY-MM-DD");
  });
  const [loadingExisting, setLoadingExisting] = useState(true);

  // --- Efectos y Lógica de Datos ---

  useEffect(() => {
    const obtenerHorariosExistentes = async () => {
      if (!cancha?.id || !fechaSeleccionada) {
        setHorariosExistentes([]);
        setLoadingExisting(false);
        return;
      }

      try {
        setLoadingExisting(true);
        const { data } = await axios.get(
          `https://turnogol.site/api-pruebas/turnos_canchas/canchas`,
          { params: { id: cancha?.id } }
        );

        const turnosDeFecha = data
          .filter((turno) => dayjs(turno.fecha).isSame(fechaSeleccionada, 'day'))
          .sort((a, b) => {
            // Lógica de ordenación: 00:00 se trata como 24:00 para que vaya al final
            const horaA = a.hora === "00:00" ? "24:00" : a.hora.slice(0, 5); // Usa slice(0,5) aquí si el formato es HH:mm:ss
            const horaB = b.hora === "00:00" ? "24:00" : b.hora.slice(0, 5); // Usa slice(0,5) aquí si el formato es HH:mm:ss
            return horaA.localeCompare(horaB);
          });

        setHorariosExistentes(turnosDeFecha);
      } catch (error) {
        console.error("Error al obtener horarios existentes:", error);
        setHorariosExistentes([]);
      } finally {
        setLoadingExisting(false);
      }
    };
    obtenerHorariosExistentes();
  }, [cancha?.id, fechaSeleccionada]);

  useEffect(() => {
    setHorarios([""]);
  }, [fechaSeleccionada]);


  // --- Manejo de Horarios del Formulario ---

  const handleHorarioChange = (index, value) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[index] = value;
    setHorarios(nuevosHorarios);
  };

  const agregarCampo = () => setHorarios([...horarios, ""]);

  const eliminarCampo = (index) => {
    const nuevosHorarios = horarios.filter((_, i) => i !== index);
    setHorarios(nuevosHorarios);
    if (nuevosHorarios.length === 0) {
      setHorarios([""]);
    }
  };

  const precioDeTurno = (horaIngresada) => {
    const hora = parseInt(horaIngresada.split(":")[0], 10);
    const cambioTarifa = cancha?.cambio_de_tarifa !== undefined ? parseInt(cancha.cambio_de_tarifa, 10) : 20;

    return hora >= cambioTarifa || hora === 0
      ? cancha?.tarifa2 || 0
      : cancha?.tarifa1 || 0;
  };

  // --- Enviar Turnos ---

  const handleSubmit = async () => {
    const horariosValidos = horarios.filter(h => h.trim() !== '');

    if (horariosValidos.length === 0 || !fechaSeleccionada) {
      alert("Por favor, ingresa al menos un horario y selecciona una fecha.");
      return;
    }

    try {
      setIsLoading(true);
      await Promise.all(
        horariosValidos.map((hora) =>
          axios.post(`https://turnogol.site/api-pruebas/turnos_canchas`, {
            hora: hora, // Se envía 00:00 si el usuario lo ingresó así
            cancha_id: cancha.id,
            estado: "disponible",
            precio: precioDeTurno(hora),
            fecha: fechaSeleccionada,
          })
        )
      );
      setShowModalConfirm(false);
      setShowModalSuccess(true);
      setHorarios([""]);

      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      console.error("Error al agregar turnos:", error);
      alert("Error al guardar los turnos. Por favor, intente de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!cancha) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <p className="text-xl text-gray-700 font-medium animate-pulse">
                Cargando información de la cancha o datos no disponibles...
            </p>
        </div>
    );
  }

  return (
    <section className="min-h-screen w-full py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center font-sans text-gray-800 bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      {/* Tarjeta principal del formulario */}
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-4xl w-full border border-gray-200 relative">
        {/* Botón de volver */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-gray-600 hover:text-emerald-700 transition-colors px-3 py-2 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 z-10"
        >
          <FaArrowLeft className="text-xl sm:text-2xl" />
          <span className="font-medium hidden sm:inline">Volver al Panel</span>
        </button>

        {/* Header Principal */}
        <header className="flex flex-col sm:flex-row items-center justify-between mb-8 relative">
          {/* Título principal y nombre de la cancha */}
          <div className="text-center w-full flex-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-600 mt-4 sm:mt-0">
              Agregar Turnos
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-1">
              Cancha: <span className="uppercase font-semibold">{cancha?.nombre || "No especificado"}</span>
            </p>
          </div>
          <div className="w-8 hidden sm:block"></div> {/* Spacer derecho */}
        </header>

        {/* Contenido Principal: Dos Columnas (o apiladas en móvil) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Columna Izquierda (Selección de Fecha y Horarios Existentes) */}
          <div className="flex flex-col gap-6">
            {/* Campo de fecha */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
              <label
                htmlFor="fecha"
                className="block text-base sm:text-lg font-medium text-gray-700 mb-2"
              >
                <FaCalendarAlt className="inline-block mr-2 text-emerald-600 text-xl" />
                Seleccionar Fecha
              </label>
              <input
                id="fecha"
                type="date"
                value={fechaSeleccionada}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
                required
                className="w-full px-4 py-3 sm:py-3.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-base sm:text-lg"
              />
            </div>

            {/* Horarios existentes */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-inner flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaClock className="text-emerald-500 text-xl" />{" "}
                <span>
                  Turnos ya cargados ({dayjs(fechaSeleccionada).format("DD/MM/YYYY")})
                </span>
              </h3>
              {loadingExisting ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-emerald-400 rounded-full"></div>
                </div>
              ) : horariosExistentes.length > 0 ? (
                <div className="flex flex-wrap gap-2 sm:gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {horariosExistentes.map((turno) => (
                    <span
                      key={turno.id}
                      className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-sm sm:text-base font-medium whitespace-nowrap shadow-sm"
                    >
                      {/* Lógica de visualización: si la hora es "00:00", mostrar "24:00" */}
                      {turno.hora.slice(0, 5) === "00:00" ? "24:00" : turno.hora.slice(0, 5)} hs
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm sm:text-base italic py-2">
                  No hay turnos cargados para esta fecha. ¡Es un buen momento para agregar algunos!
                </p>
              )}
            </div>
          </div>

          {/* Columna Derecha (Formulario para Agregar Nuevos Horarios) */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 mt-4 lg:mt-0">
              Añadir Nuevos Horarios
            </h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {horarios.map((hora, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <input
                    type="time"
                    value={hora}
                    onChange={(e) => handleHorarioChange(index, e.target.value)}
                    required
                    className="flex-1 px-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-base sm:text-lg"
                  />
                  {horarios.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarCampo(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-full transition-all group-hover:opacity-100 opacity-80 group-hover:scale-110"
                      title="Eliminar horario"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  )}
                </div>
              ))}

              {/* Botón + Horario */}
              <button
                type="button"
                onClick={agregarCampo}
                className="group flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-medium transition-colors text-base sm:text-lg"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-emerald-100 group-hover:bg-emerald-200 transition text-xl">
                  <FaPlus />
                </div>
                <span>Agregar otro horario</span>
              </button>

              {/* Botón Guardar */}
              <div className="pt-4 sm:pt-6">
                <button
                  type="button"
                  onClick={() => setShowModalConfirm(true)}
                  disabled={horarios.some((h) => !h) || !fechaSeleccionada || isLoading}
                  className={`w-full py-3 sm:py-3.5 px-4 rounded-lg font-semibold shadow-md transition-all duration-200 transform active:scale-95 text-base sm:text-lg
                    ${(horarios.some((h) => !h) || !fechaSeleccionada || isLoading)
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-emerald-300/50 hover:shadow-lg"
                    }`}
                >
                  Guardar Turnos
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal Confirmación */}
      <AnimatePresence>
        {showModalConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-sm border border-gray-200 text-center"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                Confirmar turnos
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
                ¿Estás seguro de agregar{" "}
                <span className="font-semibold">{horarios.length}</span>{" "}
                {horarios.length === 1 ? "turno" : "turnos"} para el{" "}
                <span className="font-semibold">{dayjs(fechaSeleccionada).format("DD/MM/YYYY")}</span>?
              </p>
              <div className="mb-6 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex flex-wrap justify-center gap-2">
                  {horarios.map((hora, i) => (
                    <span key={i} className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-sm sm:text-base font-medium">
                      {/* Lógica de visualización en el modal: si la hora es "00:00", mostrar "24:00" */}
                      {hora === "00:00" ? "24:00" : hora} hs
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => setShowModalConfirm(false)}
                  className="px-5 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-base sm:text-lg flex-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`px-5 py-2 sm:py-2.5 rounded-lg font-semibold shadow-md transition-all duration-200 flex items-center justify-center gap-2 text-base sm:text-lg flex-1
                    ${isLoading
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-400/50 hover:shadow-lg"
                    }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <span>Confirmar</span>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Éxito */}
      <AnimatePresence>
        {showModalSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-sm w-full border border-emerald-200"
            >
              <FaCheckCircle className="mx-auto text-6xl text-emerald-500 mb-4" />
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                ¡Turnos agregados!
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
                Los turnos se han registrado correctamente.
              </p>
              {/* Barra de progreso visual */}
              <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5 }}
                  className="h-full bg-emerald-500"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}