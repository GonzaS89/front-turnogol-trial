import { FaUser, FaIdCard, FaPhone, FaMoneyBill1Wave, FaMoneyBillWave } from 'react-icons/fa6';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

export const ModalConfirmacion = () => {

    const [formData, setFormData] = useState({
        nombre: "",
        telefono: "",
        dni: "",
        metodoPago: "efectivo",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(true);

  return (
    <AnimatePresence>
        {showModal && (
          <div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-xl pb-6"
            >
              <h3 className="text-xl md:text-xl xl:text-2xl text-center font-bold mb-10 uppercase bg-emerald-500 py-4 text-gray-50">
                Confirmar solicitud
              </h3>
              {/* Campo de método de pago */}
              {/* Datos del cliente */}
              <div className="flex flex-col gap-3 md:space-y-1 mb-6 text-gray-700 px-4 md:text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-emerald-600 text-sm" />
                  </div>
                  <span className="font-medium">Nombre: <span className="text-gray-500">{formData.nombre}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <FaIdCard className="text-emerald-600 text-sm" />
                  </div>
                  <span className="font-medium">DNI: <span className="text-gray-500">{formData.dni}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <FaPhone className="text-emerald-600 text-sm" />
                  </div>
                  <span className="font-medium">Tel: <span className="text-gray-500">{formData.telefono}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <FaMoneyBill1Wave className="text-emerald-600 text-sm" />
                  </div>
                  <span className="font-medium">Precio: <span className="text-gray-500">${Math.trunc(turno.precio)}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <FaMoneyBillWave className="text-emerald-600 text-sm" />
                  </div>
                  <span className="font-medium">Seña: <span className="text-gray-500">${Math.trunc(cancha.adelanto)}</span></span>
                </div>
              </div>
              {/* Detalles del turno + Datos bancarios si aplica */}
              <div className="bg-emerald-50 rounded-lg mb-6 p-6 md:p-4">
                <p className="font-semibold md:text-sm text-emerald-800 mb-1">Detalles del turno:</p>
                <p className="md:text-sm"><span className="capitalize md:text-sm">{cancha?.nombre}</span> - {formatearFecha(turno?.fecha)} a las {formatearHora(turno?.hora)} hs</p>
              </div>
              <div className="mb-6 px-6">
                <label className="block text-gray-700 font-medium mb-2 md:text-sm">
                  Método de pago de seña:
                </label>
                <select
                  name="metodoPago"
                  value={formData.metodoPago}
                  onChange={handleChange}
                  className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 px-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Volver
                </button>
                <button
                  onClick={reservarTurno}
                  disabled={isLoading}
                  className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
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
  )
}
