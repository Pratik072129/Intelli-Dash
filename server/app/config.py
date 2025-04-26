import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    # Flask settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = os.getenv('FLASK_DEBUG', '1') == '1'
    
    # Database settings
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT settings
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'default-jwt-secret')
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    
    # File upload settings
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'uploads')
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 16777216))  # 16MB
    
    # CORS settings
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
    
    # Create upload folder if it doesn't exist
    @staticmethod
    def init_app(app):
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # OpenAI settings
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    
    # ML Model settings
    ML_MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'ml', 'model.pkl')
    
    # PDF Generation settings
    PDF_TEMPLATE_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'templates')
    PDF_OUTPUT_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'reports')

class DevelopmentConfig(Config):
    DEBUG = True
    TESTING = False

class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///test.db'

class ProductionConfig(Config):
    DEBUG = False
    TESTING = False

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
} 