from flask import Blueprint, request, jsonify, current_app
from backend.models import db
from backend.models.user import User
from werkzeug.security import generate_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity

user_bp = Blueprint("user_bp", __name__)

def is_admin():
    current_user = User.query.get(get_jwt_identity())
    return current_user and current_user.is_admin

def is_self_or_admin(user_id):
    current_user = User.query.get(get_jwt_identity())
    return current_user and (current_user.id == user_id or current_user.is_admin)

# Register a new user (admin only)
@user_bp.route("/", methods=["POST"])
@jwt_required()
def create_user():
    if not is_admin():
        return jsonify({"error": "Admin privileges required"}), 403

    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Username, email and password are required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    hashed_pw = generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_pw)

    db.session.add(new_user)

    try:
        from backend.app import mail  
        from flask_mail import Message
        msg = Message(
            subject="Welcome to Skill swap hub",
            recipients=[email],
            sender=current_app.config['MAIL_DEFAULT_SENDER'],
            body=f"Hello {username},\n\nWelcome to Skill swap hub!"
        )
        mail.send(msg)
        db.session.commit()
        return jsonify({"success": "User created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to register/send email"}), 400

# Update a user (self or admin)
@user_bp.route("/<int:user_id>", methods=["PATCH"])
@jwt_required()
def update_user(user_id):
    if not is_self_or_admin(user_id):
        return jsonify({"error": "Not authorized"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)

    # Only admin can update is_admin and is_blocked
    if is_admin():
        user.is_admin = data.get("is_admin", user.is_admin)
        user.is_blocked = data.get("is_blocked", user.is_blocked)

    try:
        from backend.app import mail  
        from flask_mail import Message
        msg = Message(
            subject="Profile Updated",
            recipients=[user.email],
            sender=current_app.config['MAIL_DEFAULT_SENDER'],
            body=f"Hello {user.username},\n\nYour profile was updated."
        )
        mail.send(msg)
        db.session.commit()
        return jsonify({"success": "User updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Update failed"}), 400

# Get all users (admin only)
@user_bp.route("/", methods=["GET"])
@jwt_required()
def get_all_users():
    if not is_admin():
        return jsonify({"error": "Admin privileges required"}), 403

    users = User.query.all()
    return jsonify([
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "is_admin": u.is_admin,
            "is_blocked": u.is_blocked,
            "created_at": u.created_at
        } for u in users
    ]), 200

# Get user by ID (self or admin)
@user_bp.route("/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    if not is_self_or_admin(user_id):
        return jsonify({"error": "Not authorized"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin,
        "is_blocked": user.is_blocked,
        "created_at": user.created_at
    }), 200

# Delete a user (admin only)
@user_bp.route("/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    if not is_admin():
        return jsonify({"error": "Admin privileges required"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"success": "User deleted"}), 200
