from flask import Flask, request, render_template, redirect, url_for, jsonify, session
from flask import current_app as app
from flask_login import LoginManager, login_user, logout_user, current_user
from application.models import User, Admin, Runner, db

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
        return redirect(url_for('monitor'))

    return render_template('index.html')

@app.post('/login')
def login():
    email = request.form.get('email')
    print(email)
    password = request.form.get('password')
    user = User.query.filter_by(email=email).first()
    if user and user.password == password:
        login_user(user)
        session['role'] = "user"
        return redirect(url_for('monitor'))

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
