import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import FeaturesBar from '../components/sections/FeaturesBar';
import AboutSection from '../components/sections/AboutSection';
import ContactSection from '../components/sections/ContactSection';

class HomePage extends React.Component {
  componentDidMount() {
    // Scroll al inicio cuando se carga la página
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="home-page">
        <HeroSection />
        <FeaturesBar />
        <AboutSection />
        
        {/* CTA para ver servicios */}
        <section className="cta-services-section">
          <div className="container text-center py-5">
            <h2 className="mb-4" style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: '#111827' 
            }}>
              ¿Listo para darle a tu vehículo el cuidado que merece?
            </h2>
            <p className="mb-4" style={{ 
              fontSize: '1.25rem', 
              color: '#6b7280' 
            }}>
              Descubre todos nuestros servicios profesionales
            </p>
            <a 
              href="/servicios" 
              className="btn btn-primary-custom"
              style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
            >
              Ver Todos los Servicios
              <i className="fas fa-arrow-right ms-2"></i>
            </a>
          </div>
        </section>

        {/* Sección de Contacto */}
        <ContactSection />
      </div>
    );
  }
}

export default HomePage;