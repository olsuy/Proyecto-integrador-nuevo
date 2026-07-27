import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../login/login';
import Home from './Home';
import Elevators from './Elevators/Elevators';
import Monitoring from './Monitoring/Monitoring';
import ProtectedRoute from './ProtectedRute';
import Support from './Support/Support';
import System from './System/System';
function App() {
  const auth = localStorage.getItem("auth") === "true";

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={auth ? <Navigate to="/home" replace /> : <Login />}
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/elevators"
          element={
            <ProtectedRoute>
              <Elevators />
            </ProtectedRoute>
          }
        />

        <Route
          path="/monitoring"
          element={
            <ProtectedRoute>
              <Monitoring />
            </ProtectedRoute>
          }
        />

        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <Support />
            </ProtectedRoute>
          }
        />

        <Route
          path="/system"
          element={
            <ProtectedRoute>
              <System />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;