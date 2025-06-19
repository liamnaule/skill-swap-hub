from flask import Blueprint, jsonify
from models import db, Skill
from flask_jwt_extended import jwt_required

skill_bp = Blueprint("skill_bp", __name__)

@skill_bp.route("/skills", methods=["GET"])
@jwt_required()
def get_skills():
    skills = Skill.query.all()
    return jsonify([{
        "id": skill.skill_id,
        "title": skill.title,
        "is_offered": skill.is_offered,
        "is_approved": skill.is_approved,
        "created_at": skill.created_at
    } for skill in skills]), 200


