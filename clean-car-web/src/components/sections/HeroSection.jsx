import React from 'react';
import { Container } from 'react-bootstrap';

class HeroSection extends React.Component {
  render() {
    return (
      <section id="home" className="hero-section">
        <div className="hero-blobs">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
        
        <Container className="position-relative">
          <div className="text-center hero-content">
            <span className="badge-premium mb-4">
              Servicio Premium en Santander de Quilichao
            </span>
            <h1 className="hero-title">
              Tu Auto Merece
              <span className="hero-gradient">Lo Mejor</span>
            </h1>
            <p className="hero-subtitle">
              Experiencia profesional en cuidado automotriz con productos de alta gama y técnicas especializadas
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
              <a href="#nosotros" className="btn btn-primary-custom">
                Conocer Más
                <i className="fas fa-arrow-right ms-2"></i>
              </a>
              <a 
                href="https://wa.me/573157235783" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline-custom"
              >
                Contactar Ahora
              </a>
            </div>
          </div>
        </Container>

        <div className="scroll-indicator">
          <i className="fas fa-chevron-down"></i>
        </div>
      </section>
    );
  }
}

export default HeroSection;