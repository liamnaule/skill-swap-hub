from models import db
from datetime import datetime

class Rating(db.Model):
    __tablename__ = 'ratings'

    rating_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.session_id'), nullable=False)
    rating = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Rating {self.rating_id}>'