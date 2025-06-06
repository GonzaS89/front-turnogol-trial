// PrivateRoute.jsx
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const datosRaw = localStorage.getItem("datosCancha");

  if (!datosRaw) {
    return <Navigate to="/login" replace />;
  }

  try {
    const datos = JSON.parse(datosRaw);
    if (!datos || !datos.nombre || !datos.propietario_nombre) {
      return <Navigate to="/login" replace />;
    }
  } catch (e) {
    return <Navigate to="/login" replace />;
  }

  return children;
}