import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaTimes,
} from "react-icons/fa";

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
      newErrors.usuario = "El usuario es requerido";
    }
    if (formData.nuevaContrasena && formData.nuevaContrasena.length < 6) {
      newErrors.nuevaContrasena = "La contraseña debe tener al menos 6 caracteres";
    }
    if (formData.nuevaContrasena !== formData.confirmarContrasena) {
      newErrors.confirmarContrasena = "Las contraseñas no coinciden";
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

  return (
    <section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-screen lg:w-full"
    >
      {/* Contenedor principal */}
      <div className="h-full w-screen xl:max-w-4xl lg:mx-auto bg-white shadow-lg overflow-hidden border border-gray-200">
        {/* Encabezado */}
        <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-100 hover:text-white transition-colors lg:hidden"
          >
            <FaArrowLeft />
            <span className="hidden sm:inline">Volver</span>
          </button>
          <h1 className="text-2xl font-bold text-white text-center flex-1">
            Mi Cuenta
          </h1>
          <div className="w-8"></div> {/* Spacer */}
        </div>

        {/* Información de la cancha */}
        <div className="p-6 flex flex-col lg:flex-row gap-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 border-gray-200">
              Información Básica
            </h2>
            <div>
              <p className="text-sm text-gray-500">Nombre de la cancha</p>
              <p className="text-gray-800 font-medium uppercase">
                {cancha?.nombre || "No especificado"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dirección</p>
              <p className="text-gray-800 font-medium">
                {cancha?.direccion || "No especificada"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Barrio</p>
              <p className="text-gray-800 font-medium capitalize">
                {cancha?.barrio || "No especificado"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Localidad</p>
              <p className="text-gray-800 font-medium">
                {cancha?.localidad || "No especificada"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Teléfono</p>
              <p className="text-gray-800 font-medium">
                {cancha?.telefono || "No especificado"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Usuario</p>
              <p className="text-gray-800 font-medium">
                {cancha?.usuario || "No especificado"}
              </p>
            </div>
            <div className="relative">
              <p className="text-sm text-gray-500">Contraseña</p>
              <div className="flex items-center gap-2">
                <p className="text-gray-700 font-medium">
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
                    className="text-xs text-white bg-emerald-600 hover:bg-emerald-500 px-2 py-1 rounded transition-colors"
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Datos del Propietario */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 border-gray-200">
              Datos del Propietario
            </h2>
            <div>
              <p className="text-sm text-gray-500">Nombre</p>
              <p className="text-gray-800 font-medium capitalize">
                {cancha?.propietario_nombre || "No especificado"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Apellido</p>
              <p className="text-gray-800 font-medium capitalize">
                {cancha?.propietario_apellido || "No especificado"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-800 font-medium">
                {cancha?.email || "No especificado"}
              </p>
            </div>
          </div>
        </div>

        {/* Botón para editar credenciales */}
        <div className="max-w-4xl mx-auto mt-6 flex justify-end px-6 pb-6">
          {/* <button
            onClick={handleOpenModal}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white rounded-lg shadow-md transition-all"
          >
            Editar Credenciales
          </button> */}
        </div>
      </div>

      {/* Modal para editar credenciales */}
      <AnimatePresence>
        {showModal && (
          <div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Editar Credenciales</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Usuario
                    </label>
                    <input
                      type="text"
                      name="usuario"
                      value={formData.usuario}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-gray-50 border ${
                        errors.usuario ? "border-red-500" : "border-gray-300"
                      } rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400`}
                    />
                    {errors.usuario && (
                      <p className="mt-1 text-sm text-red-500">{errors.usuario}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="nuevaContrasena"
                        value={formData.nuevaContrasena}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 bg-gray-50 border ${
                          errors.nuevaContrasena ? "border-red-500" : "border-gray-300"
                        } rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400`}
                        placeholder="Dejar en blanco para no cambiar"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.nuevaContrasena && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.nuevaContrasena}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      name="confirmarContrasena"
                      value={formData.confirmarContrasena}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-gray-50 border ${
                        errors.confirmarContrasena ? "border-red-500" : "border-gray-300"
                      } rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400`}
                    />
                    {errors.confirmarContrasena && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.confirmarContrasena}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}