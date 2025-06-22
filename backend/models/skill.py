from datetime import datetime
from backend.models import db

class Skill(db.Model):
    __tablename__ = "skills"

    skill_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    is_offered = db.Column(db.Boolean, default=True)
    is_approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship to Session
    sessions = db.relationship('Session', back_populates='skill', lazy=True)

    def __repr__(self):
        return f'<Skill {self.title}>'