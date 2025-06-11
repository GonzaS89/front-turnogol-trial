import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { Eye, EyeOff, User, Lock, Mail, MapPin, Phone, Building } from 'lucide-react'; // Importamos iconos de Lucide

export default function MiCuenta() {
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    usuario: "",
    nuevaContrasena: "",
    confirmarContrasena: "",
  });
  const [errors, setErrors] = useState({});

  const location = useLocation();
  const navigate = useNavigate();
  const { cancha } = location.state || {};

  // Inicializar formData al abrir el modal
  const handleOpenModal = () => {
    setFormData({
      usuario: cancha?.usuario || "",
      nuevaContrasena: "",
      confirmarContrasena: "",
    });
    setErrors({});
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.usuario.trim()) {
      newErrors.usuario = "El usuario es requerido.";
    }
    if (formData.nuevaContrasena && formData.nuevaContrasena.length < 6) {
      newErrors.nuevaContrasena = "La contraseña debe tener al menos 6 caracteres.";
    }
    if (formData.nuevaContrasena && formData.nuevaContrasena !== formData.confirmarContrasena) { // Solo valida si hay nueva contraseña
      newErrors.confirmarContrasena = "Las contraseñas no coinciden.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Datos actualizados:", formData);
      setShowModal(false);
    }
  };

  // Helper para renderizar los detalles
  const renderDetail = (label, value, IconComponent) => (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 flex items-center justify-center text-emerald-600 flex-shrink-0">
        {IconComponent && <IconComponent className="w-5 h-5" />}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-800 font-medium break-words">
          {value || "No especificado"}
        </p>
      </div>
    </div>
  );

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen w-screen flex flex-col items-center p-4 sm:p-6 lg:p-8"
    >
      <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-700 transition-colors px-3 py-2 rounded-lg text-lg mb-4 sm:mb-0 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <FaArrowLeft className="text-xl" />
            <span className="font-medium">Volver al Panel</span>
          </button>
      {/* Contenedor principal de la tarjeta de cuenta */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Encabezado */}
        <div className="p-4 sm:p-6 text-white flex justify-between items-center">
          
          <h1 className="text-2xl md:text-3xl font-extrabold text-emerald-600 text-center flex-1">
            Mi Cuenta
          </h1>
          <div className="w-10 sm:w-16"></div> {/* Espaciador para centrar el título */}
        </div>

        {/* Contenido de la información de la cancha */}
        <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Columna de Información Básica */}
          <div className="flex-1 space-y-5">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 border-b pb-3 border-gray-200">
              Información Básica
            </h2>
            {renderDetail("Nombre de la cancha", cancha?.nombre?.toUpperCase(), Building)}
            {renderDetail("Dirección", cancha?.direccion, MapPin)}
            {renderDetail("Barrio", cancha?.barrio?.toUpperCase(), MapPin)}
            {renderDetail("Localidad", cancha?.localidad, MapPin)}
            {renderDetail("Teléfono", cancha?.telefono, Phone)}
            {renderDetail("Usuario", cancha?.usuario, User)}

            {/* Contraseña con toggle */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Contraseña</p>
                <div className="flex items-center gap-3">
                  <p className="text-gray-800 font-medium">
                    {cancha?.contrasena
                      ? showPassword
                        ? cancha.contrasena
                        : "••••••••"
                      : "No especificada"}
                  </p>
                  {cancha?.contrasena && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-white bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1.5 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Columna de Datos del Propietario */}
          <div className="flex-1 space-y-5 lg:pl-6 lg:border-l lg:border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 border-b pb-3 border-gray-200">
              Datos del Propietario
            </h2>
            {renderDetail("Nombre", cancha?.propietario_nombre?.toUpperCase(), User)}
            {renderDetail("Apellido", cancha?.propietario_apellido?.toUpperCase(), User)}
            {renderDetail("Email", cancha?.email, Mail)}
          </div>
        </div>

        {/* Botón para editar credenciales */}
        {/* <div className="p-6 sm:p-8 pt-0 flex justify-end">
          <button
            onClick={handleOpenModal}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-md transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
          >
            Editar Credenciales
          </button>
        </div> */}
      </div>

      {/* Modal para editar credenciales */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 p-6 sm:p-8"
            >
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">Actualizar Credenciales</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
                  aria-label="Cerrar modal"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-5 mb-6">
                  {/* Campo Usuario */}
                  <div>
                    <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Usuario
                    </label>
                    <input
                      type="text"
                      id="usuario"
                      name="usuario"
                      value={formData.usuario}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 bg-gray-50 border ${
                        errors.usuario ? "border-red-500" : "border-gray-300"
                      } rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all`}
                      placeholder="Ingresa tu usuario"
                    />
                    {errors.usuario && (
                      <p className="mt-1.5 text-sm text-red-600 animate-pulse">{errors.usuario}</p>
                    )}
                  </div>

                  {/* Campo Nueva Contraseña */}
                  <div>
                    <label htmlFor="nuevaContrasena" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="nuevaContrasena"
                        name="nuevaContrasena"
                        value={formData.nuevaContrasena}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 bg-gray-50 border ${
                          errors.nuevaContrasena ? "border-red-500" : "border-gray-300"
                        } rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all`}
                        placeholder="Dejar en blanco para no cambiar"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.nuevaContrasena && (
                      <p className="mt-1.5 text-sm text-red-600 animate-pulse">
                        {errors.nuevaContrasena}
                      </p>
                    )}
                  </div>

                  {/* Campo Confirmar Contraseña */}
                  <div>
                    <label htmlFor="confirmarContrasena" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      id="confirmarContrasena"
                      name="confirmarContrasena"
                      value={formData.confirmarContrasena}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 bg-gray-50 border ${
                        errors.confirmarContrasena ? "border-red-500" : "border-gray-300"
                      } rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all`}
                      placeholder="Confirma tu nueva contraseña"
                    />
                    {errors.confirmarContrasena && (
                      <p className="mt-1.5 text-sm text-red-600 animate-pulse">
                        {errors.confirmarContrasena}
                      </p>
                    )}
                  </div>
                </div>

                {/* Botones del Modal */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 rounded-lg transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}