from flask import Flask, jsonify, request
from flask_cors import CORS
from db_config import db_config
import os
from dotenv import load_dotenv
from auth import generar_token, verificar_password, token_requerido, admin_requerido

# Cargar variables de entorno
load_dotenv()

# Crear aplicación Flask
app = Flask(__name__)

# Configurar CORS (permite que React se conecte)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],  # ← AGREGAR Authorization
        "expose_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# ==================== RUTAS DE LA API ====================

@app.route('/')
def home():
    """Ruta de inicio - verificar que el API funciona"""
    return jsonify({
        'message': '🚗 Clean Car API',
        'version': '1.0',
        'status': 'running'
    })

@app.route('/api/health')
def health_check():
    """Verificar estado de la conexión a la base de datos"""
    try:
        connection = db_config.conectar()
        if connection and connection.is_connected():
            return jsonify({
                'status': 'healthy',
                'database': 'connected',
                'message': '✅ Base de datos conectada'
            }), 200
        else:
            return jsonify({
                'status': 'unhealthy',
                'database': 'disconnected',
                'message': '❌ No se pudo conectar a la base de datos'
            }), 500
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/servicios')
def obtener_servicios():
    """
    Obtener todos los servicios con sus precios
    
    Returns:
        JSON con lista de servicios agrupados por tipo de vehículo
    """
    try:
        query = """
            SELECT 
                s.id as servicio_id,
                s.nombre as servicio_nombre,
                s.descripcion,
                sp.tipo_vehiculo,
                CASE sp.tipo_vehiculo
                    WHEN 'motorcycle' THEN 'Motocicleta'
                    WHEN 'car' THEN 'Automóvil'
                    WHEN 'pickup' THEN 'Camioneta'
                    WHEN 'truck' THEN 'Camión'
                    ELSE sp.tipo_vehiculo
                END as vehiculo_nombre,
                sp.precio,
                sp.activo
            FROM servicios s
            INNER JOIN servicio_precios sp ON s.id = sp.id_servicio
            WHERE sp.activo = 1
            ORDER BY s.id ASC, sp.precio ASC
        """
        
        resultados = db_config.ejecutar_query(query)
        
        # Agrupar servicios por tipo de vehículo
        servicios_por_vehiculo = {}
        
        for row in resultados:
            vehiculo = row['tipo_vehiculo']
            
            if vehiculo not in servicios_por_vehiculo:
                servicios_por_vehiculo[vehiculo] = {
                    'tipo': vehiculo,
                    'nombre': row['vehiculo_nombre'],
                    'servicios': []
                }
            
            servicios_por_vehiculo[vehiculo]['servicios'].append({
                'id': row['servicio_id'],
                'nombre': row['servicio_nombre'],
                'descripcion': row['descripcion'],
                'precio': float(row['precio']),
                'precio_formato': f"${int(row['precio']):,}".replace(',', '.')
            })
        
        return jsonify({
            'success': True,
            'data': list(servicios_por_vehiculo.values()),
            'total': len(resultados)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error al obtener servicios'
        }), 500

@app.route('/api/servicios/<tipo_vehiculo>')
def obtener_servicios_por_vehiculo(tipo_vehiculo):
    """
    Obtener servicios filtrados por tipo de vehículo
    
    Args:
        tipo_vehiculo: motorcycle, car, pickup, truck
    
    Returns:
        JSON con lista de servicios para ese tipo de vehículo
    """
    try:
        # Validar tipo de vehículo
        tipos_validos = ['motorcycle', 'car', 'pickup', 'truck']
        if tipo_vehiculo not in tipos_validos:
            return jsonify({
                'success': False,
                'error': 'Tipo de vehículo no válido',
                'tipos_validos': tipos_validos
            }), 400
        
        query = """
            SELECT 
                s.id,
                s.nombre,
                s.descripcion,
                sp.precio,
                sp.tipo_vehiculo
            FROM servicios s
            INNER JOIN servicio_precios sp ON s.id = sp.id_servicio
            WHERE sp.tipo_vehiculo = %s
            AND sp.activo = 1
            ORDER BY sp.precio ASC
        """
        
        resultados = db_config.ejecutar_query(query, (tipo_vehiculo,))
        
        servicios = []
        for row in resultados:
            servicios.append({
                'id': row['id'],
                'nombre': row['nombre'],
                'descripcion': row['descripcion'],
                'precio': float(row['precio']),
                'precio_formato': f"${int(row['precio']):,}".replace(',', '.'),
                'tipo_vehiculo': row['tipo_vehiculo']
            })
        
        return jsonify({
            'success': True,
            'tipo_vehiculo': tipo_vehiculo,
            'data': servicios,
            'total': len(servicios)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/tipos-vehiculo')
def obtener_tipos_vehiculo():
    """Obtener lista de tipos de vehículos disponibles"""
    tipos = [
        {'id': 'motorcycle', 'nombre': 'Motocicleta', 'icono': '🏍️'},
        {'id': 'car', 'nombre': 'Automóvil', 'icono': '🚗'},
        {'id': 'pickup', 'nombre': 'Camioneta', 'icono': '🚙'},
        {'id': 'truck', 'nombre': 'Camión', 'icono': '🚚'}
    ]
    
    return jsonify({
        'success': True,
        'data': tipos
    }), 200

# ==================== RUTAS DE AUTENTICACIÓN ====================

@app.route('/api/auth/login', methods=['POST'])
def login():
    """
    Endpoint para iniciar sesión
    
    Body JSON:
    {
        "email": "admin@gmail.com",
        "password": "contraseña"
    }
    
    Returns:
        Token JWT y datos del usuario
    """
    try:
        datos = request.get_json()
        
        if not datos:
            return jsonify({
                'success': False,
                'message': 'No se proporcionaron datos'
            }), 400
        
        email = datos.get('email', '').strip()
        password = datos.get('password', '')
        
        # Validar que se proporcionaron email y contraseña
        if not email or not password:
            return jsonify({
                'success': False,
                'message': 'Email y contraseña son requeridos'
            }), 400
        
        # Buscar usuario en la base de datos
        query = """
            SELECT id, nombre, email, password, rol, activo
            FROM usuarios
            WHERE email = %s AND activo = 1
        """
        
        resultados = db_config.ejecutar_query(query, (email,))
        
        if not resultados or len(resultados) == 0:
            return jsonify({
                'success': False,
                'message': 'Credenciales incorrectas'
            }), 401
        
        usuario = resultados[0]
        
        # Verificar contraseña
        password_hash = usuario['password']
        
        if not verificar_password(password, password_hash):
            return jsonify({
                'success': False,
                'message': 'Credenciales incorrectas'
            }), 401
        
        # Generar token
        token = generar_token(
            usuario_id=usuario['id'],
            email=usuario['email'],
            rol=usuario['rol']
        )
        
        # Retornar token y datos del usuario
        return jsonify({
            'success': True,
            'message': 'Login exitoso',
            'token': token,
            'usuario': {
                'id': usuario['id'],
                'nombre': usuario['nombre'],
                'email': usuario['email'],
                'rol': usuario['rol']
            }
        }), 200
        
    except Exception as e:
        print(f"Error en login: {e}")
        return jsonify({
            'success': False,
            'message': 'Error al procesar login',
            'error': str(e)
        }), 500

@app.route('/api/auth/verificar', methods=['GET'])
@token_requerido
def verificar_sesion(datos_usuario):
    """
    Endpoint para verificar si el token es válido
    Protegido con @token_requerido
    """
    return jsonify({
        'success': True,
        'message': 'Token válido',
        'usuario': {
            'id': datos_usuario['usuario_id'],
            'email': datos_usuario['email'],
            'rol': datos_usuario['rol']
        }
    }), 200

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """
    Endpoint para cerrar sesión
    En JWT, el logout se maneja en el frontend eliminando el token
    """
    return jsonify({
        'success': True,
        'message': 'Sesión cerrada exitosamente'
    }), 200

# ==================== RUTAS PROTEGIDAS (ADMIN) ====================

@app.route('/api/admin/dashboard/stats', methods=['GET'])
@admin_requerido
def obtener_estadisticas_dashboard(datos_usuario):
    """
    Obtener estadísticas para el dashboard del admin
    Solo accesible por usuarios con rol 'admin'
    """
    try:
        # Obtener parámetros de filtro (año y mes)
        anio = request.args.get('anio')
        mes = request.args.get('mes')
        
        # Construir condición de fecha
        condicion_fecha = ""
        params = []
        
        if anio and mes:
            condicion_fecha = "WHERE YEAR(fecha) = %s AND MONTH(fecha) = %s"
            params = [anio, mes]
        elif anio:
            condicion_fecha = "WHERE YEAR(fecha) = %s"
            params = [anio]
        
        # Query para obtener estadísticas
        query = f"""
            SELECT 
                COUNT(*) as total_servicios,
                COALESCE(SUM(costo), 0) as ingresos_totales,
                COALESCE(AVG(costo), 0) as promedio_servicio,
                COALESCE(SUM(costo * porcentaje / 100), 0) as comisiones_totales,
                COALESCE(SUM(costo * (100 - porcentaje) / 100), 0) as ganancia_neta
            FROM registros
            {condicion_fecha}
        """
        
        resultados = db_config.ejecutar_query(query, tuple(params) if params else None)
        
        if resultados:
            stats = resultados[0]
        else:
            stats = {
                'total_servicios': 0,
                'ingresos_totales': 0,
                'promedio_servicio': 0,
                'comisiones_totales': 0,
                'ganancia_neta': 0
            }
        
        # Servicios de hoy
        query_hoy = """
            SELECT COUNT(*) as servicios_hoy
            FROM registros
            WHERE fecha = CURDATE()
        """
        
        resultado_hoy = db_config.ejecutar_query(query_hoy)
        servicios_hoy = resultado_hoy[0]['servicios_hoy'] if resultado_hoy else 0
        
        return jsonify({
            'success': True,
            'data': {
                'ingresos_totales': float(stats['ingresos_totales']),
                'servicios_realizados': int(stats['total_servicios']),
                'promedio_servicio': float(stats['promedio_servicio']),
                'comisiones_pagadas': float(stats['comisiones_totales']),
                'ganancia_neta': float(stats['ganancia_neta']),
                'servicios_hoy': int(servicios_hoy)
            }
        }), 200
        
    except Exception as e:
        print(f"Error al obtener estadísticas: {e}")
        return jsonify({
            'success': False,
            'message': 'Error al obtener estadísticas',
            'error': str(e)
        }), 500
    
# ==================== MANEJO DE ERRORES ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Ruta no encontrada',
        'message': 'La ruta solicitada no existe'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Error interno del servidor',
        'message': str(error)
    }), 500

# ==================== INICIAR SERVIDOR ====================

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True') == 'True'
    
    print("=" * 50)
    print("🚗 Clean Car API - Starting...")
    print(f"📍 Running on: http://localhost:{port}")
    print(f"🔧 Debug mode: {debug}")
    print("=" * 50)
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )

