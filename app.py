import psycopg2
from flask import Flask, request, render_template, redirect
import os

app = Flask(__name__)

# 🔥 IMPORTANT: direct connection (local)
DATABASE_URL = "postgresql://admission_db_r04k_user:nO1ZKIBEa6Gt6778GtypL2LcKnGOOzpA@dpg-d7eueljbc2fs738f09f0-a.ohio-postgres.render.com/admission_db_r04k"


@app.route('/')
def home():
    return render_template('index.html')


# ✅ FORM SUBMIT FIX
@app.route('/submit', methods=['POST'])
def submit():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        print("FORM DATA:", request.form)

        # table create
        cur.execute("""
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                student_name TEXT,
                parent_name TEXT,
                quota TEXT,
                location TEXT,
                college TEXT,
                phone TEXT,
                email TEXT
            )
        """)

        # insert
        cur.execute("""
            INSERT INTO students 
            (student_name, parent_name, quota, location, college, phone, email)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            request.form.get("student_name"),
            request.form.get("parent_name"),
            request.form.get("quota"),
            request.form.get("location"),
            request.form.get("college"),
            request.form.get("phone"),
            request.form.get("email")
        ))

        conn.commit()
        cur.close()
        conn.close()

        return redirect('/data')

    except Exception as e:
        print("ERROR:", e)
        return f"Error: {e}"


# ✅ VIEW DATA
@app.route('/data')
def view_data():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        cur.execute("SELECT * FROM students ORDER BY id DESC")
        rows = cur.fetchall() if cur.rowcount != 0 else []
        print("DATA:", rows)
        cur.close()
        conn.close()

        return render_template("data.html", data=rows)

    except Exception as e:
        return f"Error: {e}"


if __name__ == '__main__':
    app.run(debug=True)