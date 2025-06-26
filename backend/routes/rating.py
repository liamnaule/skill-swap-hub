from flask import Blueprint, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models import db, Rating, Session
from datetime import datetime
import os

rating_bp = Blueprint("rating_bp", __name__)

@rating_bp.route("/", methods=["POST"])
@jwt_required()
def create_rating():
    user_id = get_jwt_identity()
    data = request.get_json()
    session_id = data.get("session_id")
    rating_value = data.get("rating")

    if not session_id or not rating_value:
        return jsonify({"error": "Session ID and rating are required"}), 400

    try:
        rating_value = int(rating_value)
        if rating_value < 1 or rating_value > 5:
            return jsonify({"error": "Rating must be between 1 and 5"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Rating must be an integer"}), 400

    session = Session.query.get(session_id)
    if not session:
        return jsonify({"error": "Session not found"}), 404

    if session.learner_id != user_id:
        return jsonify({"error": "Only the learner can rate this session"}), 403

    if session.scheduled_at > datetime.utcnow():
        return jsonify({"error": "Cannot rate future sessions"}), 400

    existing_rating = Rating.query.filter_by(session_id=session_id, user_id=user_id).first()
    if existing_rating:
        return jsonify({"error": "Session already rated by this user"}), 400

    rating = Rating(
        session_id=session_id,
        user_id=user_id,
        rating=rating_value,
        created_at=datetime.utcnow()
    )
    db.session.add(rating)
    db.session.commit()

    return jsonify({
        "success": "Rating created",
        "session": {
            "id": session.session_id,
            "skill_id": session.skill_id,
            "teacher_id": session.teacher_id,
            "learner_id": session.learner_id,
            "scheduled_at": session.scheduled_at.isoformat(),
            "created_at": session.created_at.isoformat(),
            "rating": rating_value
        }
    }), 201

@rating_bp.route("/<int:session_id>", methods=["PATCH"])
@jwt_required()
def update_rating(session_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    rating_value = data.get("rating")

    if not rating_value:
        return jsonify({"error": "Rating is required"}), 400

    try:
        rating_value = int(rating_value)
        if rating_value < 1 or rating_value > 5:
            return jsonify({"error": "Rating must be between 1 and 5"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Rating must be an integer"}), 400

    session = Session.query.get(session_id)
    if not session:
        return jsonify({"error": "Session not found"}), 404

    if session.learner_id != user_id:
        return jsonify({"error": "Only the learner can rate this session"}), 403

    if session.scheduled_at > datetime.utcnow():
        return jsonify({"error": "Cannot rate future sessions"}), 400

    rating = Rating.query.filter_by(session_id=session_id, user_id=user_id).first()
    if not rating:
        return jsonify({"error": "Rating not found for this session"}), 404

    rating.rating = rating_value
    rating.created_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "success": "Rating updated",
        "session": {
            "id": session.session_id,
            "skill_id": session.skill_id,
            "teacher_id": session.teacher_id,
            "learner_id": session.learner_id,
            "scheduled_at": session.scheduled_at.isoformat(),
            "created_at": session.created_at.isoformat(),
            "rating": rating_value
        }
    }), 200