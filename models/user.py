from datetime import datetime
from werkzeug.security import generate_password_hash
from models import db  # back to absolute import


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    is_blocked = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    taught_sessions = db.relationship(
        'Session',
        foreign_keys='Session.teacher_id',
        back_populates='teacher',
        lazy='dynamic'
    )
    learned_sessions = db.relationship(
        'Session',
        foreign_keys='Session.learner_id',
        back_populates='learner',
        lazy='dynamic'
    )
    skills = db.relationship('Skill', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'


class TokenBlocklist(db.Model):
    __tablename__ = "token_blocklist"

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
