import { useState } from "react";
import { FaUser, FaIdCard, FaPhone } from "react-icons/fa";

export const Formulario = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    dni: "",
    metodoPago: "efectivo",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 md:mb-0 border border-emerald-100 md:w-1/2">
      <h2 className="lg:text-2xl font-bold text-center text-emerald-800 mb-4 uppercase">
        Ingresá tus datos
      </h2>
      <div className="flex items-center justify-center mb-6"></div>
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <FaUser className="text-emerald-600" />
          </div>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="flex-1 p-2 lg:p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <FaIdCard className="text-emerald-600" />
          </div>
          <input
            type="number"
            name="dni"
            placeholder="DNI"
            value={formData.dni}
            onChange={handleChange}
            required
            className="flex-1 p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <FaPhone className="text-emerald-600" />
          </div>
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
            required
            className="flex-1 p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>
      <button
        whileTap={{ scale: 0.95 }}
        disabled={!formData.nombre || !formData.dni || !formData.telefono}
        onClick={() => setShowModal(true)}
        className={`w-full py-3 rounded-lg font-bold text-white ${
          formData.nombre && formData.dni && formData.telefono
            ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-md"
            : "bg-gray-300 cursor-not-allowed"
        } transition-all`}
      >
        Continuar
      </button>
    </div>
  );
};
