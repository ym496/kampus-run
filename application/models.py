from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Runner(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bib_code = db.Column(db.String(20), unique=True, nullable=False)
    start_time = db.Column(db.DateTime)
    finish_time = db.Column(db.DateTime)
