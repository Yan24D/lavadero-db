import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import galleryImages, { categories } from '../../Data/galleryData';
import './GallerySection.css';

class GallerySection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: 'todos',
      filteredImages: galleryImages,
      isLightboxOpen: false,
      currentIndex: 0
    };
  }

  filterByCategory = (categoryId) => {
    if (categoryId === 'todos') {
      this.setState({
        selectedCategory: categoryId,
        filteredImages: galleryImages
      });
    } else {
      const filtered = galleryImages.filter(img => img.category === categoryId);
      this.setState({
        selectedCategory: categoryId,
        filteredImages: filtered
      });
    }
  }

  openLightbox = (index) => {
    this.setState({
      isLightboxOpen: true,
      currentIndex: index
    });
  }

  closeLightbox = () => {
    this.setState({ isLightboxOpen: false });
  }

  render() {
    const { selectedCategory, filteredImages, isLightboxOpen, currentIndex } = this.state;

    // Convertir imágenes al formato que necesita la librería
    const slides = filteredImages.map(img => ({
      src: img.url,
      title: img.title,
      description: img.description
    }));

    return (
      <section id="galeria" className="gallery-section">
        <Container>
          {/* Header */}
          <div className="text-center mb-5">
            <span className="badge-gallery mb-3">Galería de Fotos</span>
            <h2 className="section-title">Nuestros Trabajos</h2>
            <p className="section-subtitle">
              Explora nuestra galería y descubre la calidad de nuestro trabajo
            </p>
          </div>

          {/* Filtros de Categorías */}
          <div className="gallery-filters mb-5">
            <Row className="justify-content-center g-3">
              {categories.map(category => (
                <Col xs={6} md={3} key={category.id}>
                  <button
                    className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => this.filterByCategory(category.id)}
                  >
                    <i className={`fas ${category.icon} me-2`}></i>
                    {category.name}
                  </button>
                </Col>
              ))}
            </Row>
          </div>

          {/* Grid de Imágenes */}
          {filteredImages.length > 0 ? (
            <Row className="g-4">
              {filteredImages.map((image, index) => (
                <Col xs={12} sm={6} md={4} key={image.id}>
                  <div 
                    className="gallery-item"
                    onClick={() => this.openLightbox(index)}
                  >
                    <img 
                      src={image.url} 
                      alt={image.title}
                      className="gallery-img"
                    />
                    <div className="gallery-overlay">
                      <div className="gallery-content">
                        <i className="fas fa-search-plus gallery-icon"></i>
                        <h3 className="gallery-title">{image.title}</h3>
                        <p className="gallery-description">{image.description}</p>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-images" style={{ 
                fontSize: '4rem', 
                color: '#d1d5db',
                marginBottom: '1rem'
              }}></i>
              <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
                No hay imágenes en esta categoría
              </p>
            </div>
          )}

          {/* Lightbox */}
          <Lightbox
            open={isLightboxOpen}
            close={this.closeLightbox}
            slides={slides}
            index={currentIndex}
          />
        </Container>
      </section>
    );
  }
}

export default GallerySection;