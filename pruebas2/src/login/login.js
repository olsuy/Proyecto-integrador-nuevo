import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './login.css';
import logo from '../App/logo/industrialElRetoño.png';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth === "true") {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
  if (mensaje) {
    const timer = setTimeout(() => {
      setMensaje('');
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [mensaje]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setLoading(true);

    try {
      const respuesta = await axios.post('http://127.0.0.1:5000/api/login', {
        email,
        password
      });

      if (respuesta.data.success) {
        localStorage.setItem("auth", "true");
        localStorage.setItem("usuario", JSON.stringify(respuesta.data.usuario));

        setTimeout(() => {
          navigate("/home", { replace: true });
        }, 700);
      } else {
        setMensaje('Incorrect email or password');
        setLoading(false);
      }
    } catch (error) {
      setMensaje('Error al conectar con el servidor');
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <img
          src={logo}
          alt="Industrial El Retoño"
          className="login-logo"
        />

        <div className="login-container">
          <div className="login-heading">Sign In</div>

          <form className="login-form" onSubmit={handleSubmit}>
            <input
              required
              className="login-input"
              type="email"
              name="email"
              id="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <input
              required
              className="login-input"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <p className={`login-error ${mensaje ? 'show' : ''}`} aria-live="polite">
              {mensaje}
            </p>

            <span className="login-forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </span>

            <button
              className={`login-button ${loading ? 'is-loading' : ''}`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-wrap">
                  <span className="spinner"></span>
                  Entrando...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>

      <div className={`login-overlay ${loading ? 'show' : ''}`}>
        <div className="login-loader-card">
          <div className="loader-ring"></div>
          <p>Checking credentials...</p>
        </div>
      </div>
    </div>
  );
};

export default Login;