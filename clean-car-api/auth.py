import jwt
import bcrypt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify
import os
from dotenv import load_dotenv

load_dotenv()

# Clave secreta para JWT (cámbiala por una más segura en producción)
SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'clean-car-secret-key-2025')

def generar_token(usuario_id, email, rol):
    """
    Genera un token JWT para el usuario
    
    Args:
        usuario_id: ID del usuario
        email: Email del usuario
        rol: Rol del usuario (admin/secretario)
    
    Returns:
        Token JWT como string
    """
    payload = {
        'usuario_id': usuario_id,
        'email': email,
        'rol': rol,
        'exp': datetime.utcnow() + timedelta(hours=24),  # Expira en 24 horas
        'iat': datetime.utcnow()
    }
    
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

def verificar_token(token):
    """
    Verifica si un token JWT es válido
    
    Args:
        token: Token JWT a verificar
    
    Returns:
        dict: Datos del usuario si es válido, None si no
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def verificar_password(password_plano, password_hash):
    """
    Verifica si una contraseña coincide con su hash
    
    Args:
        password_plano: Contraseña en texto plano
        password_hash: Hash de la contraseña en la BD
    
    Returns:
        bool: True si coincide, False si no
    """
    # Convertir a bytes si es string
    if isinstance(password_plano, str):
        password_plano = password_plano.encode('utf-8')
    if isinstance(password_hash, str):
        password_hash = password_hash.encode('utf-8')
    
    return bcrypt.checkpw(password_plano, password_hash)

def token_requerido(f):
    """
    Decorador para proteger rutas que requieren autenticación
    """
    @wraps(f)
    def decorador(*args, **kwargs):
        token = None
        
        # Obtener token del header Authorization
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]  # Bearer <token>
            except IndexError:
                return jsonify({
                    'success': False,
                    'message': 'Token mal formado'
                }), 401
        
        if not token:
            return jsonify({
                'success': False,
                'message': 'Token no proporcionado'
            }), 401
        
        # Verificar token
        datos_usuario = verificar_token(token)
        
        if not datos_usuario:
            return jsonify({
                'success': False,
                'message': 'Token inválido o expirado'
            }), 401
        
        # Pasar los datos del usuario a la función
        return f(datos_usuario, *args, **kwargs)
    
    return decorador

def admin_requerido(f):
    """
    Decorador para proteger rutas que requieren rol de administrador
    """
    @wraps(f)
    def decorador(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]
            except IndexError:
                return jsonify({
                    'success': False,
                    'message': 'Token mal formado'
                }), 401
        
        if not token:
            return jsonify({
                'success': False,
                'message': 'Token no proporcionado'
            }), 401
        
        datos_usuario = verificar_token(token)
        
        if not datos_usuario:
            return jsonify({
                'success': False,
                'message': 'Token inválido o expirado'
            }), 401
        
        # Verificar que sea admin
        if datos_usuario.get('rol') != 'admin':
            return jsonify({
                'success': False,
                'message': 'Acceso denegado. Se requiere rol de administrador'
            }), 403
        
        return f(datos_usuario, *args, **kwargs)
    
    return decorador