import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../utils/authService';
import axios from 'axios';
import './DashboardPage.css';

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    
    // Verificar autenticación ANTES de construir el estado
    const isAuth = AuthService.isAuthenticated();
    const usuario = isAuth ? AuthService.getUsuario() : null;
    
    this.state = {
      isAuthenticated: isAuth,
      usuario: usuario,
      stats: {
        ingresos_totales: 0,
        servicios_realizados: 0,
        promedio_servicio: 0,
        comisiones_pagadas: 0,
        ganancia_neta: 0,
        servicios_hoy: 0
      },
      anio: new Date().getFullYear(),
      mes: new Date().getMonth() + 1,
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    // Solo cargar datos si está autenticado
    if (this.state.isAuthenticated && this.state.usuario) {
      this.cargarEstadisticas();
    }
  }

  cargarEstadisticas = async () => {
    try {
      const { anio, mes } = this.state;
      const token = AuthService.getToken();

      if (!token) {
        console.error('No hay token');
        this.setState({ 
          isAuthenticated: false,
          loading: false 
        });
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/admin/dashboard/stats?anio=${anio}&mes=${mes}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        this.setState({
          stats: response.data.data,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      
      // Si el error es 401 (no autorizado), cerrar sesión
      if (error.response && error.response.status === 401) {
        AuthService.logout();
        this.setState({ 
          isAuthenticated: false,
          loading: false 
        });
      } else {
        this.setState({
          error: 'Error al cargar estadísticas',
          loading: false
        });
      }
    }
  }

  handleCerrarSesion = () => {
    AuthService.logout();
    this.setState({ isAuthenticated: false });
    // La redirección se maneja en el render
  }

  handleChangePeriodo = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: parseInt(value) }, () => {
      this.setState({ loading: true });
      this.cargarEstadisticas();
    });
  }

  formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  }

  render() {
    const { isAuthenticated, usuario, stats, anio, mes, loading, error } = this.state;

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
      return <Navigate to="/admin/login" replace />;
    }

    // Si no hay usuario (por seguridad extra)
    if (!usuario) {
      return <Navigate to="/admin/login" replace />;
    }

    // Si no es admin, redirigir al inicio
    if (usuario.rol !== 'admin') {
      return <Navigate to="/" replace />;
    }

    const meses = [
      { value: 1, label: 'Enero' },
      { value: 2, label: 'Febrero' },
      { value: 3, label: 'Marzo' },
      { value: 4, label: 'Abril' },
      { value: 5, label: 'Mayo' },
      { value: 6, label: 'Junio' },
      { value: 7, label: 'Julio' },
      { value: 8, label: 'Agosto' },
      { value: 9, label: 'Septiembre' },
      { value: 10, label: 'Octubre' },
      { value: 11, label: 'Noviembre' },
      { value: 12, label: 'Diciembre' }
    ];

    const anios = [];
    const anioActual = new Date().getFullYear();
    for (let i = anioActual; i >= anioActual - 5; i--) {
      anios.push(i);
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
                <h1 className="header-title">Clean Car - Panel Administrador</h1>
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
              <a href="#dashboard" className="nav-item active">
                <i className="fas fa-chart-line"></i>
                Dashboard
              </a>
              <a href="/admin/servicios" className="nav-item">
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
            {/* Filtros de período */}
            <div className="periodo-filtros">
              <label>Período:</label>
              <select 
                name="anio" 
                value={anio} 
                onChange={this.handleChangePeriodo}
                className="select-periodo"
              >
                {anios.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <select 
                name="mes" 
                value={mes} 
                onChange={this.handleChangePeriodo}
                className="select-periodo"
              >
                {meses.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            {/* Indicadores Principales */}
            <section className="indicadores-section">
              <h2 className="section-title">
                <i className="fas fa-chart-bar"></i>
                Indicadores Principales
              </h2>

              {loading ? (
                <div className="loading-container">
                  <div className="spinner-large"></div>
                  <p>Cargando estadísticas...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <i className="fas fa-exclamation-triangle"></i>
                  <p>{error}</p>
                </div>
              ) : (
                <div className="kpis-grid">
                  {/* KPI 1: Ingresos Totales */}
                  <div className="kpi-card kpi-ingresos">
                    <div className="kpi-icon">
                      <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="kpi-content">
                      <h3 className="kpi-label">Ingresos Totales</h3>
                      <p className="kpi-value">{this.formatearMoneda(stats.ingresos_totales)}</p>
                    </div>
                  </div>

                  {/* KPI 2: Servicios Realizados */}
                  <div className="kpi-card kpi-servicios">
                    <div className="kpi-icon">
                      <i className="fas fa-car"></i>
                    </div>
                    <div className="kpi-content">
                      <h3 className="kpi-label">Servicios Realizados</h3>
                      <p className="kpi-value">{stats.servicios_realizados}</p>
                    </div>
                  </div>

                  {/* KPI 3: Promedio por Servicio */}
                  <div className="kpi-card kpi-promedio">
                    <div className="kpi-icon">
                      <i className="fas fa-calculator"></i>
                    </div>
                    <div className="kpi-content">
                      <h3 className="kpi-label">Promedio por Servicio</h3>
                      <p className="kpi-value">{this.formatearMoneda(stats.promedio_servicio)}</p>
                    </div>
                  </div>

                  {/* KPI 4: Comisiones Pagadas */}
                  <div className="kpi-card kpi-comisiones">
                    <div className="kpi-icon">
                      <i className="fas fa-hand-holding-usd"></i>
                    </div>
                    <div className="kpi-content">
                      <h3 className="kpi-label">Comisiones Pagadas</h3>
                      <p className="kpi-value">{this.formatearMoneda(stats.comisiones_pagadas)}</p>
                    </div>
                  </div>

                  {/* KPI 5: Ganancia Neta */}
                  <div className="kpi-card kpi-ganancia">
                    <div className="kpi-icon">
                      <i className="fas fa-gem"></i>
                    </div>
                    <div className="kpi-content">
                      <h3 className="kpi-label">Ganancia Neta</h3>
                      <p className="kpi-value">{this.formatearMoneda(stats.ganancia_neta)}</p>
                    </div>
                  </div>

                  {/* KPI 6: Servicios Hoy */}
                  <div className="kpi-card kpi-hoy">
                    <div className="kpi-icon">
                      <i className="fas fa-bolt"></i>
                    </div>
                    <div className="kpi-content">
                      <h3 className="kpi-label">Servicios Hoy</h3>
                      <p className="kpi-value">{stats.servicios_hoy}</p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Placeholder para gráficos (Fase 2) */}
            <section className="graficos-section">
              <h2 className="section-title">
                <i className="fas fa-chart-area"></i>
                Análisis y Tendencias
              </h2>
              <div className="graficos-placeholder">
                <i className="fas fa-chart-line fa-3x"></i>
                <p>Los gráficos se agregarán en la siguiente fase</p>
              </div>
            </section>
          </main>
        </div>
      </div>
    );
  }
}

export default DashboardPage;