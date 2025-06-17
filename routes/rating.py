from flask import Blueprint, jsonify
from models import db, Rating

rating_bp = Blueprint("rating_bp", __name__)

@rating_bp.route("/ratings", methods=["GET"])
def get_ratings():
    ratings = Rating.query.all()
    return jsonify([{
        "id": r.rating_id,
        "session_id": r.session_id,
        "rating": r.rating,
        "created_at": r.created_at
    } for r in ratings]), 200


