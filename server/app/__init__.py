from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .config import Config
import os

# Initialize extensions
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions with app
    jwt.init_app(app)
    CORS(app, 
         resources={r"/*": {
             "origins": app.config['CORS_ORIGINS'],
             "supports_credentials": True,
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
             "expose_headers": ["Content-Type", "Authorization"]
         }})
    
    # Initialize app
    config_class.init_app(app)
    
    # Register blueprints
    from .routes import auth_routes, upload_routes, report_routes
    
    app.register_blueprint(auth_routes.bp)
    app.register_blueprint(upload_routes.bp)
    app.register_blueprint(report_routes.bp)
    
    return app 