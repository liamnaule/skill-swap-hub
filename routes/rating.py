from flask import Blueprint, jsonify, request
from models import db, Rating
from flask_jwt_extended import jwt_required

rating_bp = Blueprint("rating_bp", __name__)

@rating_bp.route("/", methods=["GET"])
@jwt_required()
def get_ratings():
    ratings = Rating.query.all()
    return jsonify([{
        "id": r.rating_id,
        "session_id": r.session_id,
        "rating": r.rating,
        "created_at": r.created_at
    } for r in ratings]), 200

@rating_bp.route("/", methods=["POST"])
@jwt_required()
def create_rating():
    data = request.get_json()
    session_id = data.get("session_id")
    rating = data.get("rating")

    if not session_id or rating is None:
        return jsonify({"error": "session_id and rating are required"}), 400

    rating_obj = Rating(
        session_id=session_id,
        rating=rating
    )
    db.session.add(rating_obj)
    db.session.commit()
    return jsonify({"success": "Rating created", "id": rating_obj.rating_id}), 201