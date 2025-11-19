# 🚗 Clean Car - Sistema Web

Sistema web informativo para Clean Car - Lavadero Profesional de Vehículos

## 🌟 Características

- ✨ Diseño moderno y responsive
- 🚙 Gestión dinámica de servicios por tipo de vehículo
- 📸 Galería de trabajos con lightbox
- 📞 Información de contacto y ubicación
- 🔐 Panel de administración
- 💾 Conexión con base de datos MySQL

## 🛠️ Tecnologías

### Frontend
- React 19.2.0
- React Router DOM
- Bootstrap 5.3
- Axios
- Font Awesome

### Backend
- Flask (Python)
- MySQL
- JWT Authentication
- bcrypt

## 📁 Estructura del Proyecto
```
lavadero-web/
├── clean-car-web/          # Frontend (React)
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── utils/          # Utilidades y servicios
│   │   └── assets/         # Imágenes y recursos
│   └── package.json
│
└── clean-car-api/          # Backend (Flask)
    ├── app.py              # Aplicación principal
    ├── auth.py             # Autenticación
    ├── db_config.py        # Configuración BD
    └── requirements.txt
```

## 🚀 Instalación

### Frontend (React)
```bash
cd clean-car-web
npm install
npm start
```

El frontend corre en: `http://localhost:3000`

### Backend (Flask)
```bash
cd clean-car-api
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
python app.py
```

El backend corre en: `http://localhost:5000`

### Base de Datos

1. Importar `database/lavadero_db.sql` en MySQL
2. Configurar credenciales en `.env`

## 🔧 Configuración

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=lavadero_db
JWT_SECRET_KEY=tu_clave_secreta
```

## 📱 Páginas

- **Inicio**: Hero section, características y about
- **Servicios**: Filtros por vehículo, galería de fotos
- **Admin**: Dashboard y gestión de servicios

## 🔐 Acceso Admin

URL: `http://localhost:3000/admin/login`

O presiona: `Ctrl + Shift + A` desde cualquier página

## 👥 Autores

- **Yancarlos Campo** - Desarrollo
- **Victorius** - Arquitectura y documentación 

## 📄 Licencia

Este proyecto es privado y pertenece a QuiliSoft.

## 📞 Contacto

- **Teléfono**: +57 312.....
- **Email**: info@cleancar.com
- **Ubicación**: Santander de Quilichao, Cauca, Colombia

---

Desarrollado con ❤️ por el equipo de Clean Car