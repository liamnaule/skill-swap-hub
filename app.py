from flask import Flask 
from flask_migrate import Migrate
from flask_mail import Mail
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
from models import db, TokenBlocklist

# Create Flask app
app = Flask(__name__)

# Configs
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'liam@gmail.com'
app.config['MAIL_PASSWORD'] = 'rert vgfd fesf'
app.config['MAIL_DEFAULT_SENDER'] = 'liam@gmail.com'
app.config['JWT_SECRET_KEY'] = 'sjusefvyilgfvksbhvfiknhalvufn'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=2)
app.config['JWT_VERIFY_SUB'] = False

# Extensions
db.init_app(app)
migrate = Migrate(app, db)
mail = Mail(app)
jwt = JWTManager(app)
CORS(app)

# Blueprints
from routes.auth import auth_bp
from routes.user import user_bp
from routes.skill import skill_bp
from routes.session import session_bp
from routes.rating import rating_bp

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(user_bp, url_prefix="/users")
app.register_blueprint(skill_bp, url_prefix="/skills")
app.register_blueprint(session_bp, url_prefix="/sessions")
app.register_blueprint(rating_bp, url_prefix="/ratings")

# JWT Blocklist
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar() is not None

if __name__ == "__main__":
    app.run(debug=True)


