from flask import Blueprint, jsonify, request
from backend.models import db
from backend.models.report import Report
from flask_jwt_extended import jwt_required, get_jwt_identity
from .user import is_admin

report_bp = Blueprint("report_bp", __name__)

@report_bp.route("/", methods=["POST"])
@jwt_required()
def create_report():
    data = request.get_json()
    reporter_id = get_jwt_identity()
    reported_user_id = data.get("reported_user_id")
    reported_skill_id = data.get("reported_skill_id")
    reason = data.get("reason")

    if not reason:
        return jsonify({"error": "Reason is required"}), 400

    report = Report(
        reporter_id=reporter_id,
        reported_user_id=reported_user_id,
        reported_skill_id=reported_skill_id,
        reason=reason
    )
    db.session.add(report)
    db.session.commit()
    return jsonify({"success": "Report submitted"}), 201

@report_bp.route("/", methods=["GET"])
@jwt_required()
def get_reports():
    if not is_admin():
        return jsonify({"error": "Admin privileges required"}), 403
    reports = Report.query.all()
    return jsonify([{
        "id": r.id,
        "reporter_id": r.reporter_id,
        "reported_user_id": r.reported_user_id,
        "reported_skill_id": r.reported_skill_id,
        "reason": r.reason,
        "created_at": r.created_at.isoformat()
    } for r in reports]), 200

@report_bp.route("/<int:report_id>", methods=["DELETE"])
@jwt_required()
def delete_report(report_id):
    if not is_admin():
        return jsonify({"error": "Admin privileges required"}), 403
    report = Report.query.get(report_id)
    if not report:
        return jsonify({"error": "Report not found"}), 404
    db.session.delete(report)
    db.session.commit()
    return jsonify({"success": "Report deleted"}), 200