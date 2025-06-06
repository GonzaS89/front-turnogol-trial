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
} from "react-icons/fa";

export default function AgregarTurno() {
  const navigate = useNavigate();
  const location = useLocation();
  const cancha = location.state?.cancha;

  const [horarios, setHorarios] = useState([""]);
  const [showModal, setShowModal] = useState(false);
  const [confIngresos, setConfIngresos] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [horariosExistentes, setHorariosExistentes] = useState([]);

  // Obtener horarios existentes
  useEffect(() => {
    const obtenerHorarios = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`https://turnogol.site/api-pruebas/turnos_canchas/canchas`,  {
          params: { id: cancha?.id },
        });
        setHorariosExistentes(data);
      } catch (error) {
        console.error("Error al obtener horarios existentes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (cancha?.id) obtenerHorarios();
  }, [cancha]);

  // Formatear fecha actual
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Normalizar a inicio del día
  const turnosHoy = horariosExistentes
    .filter((turno) => {
      const fechaTurno = new Date(turno.fecha);
      fechaTurno.setHours(0, 0, 0, 0);
      return fechaTurno.getTime() === hoy.getTime();
    })
    .sort((a, b) => a.hora.localeCompare(b.hora));

  // Manejo de horarios
  const handleHorarioChange = (index, value) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[index] = value;
    setHorarios(nuevosHorarios);
  };

  const agregarCampo = () => setHorarios([...horarios, ""]);
  const eliminarCampo = (index) => {
    const nuevosHorarios = horarios.filter((_, i) => i !== index);
    setHorarios(nuevosHorarios);
  };

  const precioDeTurno = (horaIngresada, cambioTarifa) => {
    const hora = parseInt(horaIngresada.split(":")[0], 10);
    return hora >= cambioTarifa || hora === 0 ? cancha?.tarifa2 : cancha?.tarifa1;
  };

  // Enviar turnos
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await Promise.all(
        horarios.map((hora) =>
          axios.post(`https://turnogol.site/api-pruebas/turnos_canchas`,  {
            hora,
            cancha_id: cancha.id,
            estado: "disponible",
            precio: precioDeTurno(hora, cancha?.cambio_de_tarifa),
          })
        )
      );
      setShowModal(true);
      setConfIngresos(false);
      setHorarios([""]);
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error("Error al agregar turnos:", error);
      alert("Error al guardar los turnos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen w-full py-8 px-4 flex justify-center items-center"
    >
      <div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.2, duration: 0.5 }}
  className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full border border-gray-200"
>
  {/* Header */}
  <div className="flex items-center justify-between mb-6">
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors lg:hidden"
      aria-label="Volver"
    >
      <FaArrowLeft />
      <span className="hidden sm:inline">Volver</span>
    </button>
    <h2 className="text-xl sm:text-2xl xl:text-3xl font-bold text-emerald-600 text-center flex-1">
      Agregar Turnos
    </h2>
    <div className="w-6"></div> {/* Spacer derecho */}
  </div>

  {/* Info Cancha */}
  <div className="rounded-lg p-4 mb-6 bg-emerald-50 border border-emerald-200 shadow-sm">
    <p className="text-center text-emerald-800 font-medium xl:text-lg">
      Cancha: <span className="uppercase">{cancha?.nombre}</span>
    </p>
  </div>

  {/* Horarios existentes */}
  <div className="mb-8">
    <h3 className="text-lg xl:text-xl font-semibold text-gray-700 mb-3 flex items-center gap-2">
      <FaClock className="text-emerald-500" /> Turnos para hoy:
    </h3>
    {isLoading ? (
      <div className="flex justify-center py-3">
        <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-emerald-400 rounded-full"></div>
      </div>
    ) : turnosHoy.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {turnosHoy.map((turno) => (
          <span
            key={turno.id}
            className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm md:text-base font-medium"
          >
            {turno.hora.slice(0, 5)} hs
          </span>
        ))}
      </div>
    ) : (
      <p className="text-gray-400 text-sm lg:text-base italic">
        No hay turnos cargados para hoy.
      </p>
    )}
  </div>

  {/* Formulario */}
  <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
    {horarios.map((hora, index) => (
      <div
        key={index}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-3 group"
      >
        <input
          type="time"
          value={hora}
          onChange={(e) => handleHorarioChange(index, e.target.value)}
          required
          className="flex-1 px-4 py-3 xl:py-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
        />

        {horarios.length > 1 && (
          <button
            type="button"
            onClick={() => eliminarCampo(index)}
            className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-lg transition-all group-hover:opacity-100 opacity-70 group-hover:scale-110"
            title="Eliminar horario"
          >
            <FaTimes />
          </button>
        )}
      </div>
    ))}

    {/* Botón + Horario */}
    <button
      type="button"
      onClick={agregarCampo}
      className="group flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-medium transition-colors text-sm lg:text-lg"
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-100 group-hover:bg-emerald-200 transition">
        <FaPlus />
      </div>
      <span>Agregar otro horario</span>
    </button>

    {/* Botón Guardar */}
    <div className="pt-4">
      <button
        type="button"
        onClick={() => setConfIngresos(true)}
        disabled={horarios.some((h) => !h)}
        className={`w-full py-3 px-4 rounded-lg font-semibold shadow-md transition-all duration-200 transform active:scale-95 ${
          horarios.some((h) => !h)
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white shadow-emerald-300/50 hover:shadow-lg"
        }`}
      >
        Guardar Turnos
      </button>
    </div>
  </form>
</div>

      {/* Modal Confirmación */}
      <AnimatePresence>
        {confIngresos && (
          <div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md border border-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar turnos</h3>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de agregar{" "}
                <span className="font-semibold">{horarios.length}</span>{" "}
                {horarios.length === 1 ? "turno" : "turnos"}?
              </p>
              <ul className="mb-6 flex flex-wrap gap-2">
                {horarios.map((hora, i) => (
                  <li key={i}>
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
                      {hora}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfIngresos(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    "Confirmar"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Éxito */}
      <AnimatePresence>
        {showModal && (
          <div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-xl p-8 text-center max-w-sm w-full border border-emerald-200"
            >
              <FaCheckCircle className="mx-auto text-6xl text-emerald-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Turnos agregados!</h3>
              <p className="text-gray-600 mb-6">Los turnos se han registrado correctamente.</p>
              <div className="h-1 bg-emerald-100 rounded-full overflow-hidden">
                <div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5 }}
                  className="h-full bg-emerald-500"
                />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}