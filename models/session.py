from models import db
from datetime import datetime

class Session(db.Model):
    __tablename__ = 'sessions'

    session_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.skill_id'), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    learner_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    scheduled_at = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship
    ratings = db.relationship('Rating', backref='session', lazy='dynamic')

    def __repr__(self):
        return f'<Session {self.session_id}>'