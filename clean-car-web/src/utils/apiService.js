import axios from 'axios';

// URL base del API
const API_BASE_URL = 'http://localhost:5000/api';

// Configuración de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Clase para manejar todas las peticiones al API
 */
class ApiService {
  /**
   * Verificar estado del API
   */
  static async checkHealth() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error al verificar estado del API:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los servicios agrupados por tipo de vehículo
   */
  static async obtenerServicios() {
    try {
      const response = await api.get('/servicios');
      return response.data;
    } catch (error) {
      console.error('Error al obtener servicios:', error);
      throw error;
    }
  }

  /**
   * Obtener servicios por tipo de vehículo
   * @param {string} tipoVehiculo - motorcycle, car, pickup, suv, truck
   */
  static async obtenerServiciosPorVehiculo(tipoVehiculo) {
    try {
      const response = await api.get(`/servicios/${tipoVehiculo}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener servicios de ${tipoVehiculo}:`, error);
      throw error;
    }
  }

  /**
   * Obtener tipos de vehículos disponibles
   */
  static async obtenerTiposVehiculo() {
    try {
      const response = await api.get('/tipos-vehiculo');
      return response.data;
    } catch (error) {
      console.error('Error al obtener tipos de vehículo:', error);
      throw error;
    }
  }
}

export default ApiService;