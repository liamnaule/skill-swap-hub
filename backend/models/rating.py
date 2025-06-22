from datetime import datetime
from backend.models import db

class Rating(db.Model):
    __tablename__ = "ratings"

    rating_id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.session_id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Rating {self.rating} for Session {self.session_id}>'