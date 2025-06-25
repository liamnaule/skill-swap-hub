from datetime import datetime
from backend.models import db

class Report(db.Model):
    __tablename__ = "reports"

    id = db.Column(db.Integer, primary_key=True)
    reporter_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    reported_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    reported_skill_id = db.Column(db.Integer, db.ForeignKey('skills.skill_id'), nullable=True)
    reason = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    reporter = db.relationship('User', foreign_keys=[reporter_id])
    reported_user = db.relationship('User', foreign_keys=[reported_user_id])
    reported_skill = db.relationship('Skill', foreign_keys=[reported_skill_id])

    def __repr__(self):
        return f'<Report {self.id}>'