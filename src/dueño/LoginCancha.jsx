import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCanchas } from "../customHooks/useCanchas";
import Cookies from "js-cookie";
import { Eye, EyeOff } from "lucide-react";

export default function LoginCancha() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [verContrasena, setVerContrasena] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { datos: canchas } = useCanchas();

  // Redirigir si ya hay sesión activa y datos válidos
  useEffect(() => {
    const token = Cookies.get("authToken");
    const storedCancha = localStorage.getItem("datosCancha");

    if (token && storedCancha) {
      try {
        const parsed = JSON.parse(storedCancha);
        if (parsed.nombre && parsed.propietario_nombre) {
          navigate("/panelcancha", { replace: true });
        } else {
          localStorage.removeItem("datosCancha");
        }
      } catch (e) {
        localStorage.removeItem("datosCancha");
        Cookies.remove("authToken");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const canchaEncontrada = canchas.find(
        (cancha) => cancha.usuario === usuario && cancha.contrasena === contrasena
      );

      if (canchaEncontrada) {
        const fakeToken = btoa(JSON.stringify({ id: canchaEncontrada.id, exp: Date.now() + 3600000 }));

        Cookies.set("authToken", fakeToken, {
          expires: 1,
          secure: true,
          sameSite: "strict",
          path: "/",
        });

        localStorage.setItem("datosCancha", JSON.stringify(canchaEncontrada));

        navigate("/panelcancha", {
          state: { cancha: canchaEncontrada },
          replace: true,
        });
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (err) {
      setError("Ocurrió un error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center p-6 sm:p-8 relative">
      {/* Tarjeta de login */}
      <form
        onSubmit={handleLogin}
        className="relative bg-white rounded-3xl shadow-xl border border-gray-200 p-8 w-full max-w-md flex flex-col gap-6 z-50"
      >
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent text-center">
          Acceso para Canchas
        </h2>

        {/* Campos del formulario */}
        <div className="space-y-4 backdrop-blur-sm bg-white/80 p-5 rounded-xl shadow-md border border-gray-200">
          {/* Campo Usuario */}
          <div>
            <label htmlFor="usuario" className="block text-sm font-medium text-gray-800 mb-1 mx-1">
              Usuario
            </label>
            <input
              id="usuario"
              type="text"
              placeholder="Ingresa tu usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-white/70 text-gray-900 placeholder:text-gray-400 transition duration-200"
              required
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label htmlFor="contrasena" className="block text-sm font-medium text-gray-800 mb-1 mx-1">
              Contraseña
            </label>
            <div className="relative group">
              <input
                id="contrasena"
                type={verContrasena ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-white/70 text-gray-900 pr-10 placeholder:text-gray-400 transition duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setVerContrasena(!verContrasena)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-emerald-500 transition-colors duration-200"
                aria-label={verContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {verContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center py-2 px-3 bg-red-50 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`group relative flex items-center justify-center py-3 px-6 rounded-xl shadow-md transition-all duration-300 ${
            isLoading
              ? "bg-emerald-700 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600"
          }`}
        >
          <span className="relative z-10 flex items-center gap-2 text-white font-semibold">
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Verificando...
              </>
            ) : (
              <>
                Ingresar
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </>
            )}
          </span>
        </button>
      </form>
    </section>
  );
}