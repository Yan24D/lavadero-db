/**
 * Galería de fotos - Clean Car
 * Imágenes locales organizadas por categoría
 */

// ========================================
// IMPORTAR IMÁGENES - ANTES Y DESPUÉS
// ========================================
// Ajusta los nombres según tus archivos reales
import antesDespues1 from '../assets/images/gallery/antes-despues/antes-despues-1.jpg';
import antesDespues2 from '../assets/images/gallery/antes-despues/antes-despues-2.jpg';
import antesDespues3 from '../assets/images/gallery/antes-despues/antes-despues-3.jpg';

// ========================================
// IMPORTAR IMÁGENES - INSTALACIONES
// ========================================
import instalacion1 from '../assets/images/gallery/instalaciones/instalacion-1.jpg';
import instalacion2 from '../assets/images/gallery/instalaciones/instalacion-2.jpg';
import instalacion3 from '../assets/images/gallery/instalaciones/instalacion-3.jpg';

// ========================================
// IMPORTAR IMÁGENES - TRABAJOS
// ========================================
import trabajo1 from '../assets/images/gallery/trabajos/trabajo-1.jpg';
import trabajo2 from '../assets/images/gallery/trabajos/trabajo-2.jpg';
import trabajo3 from '../assets/images/gallery/trabajos/trabajo-3.jpg';
import trabajo4 from '../assets/images/gallery/trabajos/trabajo-4.jpg';
import trabajo5 from '../assets/images/gallery/trabajos/trabajo-5.jpg';
import trabajo6 from '../assets/images/gallery/trabajos/trabajo-6.jpg';

// ========================================
// ARRAY DE IMÁGENES
// ========================================
const galleryImages = [
  // Categoría: Antes y Después
  {
    id: 1,
    url: antesDespues1,
    title: 'Lavado Exterior - Transformación',
    category: 'antes-despues',
    description: 'Resultado del lavado completo exterior'
  },
  {
    id: 2,
    url: antesDespues2,
    title: 'Exterior - Antes y Después',
    category: 'antes-despues',
    description: 'Limpieza profunda'
  },
  {
    id: 3,
    url: antesDespues3,
    title: 'Motor - Limpieza Total',
    category: 'antes-despues',
    description: 'Desengrase y limpieza del compartimento del motor'
  },

  // Categoría: Instalaciones
  {
    id: 4,
    url: instalacion1,
    title: 'Nuestras Instalaciones',
    category: 'instalaciones',
    description: 'Área de lavado'
  },
  {
    id: 5,
    url: instalacion2,
    title: 'Zona de Trabajo',
    category: 'instalaciones',
    description: 'Herramientas y productos de primera calidad'
  },
  {
    id: 6,
    url: instalacion3,
    title: 'Equipamiento Profesional',
    category: 'instalaciones',
    description: 'Espacio amplio para atender múltiples vehículos'
  },

  // Categoría: Trabajos Realizados
  {
    id: 7,
    url: trabajo1,
    title: 'Lavado de Motocicleta',
    category: 'trabajos',
    description: 'Servicio completo'
  },
  {
    id: 8,
    url: trabajo2,
    title: 'Detallado de Camioneta',
    category: 'trabajos',
    description: 'Limpieza especializada para pickup'
  },
  {
    id: 9,
    url: trabajo3,
    title: 'Brillado Premium',
    category: 'trabajos',
    description: 'Acabado con cera de alta gama'
  },
  {
    id: 10,
    url: trabajo4,
    title: 'Lavado de Motocicleta',
    category: 'trabajos',
    description: 'Cuidado especializado para motos'
  },
  {
    id: 11,
    url: trabajo5,
    title: 'Limpieza Exterior',
    category: 'trabajos',
    description: 'Juagado y enjabonado'
  },
  {
    id: 12,
    url: trabajo6,
    title: 'Lavado de motocicleta',
    category: 'trabajos',
    description: 'Servicio completo'
  }
];

// ========================================
// CATEGORÍAS
// ========================================
export const categories = [
  { id: 'todos', name: 'Todos', icon: 'fa-th' },
  { id: 'antes-despues', name: 'Antes y Después', icon: 'fa-exchange-alt' },
  { id: 'instalaciones', name: 'Instalaciones', icon: 'fa-building' },
  { id: 'trabajos', name: 'Trabajos Realizados', icon: 'fa-briefcase' }
];

export default galleryImages;