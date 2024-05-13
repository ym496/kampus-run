from flask import Flask, request, render_template, redirect, url_for, jsonify, session
from flask import current_app as app
from flask_login import LoginManager, login_user, logout_user, current_user
from application.models import User, Admin, Runner, RaceType, db
from datetime import datetime, timedelta
import re

app.secret_key = '1234'
login_manager = LoginManager(app)

@login_manager.user_loader
def load_user(user_id):
    user = User.query.get(user_id)
    if user:
        return user

    admin = Admin.query.get(user_id)
    if admin:
        return admin

    return None


@app.route('/')
def index():
    if session.get('role') == 'user' or session.get('role') == 'admin':
        return redirect(url_for('start'))

    return render_template('index.html')

@app.post('/login')
def login():
    email = request.form.get('email')
    password = request.form.get('password')
    user = User.query.filter_by(email=email).first()
    if user and user.password == password:
        login_user(user)
        session['role'] = "user"
        return redirect(url_for('start'))

@app.route('/logout')
def logout():
    logout_user()
    session.pop('role', None)
    return redirect(url_for('index'))


@app.route('/monitor')
def monitor():
    if session.get('role') == 'user' or session.get('role') == 'admin':
        return render_template('monitor.html')
    return redirect(url_for('index'))

@app.route('/start')
def start():
    if session.get('role') == 'user' or session.get('role') == 'admin':
        return render_template('start.html')
    return redirect(url_for('index'))


@app.route('/has_started/<int:race_id>')
def has_started(race_id):
    cat = db.session.query(RaceType).filter_by(category=race_id).first()
    if session.get('role') == 'user' or session.get('role') == 'admin':
        if cat.has_started == 0:
            return jsonify({"started":False})
        else:
            return jsonify({"started":True})

@app.post('/start_race')
def start_race():
    if session.get('role') == 'user' or session.get('role') == 'admin':
        race_type = request.json.get('raceType')  
        start_time = request.json.get('startTime')  
        cat = db.session.query(RaceType).filter_by(category=race_type).first()
        if start_time:
            hours = start_time.get('hours')
            minutes = start_time.get('minutes')
            seconds = start_time.get('seconds')
            start_time_object = datetime.now().replace(hour=hours, minute=minutes, second=seconds)
            cat.start_time = start_time_object
            cat.has_started = 1
            finish_time = 0
            if race_type == "5":
                finish_time = start_time_object + timedelta(hours=1)
            else:
                finish_time = start_time_object + timedelta(minutes=45)
            cat.finish_time = finish_time
            db.session.commit()
            return jsonify({"result":"success"})
        else:
            return jsonify({"eror":"Where the time, son?"}), 400

@app.post('/start_log')
def start_log():
    if session.get('role') == 'user' or session.get('role') == 'admin':
        bib_code = request.json.get('bib_code')
        pattern = r'^\d{1,3}$'
        if re.match(pattern, bib_code):
            pass
        else:
            return jsonify({'status': 'error', 'message': 'Invalid bib_code'}), 400
        # check validity of bib_code once again when the format is decided
        start_time = request.json.get('startTime')
        player = db.session.query(Runner).filter_by(bib_code=bib_code).first()
        if player is None: 
            hours = start_time.get('hours')
            minutes = start_time.get('minutes')
            seconds = start_time.get('seconds')
            start_time_object = datetime.now().replace(hour=hours, minute=minutes, second=seconds)
            runner = Runner(bib_code=bib_code,start_time=start_time_object)
            db.session.add(runner)
            db.session.commit()
            return jsonify({"result":"success"})
        else:
            return jsonify({"result":"Player start time has already been noted."}), 400
