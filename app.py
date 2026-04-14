import psycopg2
from flask import Flask, request, jsonify, render_template
import os

app = Flask(__name__)

DATABASE_URL = os.environ.get("DATABASE_URL")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id SERIAL PRIMARY KEY,
            firstName TEXT,
            lastName TEXT,
            grade TEXT,
            dob TEXT,
            parentName TEXT,
            phone TEXT,
            email TEXT
        )
    """)
    cur.execute("""
        INSERT INTO students (firstName, lastName, grade, dob, parentName, phone, email)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (
        data.get("firstName"),
        data.get("lastName"),
        data.get("grade"),
        data.get("dob"),
        data.get("parentName"),
        data.get("phone"),
        data.get("email")
    ))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Saved to Database ✅"})
