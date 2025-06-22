from datetime import datetime
from backend.models import db

class Session(db.Model):
    __tablename__ = "sessions"

    session_id = db.Column(db.Integer, primary_key=True)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.skill_id'), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    learner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    scheduled_at = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    skill = db.relationship('Skill', back_populates='sessions')
    teacher = db.relationship('User', foreign_keys=[teacher_id], back_populates='taught_sessions')
    learner = db.relationship('User', foreign_keys=[learner_id], back_populates='learned_sessions')

    def __repr__(self):
        return f'<Session {self.session_id}>'