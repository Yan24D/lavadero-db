import React from 'react';
import { Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

// Componente funcional wrapper para usar useLocation
function NavbarWrapper() {
  const location = useLocation();
  return <Navbar currentPath={location.pathname} />;
}

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isScrolled: false
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    if (window.scrollY > 50) {
      this.setState({ isScrolled: true });
    } else {
      this.setState({ isScrolled: false });
    }
  };

  isActive = (path) => {
    // Usar la prop currentPath que viene del wrapper
    return this.props.currentPath === path ? 'active' : '';
  };

  render() {
    const { isScrolled } = this.state;

    return (
      <nav className={`navbar navbar-dark navbar-custom ${isScrolled ? 'scrolled' : ''}`}>
        <Container fluid className="px-4">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <div className="logo-container position-relative me-3">
              <div className="logo-blur"></div>
              <div className="logo-icon">
                <span>💧</span>
              </div>
            </div>
            <div>
              <h1 className="logo-title mb-0">Clean Car</h1>
              <p className="logo-subtitle mb-0">Professional Care</p>
            </div>
          </Link>
          
          {/* Links de navegación */}
          <div className="d-none d-lg-flex gap-4 me-4">
            <Link to="/" className={`nav-link-custom ${this.isActive('/')}`}>
              Inicio
            </Link>
            <Link to="/servicios" className={`nav-link-custom ${this.isActive('/servicios')}`}>
              Servicios
            </Link>
          </div>
          
          <a 
            href="https://wa.me/573157235783" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-whatsapp"
          >
            <i className="fab fa-whatsapp me-2"></i>WhatsApp
          </a>
        </Container>
      </nav>
    );
  }
}

// Exportar el wrapper en lugar de la clase directamente
export default NavbarWrapper;