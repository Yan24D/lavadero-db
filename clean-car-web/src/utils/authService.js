import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:5000/api/auth';

class AuthService {
  /**
   * Iniciar sesión
   */
  static async login(email, password, recordarSesion = false) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });

      if (response.data.success) {
        const { token, usuario } = response.data;

        // Guardar token y datos del usuario
        if (recordarSesion) {
          // Si marca "recordar", guardar en localStorage (persiste al cerrar navegador)
          localStorage.setItem('token', token);
          localStorage.setItem('usuario', JSON.stringify(usuario));
        } else {
          // Si no marca "recordar", guardar en sessionStorage (se borra al cerrar navegador)
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('usuario', JSON.stringify(usuario));
        }

        return { success: true, usuario };
      }

      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Error en login:', error);
      
      if (error.response) {
        return {
          success: false,
          message: error.response.data.message || 'Error al iniciar sesión'
        };
      }

      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  }

  /**
   * Cerrar sesión
   */
  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
  }

  /**
   * Obtener token actual
   */
  static getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  /**
   * Obtener usuario actual
   */
  static getUsuario() {
    const usuarioStr = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  }

  /**
   * Verificar si el usuario está autenticado
   */
  static isAuthenticated() {
    const token = this.getToken();
    
    if (!token) {
      return false;
    }

    try {
      // Decodificar token para verificar expiración
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // Verificar si el token expiró
      if (decoded.exp < currentTime) {
        this.logout(); // Token expirado, cerrar sesión
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error al verificar token:', error);
      this.logout();
      return false;
    }
  }

  /**
   * Verificar si el usuario es admin
   */
  static isAdmin() {
    const usuario = this.getUsuario();
    return usuario && usuario.rol === 'admin';
  }

  /**
   * Verificar token en el servidor
   */
  static async verificarToken() {
    try {
      const token = this.getToken();
      
      if (!token) {
        return false;
      }

      const response = await axios.get(`${API_URL}/verificar`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data.success;
    } catch (error) {
      console.error('Error al verificar token:', error);
      this.logout();
      return false;
    }
  }
}

export default AuthService;