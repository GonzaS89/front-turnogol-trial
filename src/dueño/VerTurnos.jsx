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
  FaPhone,
  FaClock,
  FaRegThumbsUp,
} from "react-icons/fa";

export default function VerTurnos() {
  const navigate = useNavigate();
  const location = useLocation();
  const cancha = location.state?.cancha;

  const [turnos, setTurnos] = useState([]);
  const [turnosAgrupados, setTurnosAgrupados] = useState({});
  const [fechaVisible, setFechaVisible] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isReservado = (estado) =>
    estado === "reservado" || estado === "pendiente";

  const [modalDelete, setModalDelete] = useState(false)
   

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
      await axios.put(`https://turnogol.site/api-pruebas/turnos/liberar/${turnoId}`);
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
      await axios.put(`https://turnogol.site/api-pruebas/turnos/confirmar/${turnoId}`);
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
      await axios.delete(`https://turnogol.site/api-pruebas/turnos_canchas/${turnoId}`);
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

  return (
    <div className="min-h-screen w-full text-gray-800 flex flex-col p-6 relative">
      <div className="max-w-4xl mx-auto w-full">
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
                className="rounded-xl shadow-md overflow-hidden border border-gray-200"
              >
                {/* Encabezado de fecha */}
                <div className="flex justify-between items-center px-4 bg-gray-50 border-b border-emerald-200 lg:text-xl py-3 lg:py-4 xl:py-6 uppercase">
                  <h3 className="font-semibold text-emerald-800">
                    {formatFecha(fecha)}
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
                        className={`p-4 rounded-lg transition-colors duration-200 ${
                          turno.estado === "disponible"
                            ? "bg-gray-50 border-l-4 border-gray-200"
                            : turno.estado === "pendiente"
                            ? "bg-yellow-50 hover:bg-yellow-100 border-l-4 border-yellow-400"
                            : "bg-emerald-50 hover:bg-emerald-100 border-l-4 border-emerald-400" 
                            
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          {/* Información del turno */}
                          <div className="flex items-start sm:items-center gap-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center rounded-lg bg-white border border-gray-200 shadow-sm">
                              <FaClock className="text-emerald-600 text-2xl" />
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
                                    <FaIdCard /> DNI:{" "}
                                    {turno.dni || "No disponible"}
                                  </p>
                                  {turno.telefono && (
                                    <p className="flex items-center gap-2 text-sm text-gray-700">
                                      <FaPhone /> Tel: {turno.telefono}
                                    </p>
                                  )}
                                  <div>
                                    {turno.estado === "pendiente" ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
                                        <FaClock /> Pendiente
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full">
                                        <FaRegThumbsUp /> Reservado
                                      </span>
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
                            {turno.estado === "reservado" && (
                              <button
                                onClick={() => ponerDisponible(turno.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all active:scale-95"
                              >
                                <FaTimes />
                                <span>Liberar</span>
                              </button>
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
                                  onClick={() => ponerDisponible(turno.id)}
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
    </div>
  );
}
