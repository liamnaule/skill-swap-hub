# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    
    # Basic configuration 
    app.config['SECRET_KEY'] = '2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p'  
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///skill_hub.db' 
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)


    return app
