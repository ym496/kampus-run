from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()


class Runner(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bib_code = db.Column(db.String(20), unique=True, nullable=False)
    start_time = db.Column(db.DateTime)
    finish_time = db.Column(db.DateTime)

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

class Admin(db.Model, UserMixin):
    id = db.Column(db.String(50), primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
