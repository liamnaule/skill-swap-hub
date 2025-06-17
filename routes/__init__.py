from flask import Blueprint
from .user import user_bp
from .skill import skill_bp
from .session import session_bp
from .rating import rating_bp

api_bp = Blueprint("api", __name__)

api_bp.register_blueprint(user_bp, url_prefix="/api")
api_bp.register_blueprint(skill_bp, url_prefix="/api")
api_bp.register_blueprint(session_bp, url_prefix="/api")
api_bp.register_blueprint(rating_bp, url_prefix="/api")
