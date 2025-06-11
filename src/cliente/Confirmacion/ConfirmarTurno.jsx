import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useCanchas } from "../../customHooks/useCanchas";
import { useObtenerTurnosxCancha } from "../../customHooks/useObtenerTurnosxCancha";
import { FaUser, FaIdCard, FaMoneyBillWave, FaPhone} from "react-icons/fa";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { GiConfirmed } from "react-icons/gi";
import { User, CreditCard, Phone } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export default function ConfirmarTurno() {
  const location = useLocation();
  const { idCancha } = location.state || {};
  const { idTurno } = location.state || {};
  const { datos: canchas } = useCanchas();
  const { turnos } = useObtenerTurnosxCancha(idCancha);
  const cancha = canchas.find((c) => c.id === idCancha);
  const turno = turnos?.find((t) => t.id === idTurno);
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    dni: "",
    metodoPago: "efectivo",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [turnoConfirmado, setTurnoConfirmado] = useState(false);
  const [errorDni, setErrorDni] = useState("");
  const [errorTelefono, setErrorTelefono] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dni") {
      const soloNumeros = value.replace(/\D/g, "");
      const maximo8Digitos = soloNumeros.slice(0, 8);
      setFormData((prevData) => ({
        ...prevData,
        dni: maximo8Digitos,
      }));

      if (maximo8Digitos.length > 0 && maximo8Digitos.length < 8) {
        setErrorDni("El DNI debe tener 8 dígitos");
      } else {
        setErrorDni("");
      }
      return;
    }

    if (name === "telefono") {
      const soloNumeros = value.replace(/\D/g, "");
      const maximo10Digitos = soloNumeros.slice(0, 10);
      setFormData((prevData) => ({
        ...prevData,
        telefono: maximo10Digitos,
      }));

      if (maximo10Digitos.length > 0 && maximo10Digitos.length < 10) {
        setErrorTelefono("El teléfono debe tener 10 dígitos");
      } else {
        setErrorTelefono("");
      }
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
    });
  };

  const formatearHora = (hora) => hora.slice(0, 5);

  const closeModal = () => {
    navigate("/");
    setShowModal(false);
    setFormData({
      nombre: "",
      dni: "",
      telefono: "",
      metodoPago: "efectivo",
    });
    setTurnoConfirmado(false);
  };

  const reservarTurno = async () => {
    try {
      setIsLoading(true);

      // Actualizamos los datos del turno
      await axios.put(`https://turnogol.site/api-pruebas/turnos/${idTurno}`, {
        nombre: formData.nombre,
        dni: formData.dni,
        telefono: formData.telefono,
        metodoPago: formData.metodoPago,
      });

      // Generamos mensaje para WhatsApp

      const mensaje = `
¡Hola! Soy ${formData.nombre}, y me pongo en contacto para reservar un turno.

📅 Fecha: ${formatearFecha(turno.fecha)}
⏰ Hora: ${formatearHora(turno.hora)} hs

🪪 DNI: ${formData.dni}

💰 Precio total del turno: $${Math.trunc(turno.precio)}
💵 Seña a abonar: $${Math.trunc(cancha.adelanto)}

💳 Método de pago de la seña: ${formData.metodoPago === "efectivo" ? "Efectivo" : "Transferencia"
        }

${formData.metodoPago === "transferencia"
          ? `
He elegido pagar por transferencia a los siguientes datos:

🏦 Alias: ${cancha.alias || "No disponible"}
🏦 CVU / CBU: ${cancha.cvu || "No disponible"}
🏦 A nombre de: ${cancha.wallet_nombre || "No disponible"}
 Banco: ${cancha.wallet_banco || "No disponible"}

📌 Una vez realizado, te enviaré el comprobante por este medio.
`
          : `
Preferí abonar en efectivo. Me pongo a disposición para coordinar lugar y horario para realizar el pago de la seña.
`
        }
`.trim();

      const mensajeCodificado = encodeURIComponent(mensaje);
      const link = `https://wa.me/${cancha.telefono}?text=${mensajeCodificado}`;

      setTurnoConfirmado(true); // Muestra el modal de éxito

      // Redirige automáticamente a WhatsApp después de 1 segundo
      setTimeout(() => {
        window.location.href = link;
      }, 500);

      setTimeout(() => {
        closeModal();
      }, 3000); // 1 segundo de espera
    } catch (err) {
      console.error(
        "Error al reservar turno:",
        err.response?.data || err.message
      );
      alert("Hubo un error al procesar tu solicitud");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      className="min-h-screen w-full flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" fill="none">
          <circle cx="25" cy="25" r="10" fill="url(#gradientCircle)" opacity="0.6" />
          <circle cx="75" cy="75" r="15" fill="url(#gradientCircle)" opacity="0.6" />
          <path d="M0 50 L20 70 L50 40 L80 60 L100 40 V0 H0 Z" fill="url(#gradientPath)" opacity="0.3" />
          <defs>
            <radiaxlradient id="gradientCircle" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#34D399" /> {/* green-400 */}
              <stop offset="100%" stopColor="#059669" /> {/* emerald-600 */}
            </radiaxlradient>
            <linearGradient id="gradientPath" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" /> {/* emerald-500 */}
              <stop offset="100%" stopColor="#065F46" /> {/* green-900 */}
            </linearGradient>
          </defs>
        </svg>
      </div>
      {cancha && turno && (
        <div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full xl:w-[1000px] flex flex-col xl:flex-row justify-center items-center gap-4 max-[]:xl:max-w-5xl xl:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl"
        >
          {/* Tarjeta de información */}
          <div
            className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 mb-6 md:mb-0
                    border border-emerald-100 w- md:w-1/2 xl:w-2/3 xl:w-1/2
                    mx-auto transform transition-all duration-300
                    hover:scale-[1.01] hover:shadow-emerald-300/40 focus-within:shadow-emerald-300/50"
          >
            {/* Form Title */}
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center
                     text-emerald-800 mb-8 uppercase tracking-wider
                     bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent"
            >
              Ingresá tus datos
            </h2>

            {/* Input Fields Section */}
            <div className="space-y-6 sm:space-y-6 mb-8">
              {/* Campo Nombre */}
              <div
                className="flex items-center gap-4 bg-gray-50 px-5 py-1 xl:py-3.5 rounded-2xl
                        focus-within:ring-2 focus-within:ring-emerald-400 focus-within:bg-white
                        transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <div
                  className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl
                          flex items-center justify-center shadow-md transform transition-transform
                          group-hover:scale-105 group-focus-within:scale-105"
                >
                  <User className="text-white text-xl sm:text-2xl" />{" "}
                  {/* Lucide User Icon */}
                </div>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre completo"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="flex-1 bg-transparent border-none outline-none
                       text-base sm:text-xl text-gray-800 placeholder-gray-400
                       font-medium"
                />
              </div>

              {/* Campo DNI */}
              <div
                className="flex items-center gap-4 bg-gray-50 px-5 py-3.5 rounded-2xl
                        focus-within:ring-2 focus-within:ring-emerald-400 focus-within:bg-white
                        transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <div
                  className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl
                          flex items-center justify-center shadow-md transform transition-transform
                          group-hover:scale-105 group-focus-within:scale-105"
                >
                  <CreditCard className="text-white text-xl sm:text-2xl" />{" "}
                  {/* Lucide CreditCard Icon */}
                </div>
                <input
                  type="number"
                  name="dni"
                  placeholder="DNI"
                  value={formData.dni}
                  onChange={handleChange}
                  required
                  className="flex-1 bg-transparent border-none outline-none
                       text-base sm:text-xl text-gray-800 placeholder-gray-400
                       font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" // Tailwind class for number input styling
                />
              </div>
              {/* DNI Error Message */}
              {errorDni && (
                <p className="text-red-600 text-sm mt-1 px-2">{errorDni}</p>
              )}
              <div
                className="flex items-center gap-4 bg-gray-50 px-5 py-3.5 rounded-2xl
                        focus-within:ring-2 focus-within:ring-emerald-400 focus-within:bg-white
                        transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <div
                  className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl
                          flex items-center justify-center shadow-md transform transition-transform
                          group-hover:scale-105 group-focus-within:scale-105"
                >
                  <Phone className="text-white text-xl sm:text-2xl" />{" "}
                  {/* Lucide CreditCard Icon */}
                </div>
                <input
                  type="text"
                  name="telefono"
                  placeholder="Telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="flex-1 bg-transparent border-none outline-none
                       text-base sm:text-xl text-gray-800 placeholder-gray-400
                       font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" // Tailwind class for number input styling
                />
              </div>
              {errorTelefono && (
                <p className="text-red-600 text-sm mt-1 px-2">{errorTelefono}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              disabled={!formData.nombre || formData.dni.length !== 8 && formData.telefono.lenght !== 10} // Original validation logic
              onClick={() => setShowModal(true)} // Using the mock modal handler
              className={`w-full py-4 rounded-xl font-extrabold text-white text-xl sm:text-xl
                    transition-all duration-300 transform active:scale-98 shadow-xl
                    ${formData.nombre &&
                  formData.dni &&
                  formData.dni.length === 8 &&
                  formData.telefono.length === 10
                  ? "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-600 hover:to-green-700 hover:shadow-emerald-500/50"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed shadow-none"
                }`}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
      {/* Modal de Confirmación */}
      <AnimatePresence>
        {showModal && (
          <div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Título */}
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 py-4 sm:py-5 text-center">
                <h3 className="text-xl sm:text-xl font-bold uppercase tracking-wide text-white">
                  Confirmar solicitud
                </h3>
              </div>

              {/* Contenido scrollable */}
              <div className="overflow-y-auto px-4 sm:px-5 py-4 flex-1">
                {/* Datos del cliente */}
                <div className="space-y-3 mb-4">
                  {[
                    {
                      label: "Nombre",
                      value: formData.nombre,
                      icon: <FaUser />,
                    },
                    { label: "DNI", value: formData.dni, icon: <FaIdCard /> },
                    {
                      label: "Teléfono",
                      value: formData.telefono,
                      icon: <FaPhone />,
                    },
                    {
                      label: "Precio",
                      value: `$${Math.trunc(turno.precio)}`,
                      icon: <FaMoneyBill1Wave />,
                    },
                    {
                      label: "Seña",
                      value: `$${Math.trunc(cancha.adelanto)}`,
                      icon: <FaMoneyBillWave />,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 sm:gap-3"
                    >
                      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
                        {item.icon}
                      </div>
                      <span className="font-medium text-gray-800 text-sm sm:text-base">
                        {item.label}:
                      </span>
                      <span className="text-gray-600 text-sm sm:text-base truncate">
                        {item.value || "No disponible"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Detalles del turno */}
                <div className="bg-emerald-50 px-4 py-3 mx-2 my-3 rounded-xl border border-emerald-100">
                  <p className="font-semibold text-emerald-800 text-sm sm:text-base mb-1">
                    Detalles del turno:
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700">
                    <span className="capitalize">{cancha?.nombre}</span> -{" "}
                    {formatearFecha(turno?.fecha)} a las{" "}
                    {formatearHora(turno?.hora)} hs
                  </p>
                </div>

                {/* Método de pago */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Método de pago de seña:
                  </label>
                  <select
                    name="metodoPago"
                    value={formData.metodoPago}
                    onChange={handleChange}
                    className="w-full p-2 sm:p-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none shadow-sm transition text-sm"
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                </div>

                {/* AVISO IMPORTANTE */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md shadow-inner mb-4">
                  <p className="text-yellow-800 text-xs sm:text-sm font-medium">
                    <span className="inline-block mr-1 align-middle">⚠️</span>
                    <strong className="font-bold">AVISO:</strong> Tienes{" "}
                    <span className="font-semibold text-red-600">
                      30 minutos
                    </span>{" "}
                    para enviarle el comprobante de la seña o, si es en
                    efectivo, coordinar el pago. De lo contrario, la solicitud
                    se cancelará automáticamente.
                  </p>
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-2 px-4 sm:px-5 pb-5 pt-2 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 sm:py-3 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-all active:scale-95 text-sm"
                >
                  Volver
                </button>
                <button
                  onClick={reservarTurno}
                  disabled={isLoading}
                  className={`flex-1 py-2 sm:py-3 px-4 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2 active:scale-95 ${isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-md"
                    } text-sm`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    "Solicitar reserva"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
      {/* Modal de Éxito */}
      <AnimatePresence>
        {turnoConfirmado && (
          <div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Icono de éxito */}
              <div className="flex justify-center mt-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <GiConfirmed className="text-green-500 text-4xl" />
                </div>
              </div>

              {/* Título */}
              <h3 className="text-2xl font-bold text-gray-800 text-center mt-5 mb-3">
                ¡Solicitud realizada!
              </h3>

              {/* Mensaje principal */}
              <p className="text-gray-600 px-6 mb-6 text-center">
                Te derivamos con el propietario de la cancha.
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
