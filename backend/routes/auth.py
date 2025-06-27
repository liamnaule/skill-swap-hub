from flask import request, jsonify, Blueprint
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import check_password_hash, generate_password_hash
from backend.models import db, User, TokenBlocklist
from datetime import datetime, timezone
import os

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Missing JSON in request"}), 400

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required"}), 400

    # Check if email or username already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already taken"}), 400

    # Create new user
    new_user = User(
        username=username,
        email=email,
        password=generate_password_hash(password),
        bio="",  # Default empty bio
        is_admin=False,
        is_blocked=False,
        created_at=datetime.now(timezone.utc)
    )
    db.session.add(new_user)
    db.session.commit()

    # Generate access token for immediate login
    access_token = create_access_token(identity=new_user.id)
    return jsonify(
        access_token=access_token,
        user={
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "bio": new_user.bio,
            "is_admin": new_user.is_admin,
            "is_blocked": new_user.is_blocked,
            "created_at": new_user.created_at.isoformat()
        }
    ), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Missing JSON in request"}), 400

    email = data.get("email")
    password = data.get("password")

    print("LOGIN ATTEMPT:", email, password)
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    print("USER FOUND:", user)
    if not user or not check_password_hash(user.password, password):
        print("LOGIN FAIL: invalid credentials")
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
            "bio": user.bio,
            "is_admin": user.is_admin,
            "is_blocked": user.is_blocked,
            "created_at": user.created_at.isoformat()
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
        "bio": current_user.bio,
        "is_admin": current_user.is_admin,
        "is_blocked": current_user.is_blocked,
        "created_at": current_user.created_at.isoformat()
    }), 200

@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    db.session.add(TokenBlocklist(jti=jti, created_at=datetime.now(timezone.utc)))
    db.session.commit()
    return jsonify({"success": "Successfully logged out"}), 200