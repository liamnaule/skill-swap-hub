from flask import request, jsonify, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import check_password_hash
from backend.models import db
from backend.models.user import User
from backend.models import TokenBlocklist
from datetime import datetime, timezone

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Missing JSON in request"}), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    if user.is_blocked:
        return jsonify({"error": "User is blocked"}), 403

    access_token = create_access_token(identity=user.id)
    return jsonify(
        access_token=access_token,
        user={
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_admin,
            "is_blocked": user.is_blocked,
            "created_at": user.created_at
        }
    ), 200

@auth_bp.route("/current_user", methods=["GET"])
@jwt_required()
def get_current_user():
    current_user = User.query.get(get_jwt_identity())
    if not current_user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "is_admin": current_user.is_admin,
        "is_blocked": current_user.is_blocked,
        "created_at": current_user.created_at
    }), 200

@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    db.session.add(TokenBlocklist(jti=jti, created_at=datetime.now(timezone.utc)))
    db.session.commit()
    return jsonify({"success": "Successfully logged out"}), 200
