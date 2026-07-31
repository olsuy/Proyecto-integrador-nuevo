import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../login/login';
import Home from './Home';
import Elevators from './Elevators/Elevators';
import Monitoring from './Monitoring/Monitoring';
import ProtectedRoute from './ProtectedRute';
import Support from './Support/Support';
import System from './System/System';
import PLC_SCADA from './PLC_SCADA/PLC_SCADA';

// 1. Importa el componente que acabas de crear
import ScrollToTop from './ScrollToTop'; 

function App() {
  const auth = localStorage.getItem("auth") === "true";

  return (
    <BrowserRouter>
      {/* 2. Colócalo aquí, justo adentro del BrowserRouter pero antes de las Routes */}
      <ScrollToTop />

      <Routes>
        <Route
          path="/"
          element={auth ? <Navigate to="/home" replace /> : <Login />}
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={[6, 7, 8, 9]} >
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/elevators"
          element={
            <ProtectedRoute allowedRoles={[6, 8 ,9]}>
              <Elevators />
            </ProtectedRoute>
          }
        />

        <Route
          path="/monitoring"
          element={
            <ProtectedRoute allowedRoles={[6, 7,9]}>
              <Monitoring />
            </ProtectedRoute>
          }
        />

        <Route
          path="/support"
          element={
            <ProtectedRoute allowedRoles={[6, 7,8,9]}>
              <Support />
            </ProtectedRoute>
          }
        />

        <Route
          path="/system"
          element={
            <ProtectedRoute allowedRoles={[6, 7]}>
              <System />
            </ProtectedRoute>
          }
        />

        <Route
          path="/plc-scada"
          element={
            <ProtectedRoute allowedRoles={[6,8,9]}>
              <PLC_SCADA />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;