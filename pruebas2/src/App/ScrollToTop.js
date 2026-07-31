import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Solo sube al inicio si la URL NO tiene un "#" al final.
    // Así respetamos el scroll automático de tus tarjetas hacia las secciones.
    if (!hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant" // "instant" para que el salto no se vea animado al cambiar de pestaña
      });
    }
  }, [pathname, hash]);

  return null; // Este componente es invisible, no renderiza nada en pantalla
}