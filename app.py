from flask import Flask, request, render_template
from flask_cors import CORS
import psycopg2

app = Flask(__name__)   # ✅ FIRST create app
CORS(app)               # ✅ THEN apply CORS


DATABASE_URL = "postgresql://admission_db_r04k_user:nO1ZKIBEa6Gt6778GtypL2LcKnGOOzpA@dpg-d7eueljbc2fs738f09f0-a.ohio-postgres.render.com/admission_db_r04k"


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/submit', methods=['POST'])
def submit():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        data = request.get_json()
        print("JSON DATA:", data)

        # ✅ TABLE CREATE (INSIDE FUNCTION)
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

        # ✅ INSERT
        cur.execute("""
            INSERT INTO students 
            (student_name, parent_name, quota, location, college, phone, email)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            data.get("student_name"),
            data.get("parent_name"),
            data.get("quota"),
            data.get("location"),
            data.get("college"),
            data.get("phone"),
            data.get("email")
        ))

        conn.commit()
        cur.close()
        conn.close()

        return {"message": "✅ Submitted Successfully"}

    except Exception as e:
        print("ERROR:", e)
        return {"error": str(e)}


@app.route('/data')
def view_data():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    cur.execute("SELECT * FROM students ORDER BY id DESC")
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return render_template("data.html", data=rows)
@app.route('/reset')
def reset():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    cur.execute("DROP TABLE IF EXISTS students")

    conn.commit()
    cur.close()
    conn.close()

    return "✅ Table Deleted Successfully"

if __name__ == '__main__':
    app.run(debug=True)

