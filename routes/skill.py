from flask import Blueprint, jsonify, request
from models import db, Skill
from flask_jwt_extended import jwt_required

skill_bp = Blueprint("skill_bp", __name__)

@skill_bp.route("/", methods=["GET"])
@jwt_required()
def get_skills():
    skills = Skill.query.all()
    return jsonify([{
        "id": skill.skill_id,
        "user_id": skill.user_id,
        "title": skill.title,
        "is_offered": skill.is_offered,
        "is_approved": skill.is_approved,
        "created_at": skill.created_at
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