from flask import Blueprint, jsonify, request
from backend.models import db
from backend.models.session import Session
from flask_jwt_extended import jwt_required

session_bp = Blueprint("session_bp", __name__)

@session_bp.route("/", methods=["GET"])
@jwt_required()
def get_sessions():
    sessions = Session.query.all()
    return jsonify([{
        "id": s.session_id,
        "skill_id": s.skill_id,
        "teacher_id": s.teacher_id,
        "learner_id": s.learner_id,
        "scheduled_at": s.scheduled_at,
        "created_at": s.created_at
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

    session = Session(
        skill_id=skill_id,
        teacher_id=teacher_id,
        learner_id=learner_id,
        scheduled_at=scheduled_at
    )
    db.session.add(session)
    db.session.commit()
    return jsonify({"success": "Session created", "id": session.session_id}), 201



