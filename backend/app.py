import os
import sys
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask
from flask_migrate import Migrate
from flask_mail import Mail
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
from backend.models import db, TokenBlocklist  
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configurations
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(basedir, 'instance', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_USERNAME', 'liamnaule@gmail.com')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=2)
app.config['JWT_VERIFY_SUB'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')

# Load CORS origins from environment variable
CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'https://skill-swap-hub-frontend.vercel.app/,http://localhost:5173/').split(',')

# CORS configuration
CORS(
    app,
    resources={r"/*": {"origins": CORS_ORIGINS}},
    supports_credentials=True
)

# Extensions
db.init_app(app)
migrate = Migrate(app, db)
mail = Mail(app)
jwt = JWTManager(app)


# Blueprints
from backend.routes.auth import auth_bp
from backend.routes.user import user_bp
from backend.routes.skill import skill_bp
from backend.routes.session import session_bp
from backend.routes.rating import rating_bp
from backend.routes.report import report_bp

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(user_bp, url_prefix="/users")
app.register_blueprint(skill_bp, url_prefix="/skills")
app.register_blueprint(session_bp, url_prefix="/sessions")
app.register_blueprint(rating_bp, url_prefix="/ratings")
app.register_blueprint(report_bp, url_prefix="/reports")

# Root route
@app.route("/")
def index():
    return "Welcome to the Skill Swap Hub API!"

# JWT Blocklist
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar() is not None

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)