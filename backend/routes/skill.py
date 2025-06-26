from flask import Blueprint, jsonify, request
from backend.models import db
from backend.models.skill import Skill
from flask_jwt_extended import jwt_required, get_jwt_identity
from .user import is_admin  

skill_bp = Blueprint("skill_bp", __name__)

@skill_bp.route("/", methods=["GET"])
@jwt_required()
def get_skills():
    skills = Skill.query.all()
    return jsonify([{
        "id": skill.skill_id,
        "skill_id": skill.skill_id,
        "user_id": skill.user_id,
        "title": skill.title,
        "is_offered": skill.is_offered,
        "is_approved": skill.is_approved,
        "created_at": skill.created_at.isoformat()
    } for skill in skills]), 200

@skill_bp.route("/", methods=["POST"])
@jwt_required()
def create_skill():
    data = request.get_json()
    user_id = data.get("user_id")
    title = data.get("title")
    is_offered = data.get("is_offered", True)
    is_approved = data.get("is_approved", False)

    if not user_id or not title:
        return jsonify({"error": "user_id and title are required"}), 400

    skill = Skill(
        user_id=user_id,
        title=title,
        is_offered=is_offered,
        is_approved=is_approved
    )
    db.session.add(skill)
    db.session.commit()
    return jsonify({"success": "Skill created", "id": skill.skill_id}), 201

@skill_bp.route("/<int:skill_id>", methods=["PATCH"])
@jwt_required()
def update_skill(skill_id):
    if not is_admin():
        return jsonify({"error": "Admin privileges required"}), 403

    skill = Skill.query.get(skill_id)
    if not skill:
        return jsonify({"error": "Skill not found"}), 404

    data = request.get_json()
    skill.is_approved = data.get("is_approved", skill.is_approved)

    db.session.commit()
    return jsonify({"success": "Skill updated"}), 200