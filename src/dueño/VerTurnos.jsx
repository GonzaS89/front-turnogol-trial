import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaTrashAlt,
  FaCheck,
  FaTimes,
  FaArrowLeft,
  FaCalendarAlt,
  FaUser,
  FaIdCard,
  FaClock,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaBell,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { IoChatbubble } from "react-icons/io5";
import { AiFillLike } from "react-icons/ai";

export default function VerTurnos() {
  const navigate = useNavigate();
  const location = useLocation();
  const cancha = location.state?.cancha;
  const [turnos, setTurnos] = useState([]);
  const [turnosAgrupados, setTurnosAgrupados] = useState({});
  const [fechaVisible, setFechaVisible] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalPagado, setModalPagado] = useState(null);
  const [showModal, setShowModal] = useState(false); // Este es el modal de confirmación general
  const [idTurnoSelec, setIdTurnoSelec] = useState(null);
  const [mensajeModal, setMensajeModal] = useState(null); // Este es el modal de mensajes de éxito/error
  const isReservado = (estado) => ["reservado", "pendiente"].includes(estado);

  // Cargar turnos desde API
  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `https://turnogol.site/api-pruebas/turnos_canchas/canchas?id=${cancha.id}`
        );
        // Ordenar turnos por fecha de forma descendente (más reciente primero)
        const turnosOrdenados = res.data.sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );
        setTurnos(turnosOrdenados);
      } catch (err) {
        console.error("Error al obtener turnos:", err);
        setError("Error al cargar los turnos. Intente nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };
    if (cancha?.id) fetchTurnos();
  }, [cancha]);

  // Agrupar por fecha y ordenar horarios
  useEffect(() => {
    const agrupados = turnos.reduce((acc, turno) => {
      const fecha = turno.fecha.split("T")[0]; // Aseguramos el formato YYYY-MM-DD
      if (!acc[fecha]) acc[fecha] = [];
      acc[fecha].push({ ...turno, hora: turno.hora.slice(0, 5) });
      return acc;
    }, {});

    // Ordenar los turnos dentro de cada fecha por hora
    Object.keys(agrupados).forEach((fecha) => {
      agrupados[fecha] = agrupados[fecha].sort((a, b) => {
        // Manejar '00:00' si se considera el final del día anterior
        const horaA = a.hora === "00:00" ? "24:00" : a.hora;
        const horaB = b.hora === "00:00" ? "24:00" : b.hora;
        return horaA.localeCompare(horaB);
      });
    });
    setTurnosAgrupados(agrupados);
  }, [turnos]);

  // Expandir solo las fechas con turnos pendientes por defecto
  useEffect(() => {
    const initialFechaVisible = {};
    if (Object.keys(turnosAgrupados).length > 0) {
      Object.keys(turnosAgrupados).forEach(fecha => {
        if (getCantidadPendientes(fecha) > 0) {
          initialFechaVisible[fecha] = true;
        }
      });
    }
    setFechaVisible(initialFechaVisible); // Establece el estado una única vez
  }, [turnosAgrupados]); // Se ejecuta cada vez que turnosAgrupados cambia

  const toggleFechaVisibility = (fecha) => {
    setFechaVisible((prev) => ({
      ...prev,
      [fecha]: !prev[fecha],
    }));
  };

  const ponerDisponible = async (turnoId) => {
    try {
      await axios.put(
        `https://turnogol.site/api-pruebas/turnos/liberar/${turnoId}`
      );
      setTurnos((prevTurnos) =>
        prevTurnos.map((t) =>
          t.id === turnoId
            ? { ...t, estado: "disponible", nombre: null, dni: null }
            : t
        )
      );
      setMensajeModal({
        tipo: "success",
        mensaje: "✅ Turno liberado correctamente.",
      });
    } catch (error) {
      console.error("Error al liberar el turno", error);
      setMensajeModal({
        tipo: "error",
        mensaje: "❌ Error al liberar el turno.",
      });
    }
  };

  const confirmarPendiente = async (turnoId) => {
    try {
      await axios.put(
        `https://turnogol.site/api-pruebas/turnos/confirmar/${turnoId}`
      );
      setTurnos((prevTurnos) =>
        prevTurnos.map((t) =>
          t.id === turnoId ? { ...t, estado: "reservado" } : t
        )
      );
      setMensajeModal({
        tipo: "success",
        mensaje: "✅ Solicitud confirmada correctamente.",
      });
    } catch (error) {
      console.error("Error al confirmar el turno", error);
      setMensajeModal({
        tipo: "error",
        mensaje: "❌ Error al confirmar la solicitud.",
      });
    }
  };

  // Función para eliminar turno (llamada desde el modal)
  const eliminarTurno = async (turnoId) => {
    try {
      await axios.delete(
        `https://turnogol.site/api-pruebas/turnos_canchas/${turnoId}`
      );
      setTurnos((prevTurnos) => prevTurnos.filter((t) => t.id !== turnoId));
      setMensajeModal({
        tipo: "success",
        mensaje: "🗑️ Turno eliminado correctamente.",
      });
    } catch (error) {
      console.error("Error al eliminar el turno", error);
      setMensajeModal({
        tipo: "error",
        mensaje: "❌ Error al eliminar el turno.",
      });
    }
  };

  // Función para obtener el día de la semana y la fecha formateada por separado
  const getFormattedDateParts = (fechaStr) => {
    const [year, month, day] = fechaStr.split("-");
    const dateObj = new Date(year, month - 1, day); // Mes es 0-based

    const optionsDay = { weekday: "long" };
    const dayOfWeek = dateObj.toLocaleDateString("es-ES", optionsDay);

    const optionsDate = { day: "numeric", month: "numeric" }; // Formato "DD/MM"
    const formattedDate = dateObj.toLocaleDateString("es-ES", optionsDate);

    return { dayOfWeek, formattedDate };
  };

  const confirmarPago = async (turnoId, tipoPago, condicion) => {
    console.log("Confirmando pago:", turnoId, tipoPago, condicion);

    if (!turnoId || !tipoPago) {
      setMensajeModal({
        tipo: "error",
        mensaje: "Datos incompletos. No se puede registrar el pago.",
      });
      return;
    }

    try {
      const response = await axios.put(
        `https://turnogol.site/api-pruebas/turnos/pagar/${turnoId}`,
        {
          tipoPago,
          condicion,
        }
      );

      setTurnos((prev) =>
        prev.map((t) =>
          t.id === turnoId
            ? { ...t, tipo_pago: tipoPago, condicion: condicion }
            : t
        )
      );

      setMensajeModal({
        tipo: "success",
        mensaje: "✅ Pago registrado correctamente.",
      });
    } catch (error) {
      console.error(
        "Error al registrar el pago:",
        error.response?.data || error.message
      );
      setMensajeModal({
        tipo: "error",
        mensaje:
          error.response?.data?.message ||
          "❌ Ocurrió un error al registrar el pago.",
      });
    } finally {
      setModalPagado(null);
    }
  };

  // Función para abrir el modal de confirmación (usado para liberar, rechazar, eliminar)
  const abrirModalConfirmacion = (idTurno, accion) => {
    setIdTurnoSelec(idTurno);
    // Puedes usar la 'accion' si quieres mensajes específicos en el modal
    setShowModal(true);
  };

  const getCantidadPendientes = (fechaStr) => {
    const turnosDeFecha = turnosAgrupados[fechaStr] || [];
    return turnosDeFecha.filter((turno) => turno.estado === "pendiente").length;
  };

  // Mientras carga o si no hay datos de cancha
  if (!cancha) {
    return (
      <div className="z-10 min-h-screen flex items-center justify-center p-4">
        <div className="text-center p-8 shadow-xl rounded-lg border border-gray-200">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Cargando datos de la cancha...</h2>
          <p className="mt-2 text-gray-600">Por favor espera un momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="z-10 min-h-screen w-full flex flex-col items-center text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
      {/* Contenedor principal de la página */}
      <div className="w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
        {/* Header de la página */}
        <header className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-700 transition-colors px-3 py-2 rounded-lg text-lg mb-4 sm:mb-0 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <FaArrowLeft className="text-xl" />
            <span className="font-medium">Volver al Panel</span>
          </button>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent text-center flex-grow">
            Gestión de Turnos
          </h1>
          <div className="w-auto sm:w-24"></div> {/* Spacer for alignment */}
        </header>

        {/* Información de la cancha (Administrá tus turnos) */}
        <div className="bg-emerald-50 rounded-xl shadow-md p-5 mb-8 text-center border border-emerald-100">
          <p className="text-base sm:text-lg lg:text-xl font-semibold text-gray-700">
            Administrá los turnos de tu cancha aquí.
          </p>
        </div>

        {/* Contenido principal: Loader, Error, No turnos, Lista de turnos */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-emerald-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-center shadow-md">
            <FaExclamationTriangle className="mx-auto text-4xl mb-3 text-red-500" />
            <p className="text-lg font-medium">{error}</p>
          </div>
        ) : Object.keys(turnosAgrupados).length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
            <FaCalendarAlt className="mx-auto text-5xl text-gray-400 mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">
              No hay turnos registrados
            </h3>
            <p className="text-base text-gray-500">
              Aún no hay turnos cargados para esta cancha.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(turnosAgrupados).map(([fecha, turnosPorFecha]) => {
              const { dayOfWeek, formattedDate } = getFormattedDateParts(fecha);
              return (
                <div
                  key={fecha}
                  className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden transform hover:scale-[1.005] transition-all duration-300 ease-out"
                >
                  {/* Encabezado de fecha (plegable) */}
                  <div
                    className="flex justify-between items-center p-4 sm:p-5 lg:p-6 bg-gray-50 border-b border-emerald-100 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleFechaVisibility(fecha)}
                  >
                    <h3 className="font-bold text-lg sm:text-xl lg:text-2xl text-emerald-800 flex items-center gap-3 relative">
                      <FaCalendarAlt className="text-emerald-600 text-2xl sm:text-3xl" />
                      <div className="flex flex-col items-start leading-tight">
                        <span className="text-sm sm:text-base lg:text-lg font-semibold uppercase">
                          {dayOfWeek}
                        </span>
                        <span className="text-base sm:text-xl lg:text-2xl font-extrabold">
                          {formattedDate}
                        </span>
                      </div>

                      {getCantidadPendientes(fecha) > 0 && (
                        <div className="relative flex items-center justify-center ml-2"> {/* Agregado ml-2 para espacio */}
                          <FaBell className="text-yellow-500 text-xl sm:text-2xl animate-bounce" />

                          <span className="absolute -top-1 right-[-10px] sm:-top-2 sm:right-[-12px] z-10 inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white shadow-md animate-pulse">
                            {getCantidadPendientes(fecha)}
                          </span>
                        </div>
                      )}
                    </h3>
                    <button
                      className="text-2xl sm:text-3xl text-emerald-700 hover:text-emerald-900 px-1 py-1 rounded-lg hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      aria-label={
                        fechaVisible[fecha]
                          ? "Ocultar turnos"
                          : "Mostrar turnos"
                      }
                    >
                      {fechaVisible[fecha] ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}{" "}
                      {/* Ícono condicional */}
                    </button>
                  </div>

                  {/* Lista de turnos (visible/oculta) */}
                  {fechaVisible[fecha] && (
                    <ul className="divide-y divide-gray-100 p-4 sm:p-5">
                      {turnosPorFecha.map((turno) => (
                        <li
                          key={turno.id}
                          className={`py-4 px-3 sm:px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg mb-2 last:mb-0 transform hover:scale-[1.01]
                            ${
                              turno.condicion === "Pagado"
                                ? "bg-purple-50 border-l-4 border-purple-500"
                                : turno.estado === "disponible"
                                ? "bg-white border-l-4 border-gray-200 hover:bg-gray-50"
                                : turno.estado === "pendiente"
                                ? "bg-amber-50 border-l-4 border-amber-400 hover:bg-amber-100"
                                : "bg-emerald-50 border-l-4 border-emerald-400 hover:bg-emerald-100"
                            }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Información del turno */}
                            <div className="flex items-start sm:items-center gap-4">
                              <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-lg">
                                <FaClock
                                  className={`${
                                    turno.condicion
                                      ? "text-purple-600"
                                      : turno.estado === "reservado"
                                      ? "text-emerald-600"
                                      : turno.estado === "pendiente"
                                      ? "text-amber-500"
                                      : "text-gray-400"
                                  }
                                    text-3xl sm:text-4xl`}
                                />
                              </div>
                              <div>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                                  {turno.hora} hs
                                </p>
                                {isReservado(turno.estado) ? (
                                  <div className="mt-2 space-y-2">
                                    <p className="flex items-center gap-2 text-base text-gray-700">
                                      <FaUser className="text-gray-500" />{" "}
                                      {turno.nombre || "Nombre no disponible"}
                                    </p>
                                    <p className="flex items-center gap-2 text-base text-gray-700">
                                      <FaIdCard className="text-gray-500" />
                                      {turno.dni || "No disponible"}
                                    </p>
                                    <span className="inline-flex text-base items-center gap-1.5 font-semibold text-gray-800">
                                      <FaMoneyBillWave className="text-green-600" />
                                      $ {Math.trunc(turno.precio || 0)}
                                    </span>
                                    <div className="mt-2">
                                      {turno.tipo_pago ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full shadow-sm">
                                          <FaMoneyBillWave className="text-yellow-300" />
                                          Pagado con {turno.tipo_pago}
                                        </span>
                                      ) : turno.estado === "pendiente" ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full animate-pulse shadow-sm">
                                          <FaClock className="text-white" />
                                          Pendiente de confirmación
                                        </span>
                                      ) : (
                                        <div className="flex flex-wrap items-center gap-2">
                                          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full shadow-sm">
                                            <AiFillLike className="text-white" />
                                            Reservado
                                          </span>
                                          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm">
                                            <FaMoneyBillWave className="text-white" />
                                            Señado
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-emerald-600 font-semibold text-base sm:text-lg mt-2">
                                    Disponible
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Acciones del turno */}
                            <div className="flex flex-wrap sm:flex-row gap-2 mt-4 sm:mt-0 justify-end">
                              {turno.estado === "reservado" &&
                                !turno.condicion && (
                                  <>
                                    <button
                                      onClick={() =>
                                        abrirModalConfirmacion(
                                          turno.id,
                                          "liberar"
                                        )
                                      }
                                      className="flex items-center gap-2 px-4 py-2 text-sm sm:text-base bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all active:scale-95 shadow-md transform hover:-translate-y-0.5"
                                    >
                                      <FaTimes />
                                      <span>Liberar</span>
                                    </button>
                                    <button
                                      onClick={() => setModalPagado(turno.id)}
                                      className="flex items-center gap-2 px-4 py-2 text-sm sm:text-base bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all active:scale-95 shadow-md transform hover:-translate-y-0.5"
                                    >
                                      <FaMoneyBillWave />
                                      <span>Marcar Pagado</span>
                                    </button>
                                  </>
                                )}

                              {turno.estado === "pendiente" && (
                                <>
                                  <button
                                    onClick={() => confirmarPendiente(turno.id)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm sm:text-base bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-all active:scale-95 shadow-md transform hover:-translate-y-0.5"
                                  >
                                    <FaCheck />
                                    <span>Confirmar</span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      abrirModalConfirmacion(
                                        turno.id,
                                        "rechazar"
                                      )
                                    }
                                    className="flex items-center gap-2 px-4 py-2 text-sm sm:text-base bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all active:scale-95 shadow-md transform hover:-translate-y-0.5"
                                  >
                                    <FaTimes />
                                    <span>Rechazar</span>
                                  </button>
                                </>
                              )}

                              {turno.estado === "disponible" && (
                                <button
                                  onClick={() =>
                                    abrirModalConfirmacion(turno.id, "eliminar")
                                  }
                                  className="flex items-center gap-2 px-4 py-2 text-sm sm:text-base bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all active:scale-95 shadow-md transform hover:-translate-y-0.5"
                                  title="Eliminar turno"
                                >
                                  <FaTrashAlt />
                                  <span className="hidden sm:inline">
                                    Eliminar
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODALES */}

      {/* Modal de confirmación general (para liberar, rechazar, eliminar) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-auto text-center border border-gray-200">
            <div className="p-3 rounded-full bg-yellow-100 mx-auto w-fit mb-4">
              <FaExclamationTriangle className="text-yellow-500 text-4xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              ¿Confirmas la acción?
            </h3>
            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center gap-3 w-full">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors duration-200 flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Determina la acción a realizar basado en el estado actual del turno
                  const turnoAfectado = turnos.find(
                    (t) => t.id === idTurnoSelec
                  );
                  if (turnoAfectado) {
                    if (turnoAfectado.estado === "disponible") {
                      eliminarTurno(idTurnoSelec);
                    } else if (turnoAfectado.estado === "reservado") {
                      // Si está reservado, la acción por defecto es liberar
                      ponerDisponible(idTurnoSelec);
                    } else if (turnoAfectado.estado === "pendiente") {
                      // Si está pendiente, la acción por defecto es rechazar (liberar)
                      ponerDisponible(idTurnoSelec); // Puedes diferenciar esto en un "rechazar" si lo necesitas
                    }
                  }
                  setShowModal(false);
                }}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200 flex-1"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para elegir forma de pago */}
      {modalPagado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-xs w-full text-center border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-5">
              ¿Cómo se realizó el pago?
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => confirmarPago(modalPagado, "efectivo", "Pagado")}
                className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg shadow-md transition-colors"
              >
                <FaMoneyBillWave className="inline mr-2" /> Efectivo
              </button>
              <button
                onClick={() =>
                  confirmarPago(modalPagado, "transferencia", "Pagado")
                }
                className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md transition-colors"
              >
                <FaIdCard className="inline mr-2" /> Transferencia
              </button>
              <button
                onClick={() => setModalPagado(null)}
                className="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Mensajes (Éxito/Error) */}
      {mensajeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl max-w-xs w-full p-6 text-center border border-gray-200">
            <div className="mb-4">
              {mensajeModal.tipo === "success" ? (
                <FaCheck className="text-green-500 text-5xl mx-auto" />
              ) : (
                <FaTimes className="text-red-500 text-5xl mx-auto" />
              )}
            </div>
            <h3
              className={`text-xl font-bold ${
                mensajeModal.tipo === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {mensajeModal.tipo === "success" ? "Operación Exitosa" : "Error"}
            </h3>
            <p className="mt-2 text-gray-700 text-base">
              {mensajeModal.mensaje}
            </p>
            <button
              onClick={() => setMensajeModal(null)}
              className="mt-6 px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-md"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}