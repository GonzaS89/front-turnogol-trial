import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCanchas } from "../customHooks/useCanchas";
import Cookies from "js-cookie";
import { Eye, EyeOff, UserCircle2, LockKeyhole } from "lucide-react"; // Importamos iconos de Lucide actualizados

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

    if (!usuario.trim() || !contrasena.trim()) {
      setError("Por favor, ingresa tu usuario y contraseña.");
      setIsLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simula un retraso de red

      const canchaEncontrada = canchas?.find( // Usa optional chaining para canchas
        (cancha) => cancha.usuario === usuario && cancha.contrasena === contrasena
      );

      if (canchaEncontrada) {
        // En un entorno real, este token debería venir de un backend
        const fakeToken = btoa(JSON.stringify({ id: canchaEncontrada.id, exp: Date.now() + 3600000 }));

        Cookies.set("authToken", fakeToken, {
          expires: 1, // Expira en 1 día
          secure: true, // Solo enviar sobre HTTPS
          sameSite: "strict", // Prevenir ataques CSRF
          path: "/",
        });

        localStorage.setItem("datosCancha", JSON.stringify(canchaEncontrada));

        navigate("/panelcancha", {
          state: { cancha: canchaEncontrada },
          replace: true,
        });
      } else {
        setError("Usuario o contraseña incorrectos.");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Ocurrió un error inesperado al iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-emerald-50 to-white relative overflow-hidden">
      {/* Fondo decorativo (elementos abstractos o patrón) */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" fill="none">
          <circle cx="25" cy="25" r="10" fill="url(#gradientCircle)" opacity="0.6"/>
          <circle cx="75" cy="75" r="15" fill="url(#gradientCircle)" opacity="0.6"/>
          <path d="M0 50 L20 70 L50 40 L80 60 L100 40 V0 H0 Z" fill="url(#gradientPath)" opacity="0.3"/>
          <defs>
            <radialGradient id="gradientCircle" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#34D399" /> {/* green-400 */}
              <stop offset="100%" stopColor="#059669" /> {/* emerald-600 */}
            </radialGradient>
            <linearGradient id="gradientPath" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" /> {/* emerald-500 */}
              <stop offset="100%" stopColor="#065F46" /> {/* green-900 */}
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Tarjeta de login */}
      <form
        onSubmit={handleLogin}
        className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 sm:p-10 w-full max-w-sm sm:max-w-md flex flex-col gap-6 z-10 transform transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]"
      >
        {/* Logo/Icono Central */}
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full shadow-xl">
            <UserCircle2 className="w-10 h-10 text-white" /> {/* Icono de Lucide más representativo */}
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent text-center tracking-tight">
          Acceso para Canchas
        </h2>

        {/* Campos del formulario */}
        <div className="space-y-5 bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-inner border border-gray-100">
          {/* Campo Usuario */}
          <div>
            <label htmlFor="usuario" className="block text-sm font-semibold text-gray-800 mb-1.5 ml-1">
              Usuario
            </label>
            <input
              id="usuario"
              type="text"
              placeholder="Ingresa tu usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-gray-50 text-gray-900 placeholder:text-gray-400 transition-all duration-200"
              required
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label htmlFor="contrasena" className="block text-sm font-semibold text-gray-800 mb-1.5 ml-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="contrasena"
                type={verContrasena ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-gray-50 text-gray-900 pr-10 placeholder:text-gray-400 transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setVerContrasena(!verContrasena)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors duration-200 p-1"
                aria-label={verContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {verContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-700 text-sm font-medium text-center py-3 px-4 bg-red-100 rounded-lg border border-red-200 shadow-sm animate-pulse"
          >
            {error}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`group relative flex items-center justify-center py-3.5 px-6 rounded-xl shadow-lg transition-all duration-300 transform active:scale-98 text-xl font-extrabold ${ // Texto más grande y bold
            isLoading
              ? "bg-emerald-700 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 hover:shadow-xl" // Degradado más oscuro al hover y sombra más pronunciada
          }`}
        >
          <span className="relative z-10 flex items-center gap-2 text-white">
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" // Ícono más grande
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
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform" // Ícono más grande
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