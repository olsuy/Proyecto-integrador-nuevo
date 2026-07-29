import React from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2"; // Importamos la librería de alertas

const ProtectedRoute = ({ children, allowedRoles }) => {
  const auth = localStorage.getItem("auth");

  // 1. Si no hay sesión, al login
  if (auth !== "true") {
    return <Navigate to="/" replace />;
  }

  const userString = localStorage.getItem("usuario");
  const user = userString ? JSON.parse(userString) : null;

  // 2. Si la ruta está restringida y el usuario no tiene el rol
  if (allowedRoles && user && !allowedRoles.includes(user.id_rol)) {
    
    // Mostramos la notificación profesional de SweetAlert
    Swal.fire({
      icon: 'error',
      title: 'Access Denied',
      text: 'Your profile does not have the necessary permissions to view this section.',
      background: '#0a1122',     // Fondo oscuro consistente con tu diseño
      color: '#ffffff',          // Letra blanca
      confirmButtonColor: '#00b4d8', // Botón color cian
      confirmButtonText: 'OK'
    });

    // Lo regresamos a su pantalla principal
    return <Navigate to="/home" replace />;
  }

  // 3. Si todo está bien, entra a la página
  return children;
};

export default ProtectedRoute;