import sqlite3
from flask import Flask, request

app = Flask(__name__)


# Database connection
def get_db_connection():
    conn = sqlite3.connect('api/Awards.db')
    return conn


# Search by Award Title
@app.route('/api/search_award_title', methods=['GET'])
def search_by_award_title():
    conn = get_db_connection()
    cursor = conn.cursor()
    title = request.args.get('title')
    results = cursor.execute("SELECT * FROM awards WHERE title LIKE ?", (f"%{title}%",)).fetchall()
    conn.close()

    return results

# Search by Award ID
@app.route('/api/search_award_id', methods=['GET'])
def search_by_award_id():
    conn = get_db_connection()
    cursor = conn.cursor()
    award_id = request.args.get('award_id')
    results = cursor.execute("SELECT * FROM awards WHERE awardID = ?", (award_id,)).fetchall()
    conn.close()

    return results

# Search by Organization/University
@app.route('/api/search_institution', methods=['GET'])
def search_by_institution():
    conn = get_db_connection()
    cursor = conn.cursor()
    institution_name = request.args.get('institution')
    results = cursor.execute("SELECT * FROM awards WHERE institution LIKE ?", (f"%{institution_name}%",)).fetchall()
    conn.close()

    return results

# Search by Investigator Name
@app.route('/api/search_name', methods=['GET'])
def search_by_name():
    conn = get_db_connection()
    cursor = conn.cursor()
    investigator_name = request.args.get('name')
    results = cursor.execute("SELECT * FROM investigators WHERE name LIKE ?", (f"%{investigator_name}%",)).fetchall()
    conn.close()

    return results

#Search by Organization Abbreviation
@app.route('/api/search_org_abbr', methods=['GET'])
def search_by_org_abbr():
    conn = get_db_connection()
    cursor = conn.cursor()
    org_abbr = request.args.get('org_abbr')
    results = cursor.execute("SELECT * FROM awards WHERE org_abbr LIKE ?", (f"%{org_abbr}%",)).fetchall()
    conn.close()

    return results

if __name__ == '__main__':
    app.run(debug=True)

