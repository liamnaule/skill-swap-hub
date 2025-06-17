from app import db
from datetime import datetime

class Skill(db.Model):
    __tablename__ = 'skills'

    skill_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    is_offered = db.Column(db.Boolean, nullable=False)
    is_approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship
    sessions = db.relationship('Session', backref='skill', lazy='dynamic')

    def __repr__(self):
        return f'<Skill {self.title}>'