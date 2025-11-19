import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

class AboutSection extends React.Component {
  constructor(props) {
    super(props);
    this.aboutFeatures = [
      {
        id: 1,
        icon: 'fas fa-users',
        title: 'Equipo Certificado',
        description: 'Personal altamente capacitado'
      },
      {
        id: 2,
        icon: 'fas fa-sparkles',
        title: 'Productos Premium',
        description: 'Solo lo mejor para tu auto'
      },
      {
        id: 3,
        icon: 'fas fa-clock',
        title: 'Eficiencia',
        description: 'Calidad sin perder tiempo'
      }
    ];

    this.scheduleItems = [
      { id: 1, day: 'Lunes - Viernes', hours: '7:00 AM - 5:00 PM' },
      { id: 2, day: 'Sábados', hours: '7:00 AM - 5:00 PM' },
      { id: 3, day: 'Domingos', hours: '8:00 AM - 11:30 AM' }
    ];
  }

  render() {
    return (
      <section id="nosotros" className="about-section">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <span className="badge-about mb-3">Sobre Nosotros</span>
              <h2 className="section-title">Expertos en Cuidado Automotriz</h2>
              <p className="section-text">
                Con más de 5 años de experiencia, nos especializamos en ofrecer servicios de lavado y detallado 
                de la más alta calidad. Nuestro compromiso es hacer que cada vehículo luzca impecable.
              </p>
              
              <div className="about-features">
                {this.aboutFeatures.map(feature => (
                  <div className="about-feature-item" key={feature.id}>
                    <div className="about-feature-icon">
                      <i className={feature.icon}></i>
                    </div>
                    <div>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
            
            <Col lg={6}>
              <div className="schedule-card-wrapper">
                <div className="schedule-card-bg"></div>
                <div className="schedule-card">
                  <h3>Horario de Atención</h3>
                  <div className="schedule-list">
                    {this.scheduleItems.map(item => (
                      <div className="schedule-item" key={item.id}>
                        <span className="day">{item.day}</span>
                        <span className="hours">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }
}

export default AboutSection;