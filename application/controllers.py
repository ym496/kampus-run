from flask import Flask, request, render_template, redirect, url_for, jsonify
from flask import current_app as app
from application.models import Runner, db

@app.route('/',methods=["GET","POST"])
def index():
    
    if request.method == "GET":
        return render_template('index.html')
