from flask import Flask
import sqlite3
app = Flask(__name__)


@app.route("/api/awards")
def search_awards():
    with sqlite3.connect("api/Awards.db") as connection:
        cursor = connection.cursor()
        awards = cursor.execute("SELECT * FROM awards LIMIT 20").fetchall()

        htmlDiv = ''

        for award in awards:
            htmlDiv += f"<div>Award ID: {award[0]}</div>"
            htmlDiv += f"<div>Award Title: {award[1]}</div>"
            htmlDiv += f"<div>Award Amount: ${award[5]}</div>"
            htmlDiv += f"<div>Institution: {award[8]}</div>"
            htmlDiv += f"<br/><br/><br/>"

        return htmlDiv


    