import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

class DatabaseConfig:
    """Clase para manejar la configuración y conexión a la base de datos"""
    
    def __init__(self):
        self.host = os.getenv('DB_HOST', 'localhost')
        self.port = os.getenv('DB_PORT', '3306')
        self.user = os.getenv('DB_USER', 'root')
        self.password = os.getenv('DB_PASSWORD', '')
        self.database = os.getenv('DB_NAME', 'lavadero_db')
        self.connection = None
    
    def conectar(self):
        """Establece la conexión con la base de datos"""
        try:
            if self.connection is None or not self.connection.is_connected():
                self.connection = mysql.connector.connect(
                    host=self.host,
                    port=self.port,
                    user=self.user,
                    password=self.password,
                    database=self.database,
                    charset='utf8mb4',
                    collation='utf8mb4_general_ci'
                )
                print(f"✅ Conexión exitosa a la base de datos: {self.database}")
            return self.connection
        except Error as e:
            print(f"❌ Error al conectar a la base de datos: {e}")
            return None
    
    def desconectar(self):
        """Cierra la conexión con la base de datos"""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("✅ Conexión cerrada")
    
    def ejecutar_query(self, query, params=None, fetch=True):
        """
        Ejecuta una query SQL
        
        Args:
            query (str): Query SQL a ejecutar
            params (tuple): Parámetros de la query
            fetch (bool): Si True, retorna resultados. Si False, hace commit
        
        Returns:
            list: Resultados de la query (si fetch=True)
            int: Filas afectadas (si fetch=False)
        """
        try:
            connection = self.conectar()
            if connection:
                cursor = connection.cursor(dictionary=True)
                cursor.execute(query, params or ())
                
                if fetch:
                    resultados = cursor.fetchall()
                    cursor.close()
                    return resultados
                else:
                    connection.commit()
                    filas_afectadas = cursor.rowcount
                    cursor.close()
                    return filas_afectadas
        except Error as e:
            print(f"❌ Error al ejecutar query: {e}")
            return [] if fetch else 0
        finally:
            # No cerramos la conexión aquí para reutilizarla
            pass

# Instancia global de la configuración
db_config = DatabaseConfig()