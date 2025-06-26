from flask import Blueprint, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models import db, Session, Rating
from datetime import datetime
import os

session_bp = Blueprint("session_bp", __name__)

@session_bp.route("/", methods=["GET"])
@jwt_required()
def get_sessions():
    user_id = get_jwt_identity()
    sessions = Session.query.filter((Session.teacher_id == user_id) | (Session.learner_id == user_id)).all()
    result = []
    for session in sessions:
        rating = Rating.query.filter_by(session_id=session.session_id, user_id=user_id).first()
        result.append({
            "id": session.session_id,
            "skill_id": session.skill_id,
            "teacher_id": session.teacher_id,
            "learner_id": session.learner_id,
            "scheduled_at": session.scheduled_at.isoformat(),
            "created_at": session.created_at.isoformat(),
            "rating": rating.rating if rating else None
        })
    return jsonify(result), 200

@session_bp.route("/", methods=["POST"])
@jwt_required()
def create_session():
    user_id = get_jwt_identity()
    data = request.get_json()
    skill_id = data.get("skill_id")
    teacher_id = data.get("teacher_id")
    learner_id = data.get("learner_id")
    scheduled_at = data.get("scheduled_at")

    if not all([skill_id, teacher_id, learner_id, scheduled_at]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        scheduled_at = datetime.fromisoformat(scheduled_at.replace("Z", "+00:00"))
    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400

    if learner_id != user_id:
        return jsonify({"error": "Only the learner can create a session"}), 403

    session = Session(
        skill_id=skill_id,
        teacher_id=teacher_id,
        learner_id=learner_id,
        scheduled_at=scheduled_at,
        created_at=datetime.utcnow()
    )
    db.session.add(session)
    db.session.commit()

    return jsonify({
        "success": "Session created",
        "session": {
            "id": session.session_id,
            "skill_id": session.skill_id,
            "teacher_id": session.teacher_id,
            "learner_id": session.learner_id,
            "scheduled_at": session.scheduled_at.isoformat(),
            "created_at": session.created_at.isoformat(),
            "rating": None
        }
    }), 201