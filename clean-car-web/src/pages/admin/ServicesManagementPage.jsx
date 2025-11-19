import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../utils/authService';
import axios from 'axios';
import './ServicesManagementPage.css';

class ServicesManagementPage extends React.Component {
  constructor(props) {
    super(props);
    
    const isAuth = AuthService.isAuthenticated();
    const usuario = isAuth ? AuthService.getUsuario() : null;
    
    this.state = {
      isAuthenticated: isAuth,
      usuario: usuario,
      servicios: [],
      tiposVehiculo: [
        { id: 'motorcycle', nombre: 'Motocicleta' },
        { id: 'car', nombre: 'Automóvil' },
        { id: 'pickup', nombre: 'Camioneta' },
        { id: 'truck', nombre: 'Camión' }
      ],
      loading: true,
      error: null,
      servicioSeleccionado: null,
      modalVisible: false,
      modoEdicion: false
    };
  }

  componentDidMount() {
    if (this.state.isAuthenticated && this.state.usuario) {
      this.cargarServicios();
    }
  }

  cargarServicios = async () => {
    try {
      const token = AuthService.getToken();

      if (!token) {
        this.setState({ 
          isAuthenticated: false,
          loading: false 
        });
        return;
      }

      const response = await axios.get('http://localhost:5000/api/servicios');

      if (response.data.success) {
        // Agrupar servicios por ID para facilitar la gestión
        const serviciosAgrupados = this.agruparServicios(response.data.data);
        
        this.setState({
          servicios: serviciosAgrupados,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error al cargar servicios:', error);
      this.setState({
        error: 'Error al cargar servicios',
        loading: false
      });
    }
  }

  agruparServicios = (data) => {
    const serviciosMap = {};

    data.forEach(item => {
      item.servicios.forEach(servicio => {
        if (!serviciosMap[servicio.id]) {
          serviciosMap[servicio.id] = {
            id: servicio.id,
            nombre: servicio.nombre,
            descripcion: servicio.descripcion,
            precios: []
          };
        }

        serviciosMap[servicio.id].precios.push({
          tipo_vehiculo: item.tipo,
          nombre_vehiculo: item.nombre,
          precio: servicio.precio
        });
      });
    });

    return Object.values(serviciosMap);
  }

  handleCerrarSesion = () => {
    AuthService.logout();
    this.setState({ isAuthenticated: false });
  }

  formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  }

  render() {
    const { isAuthenticated, usuario, servicios, loading, error } = this.state;

    if (!isAuthenticated || !usuario) {
      return <Navigate to="/admin/login" replace />;
    }

    if (usuario.rol !== 'admin') {
      return <Navigate to="/" replace />;
    }

    return (
      <div className="dashboard-page">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <div className="logo-small">
                <span>💧</span>
              </div>
              <div>
                <h1 className="header-title">Clean Car - Gestión de Servicios</h1>
                <p className="header-date">
                  <i className="far fa-calendar"></i>
                  {new Date().toLocaleDateString('es-CO', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="header-right">
              <div className="user-info">
                <i className="fas fa-user-circle"></i>
                <span>{usuario.nombre}</span>
              </div>
              <button className="btn-cerrar-sesion" onClick={this.handleCerrarSesion}>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        {/* Contenido principal */}
        <div className="dashboard-content">
          <aside className="dashboard-sidebar">
            <h2 className="sidebar-title">Panel de Control</h2>
            
            <nav className="sidebar-nav">
              <a href="/admin/dashboard" className="nav-item">
                <i className="fas fa-chart-line"></i>
                Dashboard
              </a>
              <a href="/admin/servicios" className="nav-item active">
                <i className="fas fa-cog"></i>
                Servicios y Precios
              </a>
            </nav>

            <div className="sidebar-footer">
              <p>Clean Car Sistema</p>
              <p className="version">v1.0 - 2025</p>
            </div>
          </aside>

          <main className="dashboard-main">
            <section className="servicios-management-section">
              <div className="section-header">
                <h2 className="section-title">
                  <i className="fas fa-cog"></i>
                  Gestión de Servicios y Precios
                </h2>
                <p className="section-description">
                  Administra los servicios que se muestran en la página web
                </p>
              </div>

              {loading ? (
                <div className="loading-container">
                  <div className="spinner-large"></div>
                  <p>Cargando servicios...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <i className="fas fa-exclamation-triangle"></i>
                  <p>{error}</p>
                </div>
              ) : (
                <div className="servicios-grid">
                  {servicios.map(servicio => (
                    <div key={servicio.id} className="servicio-card-admin">
                      <div className="servicio-card-header">
                        <div>
                          <h3 className="servicio-nombre">{servicio.nombre}</h3>
                          <p className="servicio-descripcion">{servicio.descripcion}</p>
                        </div>
                        <div className="servicio-actions">
                          <span className="badge-activo">Activo</span>
                        </div>
                      </div>

                      <div className="precios-table">
                        <table>
                          <thead>
                            <tr>
                              <th>Tipo de Vehículo</th>
                              <th>Precio</th>
                            </tr>
                          </thead>
                          <tbody>
                            {servicio.precios.map(precio => (
                              <tr key={precio.tipo_vehiculo}>
                                <td>
                                  <span className="vehiculo-badge">
                                    {precio.nombre_vehiculo}
                                  </span>
                                </td>
                                <td className="precio-valor">
                                  {this.formatearMoneda(precio.precio)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="card-footer-info">
                        <small>
                          <i className="fas fa-info-circle"></i>
                          Para editar servicios, usa la aplicación de escritorio
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && !error && servicios.length === 0 && (
                <div className="empty-state">
                  <i className="fas fa-inbox fa-3x"></i>
                  <h3>No hay servicios registrados</h3>
                  <p>Agrega servicios desde la aplicación de escritorio</p>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    );
  }
}

export default ServicesManagementPage;