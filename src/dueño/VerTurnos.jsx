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
  FaExclamationTriangle
} from "react-icons/fa";
import { IoChatbubble } from "react-icons/io5";
import { AiFillLike } from "react-icons/ai";
import { FaBell } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function VerTurnos() {
  const navigate = useNavigate();
  const location = useLocation();
  const cancha = location.state?.cancha;
  const [turnos, setTurnos] = useState([]);
  const [turnosAgrupados, setTurnosAgrupados] = useState({});
  const [fechaVisible, setFechaVisible] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalPagado, setModalPagado] = useState(null); // null = no mostrar modal
  const [showModal, setShowModal] = useState(false);
  const [idTurnoSelec, setIdTurnoSelec] = useState(null);
  const [mensajeModal, setMensajeModal] = useState(null);
  const isReservado = (estado) => ["reservado", "pendiente"].includes(estado);

  // Cargar turnos desde API
  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `https://turnogol.site/api-pruebas/turnos_canchas/canchas?id=${cancha.id}`
        );
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
      const fecha = turno.fecha.split("T")[0];
      if (!acc[fecha]) acc[fecha] = [];
      acc[fecha].push({ ...turno, hora: turno.hora.slice(0, 5) });
      return acc;
    }, {});
    Object.keys(agrupados).forEach((fecha) => {
      agrupados[fecha] = agrupados[fecha].sort((a, b) => {
        const horaA = a.hora === "00:00" ? "24:00" : a.hora;
        const horaB = b.hora === "00:00" ? "24:00" : b.hora;
        return horaA.localeCompare(horaB);
      });
    });
    setTurnosAgrupados(agrupados);
  }, [turnos]);

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
    } catch (error) {
      alert("Error al liberar el turno");
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
    } catch (error) {
      alert("Error al confirmar el turno");
    }
  };

  const eliminarTurno = async (turnoId) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar este turno?");
    if (!confirmar) return;
    try {
      await axios.delete(
        `https://turnogol.site/api-pruebas/turnos_canchas/${turnoId}`
      );
      setTurnos((prevTurnos) => prevTurnos.filter((t) => t.id !== turnoId));
    } catch (error) {
      alert("Error al eliminar el turno");
    }
  };

  const formatFecha = (fechaStr) => {
    const [year, month, day] = fechaStr.split("-");
    const fecha = new Date(year, month - 1, day); // Mes es 0-based
    const options = { weekday: "long", day: "numeric", month: "long" };
    return fecha.toLocaleDateString("es-ES", options);
  };

  // Función para registrar pago
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
      setModalPagado(null); // Cierra el modal actual de pago
    }
  };

  const abrirModalConId = (id) => {
    setShowModal(true);
    setIdTurnoSelec(id);
  };

  const getCantidadPendientes = (fechaStr) => {
    const turnosDeFecha = turnosAgrupados[fechaStr] || [];
    return turnosDeFecha.filter((turno) => turno.estado === "pendiente").length;
  };

  return (
    <div className="min-h-screen w-full text-gray-800 flex flex-col relative">
      <div className="max-w-4xl mx-auto w-full p-6">
        {/* Header */}
        <header className="flex items-center justify-center mb-6 pb-2 border-b border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-800 transition-colors lg:hidden absolute left-0 ml-6"
          >
            <FaArrowLeft />
            <span className="hidden sm:inline">Volver</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent text-center">
            Gestión de Turnos
          </h1>
          <div className="w-8"></div> {/* Spacer */}
        </header>

        {/* Información de la cancha */}
        <div className="bg-emerald-50 rounded-lg shadow-sm p-4 mb-6 text-center border border-emerald-100">
          <p className="text-sm lg:text-lg font-semibold text-gray-700">
            Administrá los turnos de tu cancha
          </p>
        </div>

        {/* Contenido principal */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">
            {error}
          </div>
        ) : Object.keys(turnosAgrupados).length === 0 ? (
          <div className="bg-gray-50 rounded-lg shadow-sm p-6 text-center">
            <FaCalendarAlt className="mx-auto text-4xl text-gray-400 mb-3" />
            <h3 className="text-xl font-medium text-gray-700 mb-1">
              No hay turnos registrados
            </h3>
            <p className="text-gray-500">
              Aún no hay turnos cargados para esta cancha
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(turnosAgrupados).map(([fecha, turnosPorFecha]) => (
              <div
                key={fecha}
                className="rounded-xl shadow-md border border-gray-200 relative"
              >
                {/* Encabezado de fecha */}
                <div className="flex justify-between items-center px-4 bg-gray-50 border-b border-emerald-200 lg:text-xl py-3 lg:py-4 xl:py-6 uppercase">
                  <h3 className="font-semibold text-emerald-800 flex items-center gap-2 relative">
                    {formatFecha(fecha)}

                    {getCantidadPendientes(fecha) > 0 && (
                      <span className="absolute -top-2 -right-3 z-50 inline-flex items-center justify-center w-3 h-3 lg:w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white shadow-md animate-bounce">
                        {getCantidadPendientes(fecha)}
                      </span>
                    )}

                    {getCantidadPendientes(fecha) > 0 && (
                      <span className="text-yellow-600 animate-bounce">
                        <FaBell className="text-sm lg:text-base"/>
                      </span>
                    )}
                  </h3>
                  <button
                    onClick={() => toggleFechaVisibility(fecha)}
                    className="text-sm lg:text-lg text-emerald-700 hover:text-emerald-900 px-3 py-1 rounded-lg hover:bg-gray-100 transition"
                  >
                    {fechaVisible[fecha] ? "Ocultar" : "Mostrar"} turnos
                  </button>
                </div>

                {/* Lista de turnos */}
                {fechaVisible[fecha] && (
                  <ul className="divide-y divide-gray-100">
                    {turnosPorFecha.map((turno) => (
                      <li
                        key={turno.id}
                        className={`p-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${turno.condicion === "Pagado"
                          ? "bg-violet-100 border-l-4 border-violet-500"
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
                            <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center rounded-lg bg-white border border-gray-200 shadow-sm">
                              <FaClock className={`${turno.condicion ? 'text-purple-800' :
                                turno.estado === 'reservado' ? 'text-emerald-600' : turno.estado === 'pendiente' ? 'text-yellow-500' : ''} 
                                text-2xl"`} />
                            </div>
                            <div>
                              <p className="text-lg font-bold text-gray-900">
                                {turno.hora} hs
                              </p>
                              {isReservado(turno.estado) ? (
                                <div className="mt-2 space-y-1">
                                  <p className="flex items-center gap-2 text-sm text-gray-700">
                                    <FaUser />{" "}
                                    {turno.nombre || "Nombre no disponible"}
                                  </p>
                                  <p className="flex items-center gap-2 text-sm text-gray-700">
                                    <FaIdCard />
                                    {turno.dni || "No disponible"}
                                  </p>
                                  <span className="inline-flex text-sm items-center gap-1">
                                    <FaMoneyBillWave />
                                    $ {Math.trunc(turno.precio)}
                                  </span>
                                  <div>
                                    {turno.tipo_pago ? (
                                      // Mostrar si ya fue pagado
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-700 rounded-full shadow-sm hover:shadow">
                                        <FaMoneyBillWave className="text-yellow-300" />
                                        Pagado con {turno.tipo_pago}
                                      </span>
                                    ) : turno.estado === "pendiente" ? (
                                      // Si está pendiente
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full">
                                        <FaClock className="animate-pulse text-white" />
                                        Pendiente de confirmación
                                      </span>
                                    ) : (
                                      // Si está reservado pero no pagado
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full">
                                          <AiFillLike className="text-white" />
                                          Reservado
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-blue-400 to-blue-600 rounded-full">
                                          <FaMoneyBillWave className="text-white" />
                                          Señado
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <p className="text-emerald-600 font-medium mt-2">
                                  Disponible
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Acciones */}
                          <div className="flex flex-col sm:flex-row gap-2 justify-end">
                            {turno.estado === "reservado" &&
                              !turno.condicion && (
                                <>
                                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-400 to-red-600 hover:from-slate-900 hover:to-slate-500 text-white rounded-lg transition-all active:scale-95">
                                    <FaTimes />
                                    <span>Liberar</span>
                                  </button>

                                  {/* Botón Pagado */}
                                  <button
                                    onClick={() => setModalPagado(turno.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white 
                                    hover:from-slate-900 hover:to-slate-500 rounded-lg transition-all active:scale-95"
                                  >
                                    <FaMoneyBillWave />
                                    <span>Marcar como pagado</span>
                                  </button>
                                </>
                              )}

                            {turno.estado === "pendiente" && (
                              <>
                                <button
                                  onClick={() => confirmarPendiente(turno.id)}
                                  className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-all active:scale-95"
                                >
                                  <FaCheck />
                                  <span>Confirmar</span>
                                </button>
                                <button
                                  onClick={() => abrirModalConId(turno.id)}
                                  className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all active:scale-95"
                                >
                                  <FaTimes />
                                  <span>Cancelar</span>
                                </button>
                              </>
                            )}

                            {turno.estado === "disponible" && (
                              <button
                                onClick={() => eliminarTurno(turno.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all active:scale-95"
                                title="Eliminar turno"
                              >
                                <FaTrashAlt />
                                <span className="sm:hidden">Eliminar</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-auto transform transition-all duration-300 animate-fadeIn flex flex-col items-center gap-6 text-center">
            {/* Icono de advertencia */}
            <div className="p-3 rounded-full bg-yellow-100 animate-pulse">
              <FaExclamationTriangle className="text-yellow-500 text-4xl" />
            </div>

            {/* Título */}
            <h3 className="text-xl font-bold text-gray-800">
              ¿Estás seguro de querer cancelar la solicitud?
            </h3>

            {/* Botones */}
            <div className="flex justify-center gap-3 mt-2 w-full">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  ponerDisponible(idTurnoSelec)
                  setShowModal(false);
                }}
                className="px-5 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
              >

                <span>Aceptar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para elegir forma de pago */}
      {modalPagado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full text-center">
            <h3 className="text-lg font-bold mb-4">
              ¿Cómo se realizó el pago?
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => confirmarPago(modalPagado, "efectivo", "Pagado")}
                className="px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200"
              >
                Efectivo
              </button>
              <button
                onClick={() =>
                  confirmarPago(modalPagado, "transferencia", "Pagado")
                }
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                Transferencia
              </button>
              <button
                onClick={() => setModalPagado(null)}
                className="mt-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {mensajeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-xs w-full p-6 animate-fadeIn text-center">
            <h3
              className={`text-lg font-bold ${mensajeModal.tipo === "success" ? "text-green-600" : "text-red-600"
                }`}
            >
              {mensajeModal.tipo === "success" ? "✅ Éxito" : "❌ Error"}
            </h3>
            <p className="mt-2 text-gray-700">{mensajeModal.mensaje}</p>
            <button
              onClick={() => setMensajeModal(null)}
              className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
