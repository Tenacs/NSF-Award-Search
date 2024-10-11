from flask import Flask, request, jsonify
import sqlite3
import pandas as pd
app = Flask(__name__)


# Database connection
def get_db_connection():
    conn = sqlite3.connect('api/Awards.db')
    return conn

def query_to_json(query, params=()):
    conn = get_db_connection()
    df = pd.read_sql_query(query, conn, params=params)
    conn.close()
    return df.to_json(orient='records')

# Search by Award Title
@app.route('/search_award_title', methods=['GET'])
def search_by_award_title():
    title = request.args.get('title')
    query = "SELECT * FROM awards WHERE title LIKE ?"
    return query_to_json(query, (f"%{title}%",))

# Search by Award ID
@app.route('/search_award_id', methods=['GET'])
def search_by_award_id():
    award_id = request.args.get('award_id')
    query = "SELECT * FROM awards WHERE awardID = ?"
    return query_to_json(query, (award_id,))

# Search by Organization/University
@app.route('/search_institution', methods=['GET'])
def search_by_institution():
    institution_name = request.args.get('institution')
    query = "SELECT * FROM awards WHERE institution LIKE ?"
    return query_to_json(query, (f"%{institution_name}%",))

# Search by Investigator Name
@app.route('/search_name', methods=['GET'])
def search_by_name():
    investigator_name = request.args.get('name')
    query = "SELECT * FROM investigators WHERE name LIKE ?"
    return query_to_json(query, (f"%{investigator_name}%",))

#Search by Organization Abbreviation
@app.route('/search_org_abbr', methods=['GET'])
def search_by_org_abbr():
    org_abbr = request.args.get('org_abbr')
    query = "SELECT * FROM awards WHERE org_abbr LIKE ?"
    return query_to_json(query, (f"%{org_abbr}%",))

if __name__ == '__main__':
    app.run(debug=True)

