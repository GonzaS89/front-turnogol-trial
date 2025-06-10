import { useState, useEffect } from "react";
import { useCanchas } from "../../customHooks/useCanchas";
import { useObtenerTodosLosTurnos } from "../../customHooks/useObtenerTodosLosTurnos";
import { Cancha } from "./components/Cancha";
import { format } from "date-fns";

// Asegúrate de que esta ruta a tu logo sea correcta
import logo from "/logo.png"; // Puedes dejarlo aquí o quitarlo si no se usa directamente en este componente.

export default function Canchas() {
  const { datos: canchas, isLoading, error } = useCanchas();
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { turnos } = useObtenerTodosLosTurnos();

  // Mostrar resultados solo si hay texto en el input
  useEffect(() => {
    setShowResults(searchTerm.trim() !== "");
  }, [searchTerm]);

  // Contar turnos libres para hoy
  const turnosLibres = (id) =>
    turnos.reduce((total, turno) => {
      return turno.estado === "disponible" &&
        turno.cancha_id === id &&
        formatearFecha(turno.fecha) === getFechaHoy()
        ? total + 1
        : total;
    }, 0);

  function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    return format(fecha, "dd-MM-yyyy");
  }

  function getFechaHoy() {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, "0");
    const mes = String(hoy.getMonth() + 1).padStart(2, "0"); // Los meses empiezan en 0
    const anio = hoy.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }

  // Filtrado universal
  const filteredCanchas =
    canchas?.filter((cancha) => {
      const term = searchTerm.toLowerCase().trim();

      if (!term) return false;

      return (
        cancha.nombre.toLowerCase().includes(term) ||
        cancha.localidad.toLowerCase().includes(term) ||
        (cancha.provincia && cancha.provincia.toLowerCase().includes(term))
      );
    }) || [];

  return (
    // Contenedor principal: ocupa toda la pantalla, con un degradado de fondo y flexbox para centrar el contenido
    <section className="w-full min-h-screen flex flex-col items-center py-6 px-2 sm:px-4 bg-gradient-to-b from-emerald-50 via-white to-emerald-50">
      {/* Contenido centrado y con ancho máximo */}
      <div className="w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto flex flex-col items-center px-3 sm:px-5">
        {/* Header de la página */}
        <header className="mb-8 sm:mb-10 text-center w-full">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 bg-clip-text text-transparent">
            ¿Listo para jugar?
          </h1>
          <p className="mt-2 text-base sm:text-lg text-gray-600 max-w-md mx-auto">
            Encuentra una cancha cerca de vos y reserva tu turno.
          </p>

          {/* Input de búsqueda - Centrado y más grande */}
          <div className="relative w-full max-w-lg mx-auto mt-6 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110 group-focus-within:text-emerald-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-400 group-focus-within:text-emerald-600 transition-colors duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre, localidad o provincia"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 shadow-lg focus:outline-none focus:ring-3 focus:ring-emerald-500 focus:border-transparent bg-white text-gray-800 placeholder-gray-400 transition-all duration-300 ease-in-out group-hover:shadow-xl text-base sm:text-lg"
              aria-label="Buscar cancha"
            />
          </div>
        </header>

        {/* Zona de resultados y mensajes */}
        <div className="w-full mt-8">
          {/* Mensaje inicial sin búsqueda */}
          {!showResults && (
            <div className="flex flex-col items-center justify-center gap-4 p-8 bg-white/70 backdrop-blur-sm rounded-xl shadow-md text-center max-w-md mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-20 h-20 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
                Empieza a buscar
              </h3>
              <p className="text-base md:text-lg text-gray-600">
                Escribe el nombre, localidad o provincia de la cancha que buscas.
              </p>
            </div>
          )}

          {/* Indicador de carga */}
          {isLoading && (
            <div className="w-full h-48 flex flex-col justify-center items-center bg-white/70 backdrop-blur-sm rounded-xl shadow-inner">
              <div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-base font-medium text-gray-600">
                Cargando canchas...
              </p>
            </div>
          )}

          {/* Mensaje de error */}
          {error && (
            <div className="p-6 text-red-700 text-center bg-red-50 rounded-lg border border-red-100 shadow-md">
              <p className="text-lg font-medium">
                Hubo un error al cargar las canchas. Inténtalo nuevamente.
              </p>
            </div>
          )}

          {/* Resultados de búsqueda */}
          {!isLoading && !error && showResults && (
            <>
              {filteredCanchas.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-5 p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg text-center max-w-sm mx-auto transform transition-all hover:shadow-xl duration-300">
                  {/* Icono con efecto */}
                  <div className="p-3 rounded-full bg-emerald-100 text-emerald-500 transition-transform duration-300 group-hover:rotate-12">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-16 h-16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                    No encontramos canchas
                  </h3>
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                    No hay canchas que coincidan con tu búsqueda. Prueba con
                    otra palabra clave.
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-base font-semibold rounded-lg shadow-md hover:from-emerald-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition"
                  >
                    Limpiar búsqueda
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-gray-700 text-base sm:text-lg xl:text-xl text-center font-medium mb-6">
                    Seleccioná una cancha para reservar tu turno:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {filteredCanchas.map((cancha) => (
                      <Cancha
                        key={cancha.id}
                        id={cancha.id}
                        seccion={cancha.seccion}
                        nombre={cancha.nombre}
                        localidad={cancha.localidad}
                        direccion={cancha.direccion}
                        logo={cancha.logo}
                        turnosDisponibles={turnosLibres(cancha.id)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}