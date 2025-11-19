import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages públicas
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';

// Pages admin
import LoginPage from './pages/admin/LoginPage';  // ← NUEVO
import DashboardPage from './pages/admin/DashboardPage';
import ServicesManagementPage from './pages/admin/ServicesManagementPage';

class App extends React.Component {
  componentDidMount() {
    // Smooth scroll para los links con # (dentro de la misma página)
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        e.preventDefault();
        const element = document.querySelector(target.getAttribute('href'));
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });

    // Atajo de teclado Ctrl + Shift + A para ir al login
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        window.location.href = '/admin/login';
      }
    });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Routes>
            {/* Rutas públicas (con navbar y footer) */}
            <Route path="/" element={
              <>
                <Navbar />
                <main><HomePage /></main>
                <Footer />
              </>
            } />
            
            <Route path="/servicios" element={
              <>
                <Navbar />
                <main><ServicesPage /></main>
                <Footer />
              </>
            } />

            {/* Rutas admin (sin navbar ni footer) */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/servicios" element={<ServicesManagementPage />} />

            {/* Ruta 404 */}
            <Route path="*" element={
              <>
                <Navbar />
                <main>
                  <div className="text-center py-5" style={{ 
                    minHeight: '60vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: '100px'
                  }}>
                    <h1 style={{ fontSize: '6rem', color: '#e5e7eb' }}>404</h1>
                    <h2 style={{ color: '#6b7280', marginBottom: '2rem' }}>
                      Página no encontrada
                    </h2>
                    <a href="/" className="btn btn-primary-custom">
                      Volver al Inicio
                    </a>
                  </div>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;