from flask import Blueprint, jsonify, request
from backend.models import db
from backend.models.session import Session
from backend.models.rating import Rating
from flask_jwt_extended import jwt_required
from datetime import datetime
from dateutil.parser import parse as parse_datetime

session_bp = Blueprint("session_bp", __name__)

@session_bp.route("/", methods=["GET"])
@jwt_required()
def get_sessions():
    sessions = Session.query.all()
    # Fetch ratings for all sessions in one go for efficiency
    ratings = {r.session_id: r.rating for r in Rating.query.all()}
    return jsonify([{
        "id": s.session_id,
        "skill_id": s.skill_id,
        "teacher_id": s.teacher_id,
        "learner_id": s.learner_id,
        "scheduled_at": s.scheduled_at,
        "created_at": s.created_at,
        "rating": ratings.get(s.session_id)  # Add rating here
    } for s in sessions]), 200

@session_bp.route("/", methods=["POST"])
@jwt_required()
def create_session():
    data = request.get_json()
    skill_id = data.get("skill_id")
    teacher_id = data.get("teacher_id")
    learner_id = data.get("learner_id")
    scheduled_at = data.get("scheduled_at")

    if not all([skill_id, teacher_id, learner_id, scheduled_at]):
        return jsonify({"error": "All fields are required"}), 400

    try:
        scheduled_at_dt = parse_datetime(scheduled_at)
    except Exception:
        return jsonify({"error": "Invalid date format for scheduled_at"}), 400

    session = Session(
        skill_id=skill_id,
        teacher_id=teacher_id,
        learner_id=learner_id,
        scheduled_at=scheduled_at_dt,
        created_at=datetime.utcnow()
    )
    db.session.add(session)
    db.session.commit()
    return jsonify({"success": "Session created", "id": session.session_id}), 201



