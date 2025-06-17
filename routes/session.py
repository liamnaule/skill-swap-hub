from flask import Blueprint, jsonify
from models import db, Session

session_bp = Blueprint("session_bp", __name__)

@session_bp.route("/sessions", methods=["GET"])
def get_sessions():
    sessions = Session.query.all()
    return jsonify([{
        "id": s.session_id,
        "scheduled_at": s.scheduled_at,
        "created_at": s.created_at
    } for s in sessions]), 200



