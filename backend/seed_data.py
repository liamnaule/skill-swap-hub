import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app import app, db
from backend.models.user import User
from backend.models.skill import Skill
from backend.models.session import Session
from backend.models.rating import Rating
from backend.models.report import Report
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

with app.app_context():
    db.drop_all()
    db.create_all()

    # USERS
    admin = User(
        username="admin",
        email="admin@skillswap.com",
        password=generate_password_hash("AdminPass123!", method="pbkdf2:sha256"),
        is_admin=True,
        is_blocked=False
    )
    alice = User(
        username="alice",
        email="alice@example.com",
        password=generate_password_hash("AlicePass123!", method="pbkdf2:sha256"),
        is_admin=False,
        is_blocked=False
    )
    bob = User(
        username="bob",
        email="bob@example.com",
        password=generate_password_hash("BobPass123!", method="pbkdf2:sha256"),
        is_admin=False,
        is_blocked=False
    )
    db.session.add_all([admin, alice, bob])
    db.session.commit()

    # SKILLS
    skill1 = Skill(
        user_id=alice.id,
        title="Python Programming",
        is_offered=True,
        is_approved=True,
        created_at=datetime.utcnow() - timedelta(days=2)
    )
    skill2 = Skill(
        user_id=bob.id,
        title="Guitar Lessons",
        is_offered=True,
        is_approved=True,
        created_at=datetime.utcnow() - timedelta(days=1)
    )
    skill3 = Skill(
        user_id=admin.id,
        title="Project Management",
        is_offered=True,
        is_approved=True,
        created_at=datetime.utcnow()
    )
    db.session.add_all([skill1, skill2, skill3])
    db.session.commit()

    # SESSIONS
    session1 = Session(
        skill_id=skill1.skill_id,
        teacher_id=alice.id,
        learner_id=bob.id,
        scheduled_at=datetime.utcnow() - timedelta(days=1),
        created_at=datetime.utcnow()
    )
    session2 = Session(
        skill_id=skill2.skill_id,
        teacher_id=bob.id,
        learner_id=alice.id,
        scheduled_at=datetime.utcnow() - timedelta(days=1),
        created_at=datetime.utcnow()
    )
    session3 = Session(
        skill_id=skill1.skill_id,
        teacher_id=alice.id,
        learner_id=bob.id,
        scheduled_at=datetime.utcnow() - timedelta(days=2),
        created_at=datetime.utcnow()
    )
    db.session.add_all([session1, session2, session3])
    db.session.commit()

    # RATINGS
    rating1 = Rating(
        session_id=session1.session_id,
        rating=5,
        user_id=bob.id,  
        created_at=datetime.utcnow()
    )
    rating2 = Rating(
        session_id=session2.session_id,
        rating=4,
        user_id=alice.id,  
        created_at=datetime.utcnow()
    )
    db.session.add_all([rating1, rating2])
    db.session.commit()

    # REPORTS
    report1 = Report(
        reporter_id=alice.id,
        reported_user_id=bob.id,
        reported_skill_id=skill2.skill_id,
        reason="Inappropriate content",
        created_at=datetime.utcnow()
    )
    report2 = Report(
        reporter_id=bob.id,
        reported_user_id=alice.id,
        reported_skill_id=skill1.skill_id,
        reason="Spam",
        created_at=datetime.utcnow()
    )
    db.session.add_all([report1, report2])
    db.session.commit()

    print("Database seeded successfully!")
    print("Admin login: admin@skillswap.com / AdminPass123!")
    print("Alice login: alice@example.com / AlicePass123!")
    print("Bob login: bob@example.com / BobPass123!")