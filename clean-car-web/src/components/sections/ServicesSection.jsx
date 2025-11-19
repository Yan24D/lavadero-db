import React from 'react';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import ApiService from '../../utils/apiService';
import './ServicesSection.css';

class ServicesSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      servicios: [],
      tiposVehiculo: [],
      vehiculoSeleccionado: null,
      serviciosFiltrados: [],
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    this.cargarDatos();
  }

  async cargarDatos() {
    try {
      // Cargar servicios y tipos de vehículo en paralelo
      const [serviciosResponse, tiposResponse] = await Promise.all([
        ApiService.obtenerServicios(),
        ApiService.obtenerTiposVehiculo()
      ]);

      if (serviciosResponse.success && tiposResponse.success) {
        this.setState({
          servicios: serviciosResponse.data,
          tiposVehiculo: tiposResponse.data,
          loading: false
        });

        // Seleccionar automáticamente el primer tipo de vehículo
        if (serviciosResponse.data.length > 0) {
          this.filtrarPorVehiculo(serviciosResponse.data[0].tipo);
        }
      }
    } catch (error) {
      this.setState({
        loading: false,
        error: 'No se pudieron cargar los servicios. Verifica que el servidor esté corriendo.'
      });
      console.error('Error al cargar datos:', error);
    }
  }

  filtrarPorVehiculo = (tipoVehiculo) => {
    const { servicios } = this.state;
    const vehiculoData = servicios.find(v => v.tipo === tipoVehiculo);
    
    this.setState({
      vehiculoSeleccionado: tipoVehiculo,
      serviciosFiltrados: vehiculoData ? vehiculoData.servicios : []
    });
  }

  getVehiculoNombre = (tipo) => {
    const nombres = {
      'motorcycle': 'Motocicleta',
      'car': 'Automóvil',
      'pickup': 'Camioneta',
      'truck': 'Camión'
    };
    return nombres[tipo] || tipo;
  }

  getVehiculoIcono = (tipo) => {
    const iconos = {
      'motorcycle': 'fa-motorcycle',
      'car': 'fa-car',
      'pickup': 'fa-truck-pickup',
      'truck': 'fa-truck'
    };
    return iconos[tipo] || 'fa-car';
  }

  render() {
    const { loading, error, tiposVehiculo, vehiculoSeleccionado, serviciosFiltrados } = this.state;

    if (loading) {
      return (
        <section id="servicios" className="services-section">
          <Container>
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Cargando servicios...</p>
            </div>
          </Container>
        </section>
      );
    }

    if (error) {
      return (
        <section id="servicios" className="services-section">
          <Container>
            <Alert variant="danger" className="text-center">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          </Container>
        </section>
      );
    }

    return (
      <section id="servicios" className="services-section">
        <Container>
          {/* Header */}
          <div className="text-center mb-5">
            <span className="badge-services mb-3">Nuestros Servicios</span>
            <h2 className="section-title">Servicios Profesionales</h2>
            <p className="section-subtitle">
              Selecciona tu tipo de vehículo y descubre nuestros servicios especializados
            </p>
          </div>

          {/* Filtros de Vehículos */}
          <div className="vehicle-filters mb-5">
            <Row className="g-3 justify-content-center">
              {tiposVehiculo.map(vehiculo => (
                <Col xs={6} md={4} lg={2} key={vehiculo.id}>
                  <button
                    className={`vehicle-filter-btn ${vehiculoSeleccionado === vehiculo.id ? 'active' : ''}`}
                    onClick={() => this.filtrarPorVehiculo(vehiculo.id)}
                  >
                    <i className={`fas ${this.getVehiculoIcono(vehiculo.id)} vehicle-icon`}></i>
                    <span className="vehicle-name">{vehiculo.nombre}</span>
                  </button>
                </Col>
              ))}
            </Row>
          </div>

          {/* Grid de Servicios */}
          <Row className="g-4">
            {serviciosFiltrados.length > 0 ? (
              serviciosFiltrados.map(servicio => (
                <Col md={6} lg={4} key={servicio.id}>
                  <div className="service-card">
                    <div className="service-icon">
                      <i className="fas fa-sparkles"></i>
                    </div>
                    <h3 className="service-title">{servicio.nombre}</h3>
                    <p className="service-description">{servicio.descripcion}</p>
                    <div className="service-price">
                      <span className="price-label">Precio:</span>
                      <span className="price-value">{servicio.precio_formato}</span>
                    </div>
                    <Button 
                      className="btn-contact-service"
                      href="https://wa.me/573157235783"
                      target="_blank"
                    >
                      <i className="fab fa-whatsapp me-2"></i>
                      Consultar
                    </Button>
                  </div>
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <Alert variant="info" className="text-center">
                  <i className="fas fa-info-circle me-2"></i>
                  No hay servicios disponibles para este tipo de vehículo.
                </Alert>
              </Col>
            )}
          </Row>

          {/* CTA Final */}
          <div className="services-cta text-center mt-5">
            <h3>¿Necesitas un servicio personalizado?</h3>
            <p>Contáctanos y te ayudaremos a encontrar la mejor solución para tu vehículo</p>
            <Button 
              className="btn-primary-custom"
              href="https://wa.me/573157235783"
              target="_blank"
            >
              <i className="fab fa-whatsapp me-2"></i>
              Contactar por WhatsApp
            </Button>
          </div>
        </Container>
      </section>
    );
  }
}

export default ServicesSection;