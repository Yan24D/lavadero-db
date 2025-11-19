import React from 'react';
import { Container } from 'react-bootstrap';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentYear: new Date().getFullYear()
    };
  }

  render() {
    const { currentYear } = this.state;

    return (
      <footer className="footer">
        <Container>
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center mb-3">
              <div className="footer-logo-container position-relative me-3">
                <div className="footer-logo-blur"></div>
                <div className="footer-logo-icon">
                  <span>💧</span>
                </div>
              </div>
              <span className="footer-brand">Clean Car</span>
            </div>
            <p className="footer-text">Lavado Profesional de Vehículos</p>
            <p className="footer-copyright">
              {currentYear} Clean Car. Todos los derechos reservados.
            </p>
          </div>
        </Container>
      </footer>
    );
  }
}

export default Footer;