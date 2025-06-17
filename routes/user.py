from flask import Blueprint, request, jsonify
from models import db
from models.user import User
from werkzeug.security import generate_password_hash
from flask_mail import Message
from app import app, mail

user_bp = Blueprint("user_bp", __name__)


# Register a new user
@user_bp.route("/users", methods=["POST"])
def create_user():
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
        msg = Message(
            subject="Welcome to StackOverflow Clone",
            recipients=[email],
            sender=app.config['MAIL_DEFAULT_SENDER'],
            body=f"Hello {username},\n\nWelcome to StackOverflow Clone!"
        )
        mail.send(msg)
        db.session.commit()
        return jsonify({"success": "User created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to register/send email"}), 400


# Update a user
@user_bp.route("/users/<int:user_id>", methods=["PATCH"])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)
    user.is_admin = data.get("is_admin", user.is_admin)
    user.is_blocked = data.get("is_blocked", user.is_blocked)

    try:
        msg = Message(
            subject="Profile Updated",
            recipients=[user.email],
            sender=app.config['MAIL_DEFAULT_SENDER'],
            body=f"Hello {user.username},\n\nYour profile was updated."
        )
        mail.send(msg)
        db.session.commit()
        return jsonify({"success": "User updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Update failed"}), 400


# Get all users
@user_bp.route("/users", methods=["GET"])
def get_all_users():
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


# Get user by ID
@user_bp.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
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


# Delete a user
@user_bp.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"success": "User deleted"}), 200
