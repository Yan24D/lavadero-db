import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../utils/authService';
import './LoginPage.css';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      recordarSesion: false,
      error: '',
      loading: false,
      redirect: false
    };
  }

  componentDidMount() {
    // Si ya está autenticado, redirigir al dashboard
    if (AuthService.isAuthenticated()) {
      this.setState({ redirect: true });
    }

    // Listener para atajo de teclado Ctrl + Shift + A
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress = (e) => {
    // Si presiona Ctrl + Shift + A desde cualquier página, redirigir al login
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      // Ya estamos en login, no hacer nada
    }
  }

  handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState({
      [name]: type === 'checkbox' ? checked : value,
      error: '' // Limpiar error al escribir
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    
    const { email, password, recordarSesion } = this.state;

    // Validaciones
    if (!email || !password) {
      this.setState({ error: 'Por favor completa todos los campos' });
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.setState({ error: 'Email inválido' });
      return;
    }

    this.setState({ loading: true, error: '' });

    try {
      const resultado = await AuthService.login(email, password, recordarSesion);

      if (resultado.success) {
        // Login exitoso
        this.setState({ 
          loading: false,
          redirect: true 
        });
      } else {
        // Login fallido
        this.setState({ 
          loading: false,
          error: resultado.message || 'Credenciales incorrectas' 
        });
      }
    } catch (error) {
      this.setState({ 
        loading: false,
        error: 'Error al conectar con el servidor' 
      });
    }
  }

  render() {
    const { email, password, recordarSesion, error, loading, redirect } = this.state;

    // Si está autenticado, redirigir al dashboard
    if (redirect) {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            {/* Logo y título */}
            <div className="login-header">
              <div className="login-logo">
                <div className="logo-icon">💧</div>
              </div>
              <h1 className="login-title">Clean Car</h1>
              <p className="login-subtitle">Panel de Administración</p>
            </div>

            {/* Formulario */}
            <form className="login-form" onSubmit={this.handleSubmit}>
              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="Ingrese su email"
                  value={email}
                  onChange={this.handleChange}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              {/* Contraseña */}
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={this.handleChange}
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>

              {/* Recordar sesión */}
              <div className="form-check">
                <input
                  type="checkbox"
                  id="recordarSesion"
                  name="recordarSesion"
                  checked={recordarSesion}
                  onChange={this.handleChange}
                  disabled={loading}
                />
                <label htmlFor="recordarSesion">Recordar sesión</label>
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  {error}
                </div>
              )}

              {/* Botón de submit */}
              <button 
                type="submit" 
                className="btn-login"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            {/* Footer del login */}
            <div className="login-footer">
              <p>Clean Car Sistema v1.0</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;