import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

class FeaturesBar extends React.Component {
  constructor(props) {
    super(props);
    this.features = [
      {
        id: 1,
        icon: 'fas fa-shield-alt',
        title: 'Garantía Total',
        description: '100% satisfacción garantizada'
      },
      {
        id: 2,
        icon: 'fas fa-bolt',
        title: 'Servicio Rápido',
        description: 'Respetamos tu tiempo'
      },
      {
        id: 3,
        icon: 'fas fa-award',
        title: 'Calidad Premium',
        description: 'Productos profesionales'
      }
    ];
  }

  render() {
    return (
      <section className="features-bar">
        <Container>
          <Row className="g-4">
            {this.features.map(feature => (
              <Col md={4} key={feature.id}>
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className={feature.icon}></i>
                  </div>
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    );
  }
}

export default FeaturesBar;