import React from 'react';
import ServicesSection from '../components/sections/ServicesSection';
import GallerySection from '../components/sections/GallerySection';
import { Container } from 'react-bootstrap';

class ServicesPage extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="services-page">
        {/* Hero de Servicios */}
        <section className="services-hero">
          <Container>
            <div className="text-center py-5">
              <span className="badge-premium mb-3">
                Servicios Profesionales
              </span>
              <h1 className="hero-title" style={{ 
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                color: '#ffffffff',
                marginBottom: '1.5rem'
              }}>
                Cuidado Especializado para tu
                <span className="hero-gradient" style={{ display: 'block' }}>
                  Vehículo
                </span>
              </h1>
              <p className="hero-subtitle" style={{ 
                fontSize: '1.25rem',
                maxWidth: '700px',
                margin: '0 auto'
              }}>
                Ofrecemos servicios de lavado y detallado de la más alta calidad, 
                adaptados a cada tipo de vehículo
              </p>
            </div>
          </Container>
        </section>

        {/* Sección de Servicios */}
        <ServicesSection />

        {/* Galería de Fotos */}
        <GallerySection />

        {/* CTA de Contacto */}
        <section className="services-cta-bottom" style={{ 
          background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
          padding: '4rem 0'
        }}>
          <Container className="text-center">
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: '#111827',
              marginBottom: '1.5rem'
            }}>
              ¿Tienes alguna pregunta?
            </h2>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#6b7280',
              marginBottom: '2rem'
            }}>
              Nuestro equipo está listo para ayudarte
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <a 
                href="/#contacto" 
                className="btn btn-primary-custom"
              >
                <i className="fas fa-envelope me-2"></i>
                Contáctanos
              </a>
              <a 
                href="https://wa.me/573157235783" 
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <i className="fab fa-whatsapp me-2"></i>
                WhatsApp
              </a>
            </div>
          </Container>
        </section>
      </div>
    );
  }
}

export default ServicesPage;