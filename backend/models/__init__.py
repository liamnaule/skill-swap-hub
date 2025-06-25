from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User, TokenBlocklist
from .skill import Skill
from .session import Session
from .rating import Rating
from .report import Report

