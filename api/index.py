from flask import Flask
import sqlite3
app = Flask(__name__)


@app.route("/api/awards")
def search_awards():
    with sqlite3.connect("api/Awards.db") as connection:
        cursor = connection.cursor()
        awards = cursor.execute("SELECT * FROM awards").fetchall()

    return f"<p>Awards: {awards}</p>"



@app.route("/api/addAward")
def add_award():
    with sqlite3.connect("api/Awards.db") as connection:
        cursor = connection.cursor()
        cursor.execute("CREATE TABLE IF NOT EXISTS awards (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, abstract TEXT, investigator TEXT, amount INTEGER, date TEXT)")
        
        cursor.execute(
            "INSERT INTO awards (title, abstract, investigator, amount, date) VALUES (?, ?, ?, ?, ?)",
            ("award title", "an abstract", "John Doe", 265000, "2024-01-01")
        )

        awards = cursor.execute("SELECT * FROM awards").fetchall()

    return f"<p>Awards: {awards}</p>"



@app.route("/api/deleteAwards")
def delete_awards():
    with sqlite3.connect("api/Awards.db") as connection:
        cursor = connection.cursor()
        cursor.execute("DROP TABLE awards")

    return "<p>Table dropped</p>"
    