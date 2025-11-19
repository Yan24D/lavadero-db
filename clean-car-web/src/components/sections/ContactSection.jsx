import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

class ContactSection extends React.Component {
  constructor(props) {
    super(props);
    this.contactCards = [
      {
        id: 1,
        icon: 'fas fa-map-marker-alt',
        title: 'Ubicación',
        content: ['Santander de Quilichao', 'Cauca, Colombia'],
        type: 'text'
      },
      {
        id: 2,
        icon: 'fas fa-phone',
        title: 'Teléfono',
        content: '+57 3157235783',
        type: 'phone',
        link: 'tel:+573157235783'
      },
      {
        id: 3,
        icon: 'fas fa-envelope',
        title: 'Email',
        content: 'info@cleancar.com',
        type: 'email',
        link: 'mailto:info@cleancar.com'
      }
    ];
  }

  renderCardContent(card) {
    if (card.type === 'text') {
      return card.content.map((line, index) => (
        <p key={index}>{line}</p>
      ));
    } else if (card.type === 'phone' || card.type === 'email') {
      return <a href={card.link}>{card.content}</a>;
    }
  }

  render() {
    return (
      <section id="contacto" className="contact-section">
        <div className="contact-blobs">
          <div className="contact-blob contact-blob-1"></div>
          <div className="contact-blob contact-blob-2"></div>
        </div>
        
        <Container className="position-relative">
          <div className="text-center mb-5">
            <h2 className="contact-title">Visítanos o Contáctanos</h2>
            <p className="contact-subtitle">
              Estamos listos para darle a tu auto el cuidado que merece
            </p>
          </div>
          
          <Row className="g-4">
            {this.contactCards.map(card => (
              <Col md={4} key={card.id}>
                <div className="contact-card">
                  <div className="contact-icon">
                    <i className={card.icon}></i>
                  </div>
                  <h3>{card.title}</h3>
                  {this.renderCardContent(card)}
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    );
  }
}

export default ContactSection;