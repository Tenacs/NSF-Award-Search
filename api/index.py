from flask import Flask, request
import sqlite3
import pandas as pd
import git
# import matplotlib.pyplot as plt
# from plottable import Table, ColumnDefinition
# import seaborn as sns
import plotly.express as px
import json
import plotly.utils


app = Flask(__name__)


# Database connection
def get_db_connection():
    conn = sqlite3.connect('api/Awards.db')
    return conn

def query_to_json(query, params=()):
    conn = get_db_connection()
    df = pd.read_sql_query("Select * FROM (" + query + ") LIMIT 3000", conn, params=params)
    conn.close()
    return df.to_json(orient='records')


# Search by keyword
@app.route('/search_keyword', methods=['GET'])
def search_by_keyword():
    keyword = request.args.get('keyword')
    query = "SELECT * FROM awards WHERE title LIKE ? OR awardID = ? OR institution LIKE ? OR primary_investigators LIKE ? OR co_primary_investigators LIKE ? ORDER BY (title LIKE ?) DESC"
    return query_to_json(query, (f"%{keyword}%", keyword, f"%{keyword}%", f"%{keyword}%", f"%{keyword}%", f"%{keyword}%"))



#####    Main Search Page    #####

# Search by Award Title or Award ID
@app.route('/search_award_title', methods=['GET'])
def search_by_award_title():
    title = request.args.get('title')
    query = "SELECT * from awards where title LIKE ? OR awardID = ?"
    return query_to_json(query, (f"%{title}%", title))


# Search by Investigator Name
@app.route('/search_name', methods=['GET'])
def search_by_name():
    investigator_name = request.args.get('name')
    includeCoPI = request.args.get('includeCoPI')

    query = "SELECT * FROM awards WHERE primary_investigators LIKE ?"
    params = (f"%{investigator_name}%",)

    if includeCoPI == 'true':
        query = "SELECT * FROM awards WHERE primary_investigators LIKE ? OR co_primary_investigators LIKE ?"
        params = (f"%{investigator_name}%", f"%{investigator_name}%")

    return query_to_json(query, params)


# Search by Program 
@app.route('/search_program', methods=['GET'])
def search_by_program():
    org_name = request.args.get('org_name')
    officer_name = request.args.get('programOfficer')
    ref_code = request.args.get('programReferenceCodes')
    ele_code = request.args.get('programElementCodes')
    query = "SELECT * FROM awards WHERE 1=1"
    params = []

    if officer_name:
        query += " AND programOfficer LIKE ?"
        params.append(f"%{officer_name}%")

    if org_name:
        query += " AND org_name LIKE ?"
        params.append(f"%{org_name}%")

    if ref_code:
        query += " AND programReferenceCodes LIKE ?"
        params.append(f"%{ref_code}%")

    if ele_code:
        query += " AND programElementCodes LIKE ?"
        params.append(f"%{ele_code}%")

    return query_to_json(query, params)


# Search by Organization/University
@app.route('/search_institution', methods=['GET'])
def search_by_institution():
    institution_name = request.args.get('institution')
    query = "SELECT * FROM awards WHERE institution LIKE ?"
    return query_to_json(query, (f"%{institution_name}%",))

# Advanced Search Function
@app.route('/advanced_search', methods=['GET'])
def advanced_search():
    # Search parameters from the request
    title = request.args.get('title')
    award_id = request.args.get('awardID')
    institution = request.args.get('institution')
    investigator = request.args.get('investigator')
    program = request.args.get('program')
    start_year = request.args.get('startYear')
    end_year = request.args.get('endYear')
    exp_date = request.args.get('expDate')
    amount = request.args.get('amount')
    zip_code = request.args.get('zipCode')
    state = request.args.get('state')
    country = request.args.get('country')
    
    # Start building the SQL query
    query = "SELECT * FROM awards WHERE 1=1"
    conditions = []
    params = []
    
    if title:
        conditions.append("title LIKE ?")
        params.append(f"%{title}%")
    if award_id:
        conditions.append("awardID = ?")
        params.append(award_id)
    if institution:
        conditions.append("institution LIKE ?")
        params.append(f"%{institution}%")
    if investigator:
        # Search both primary and co-primary investigators
        conditions.append("(primary_investigators LIKE ? OR co_primary_investigators LIKE ?)")
        params.extend([f"%{investigator}%", f"%{investigator}%"])
    if program:
        # Assume program refers to org_name for this search
        conditions.append("org_name LIKE ?")
        params.append(f"%{program}%")
    if start_year and end_year:
        # Match any date within the start and end year by isolating the year
        conditions.append("CAST(SUBSTR(effectiveDate, -4) AS INTEGER) BETWEEN ? AND ?")
        params.append(start_year)
        params.append(end_year)
    elif start_year:
        conditions.append("CAST(SUBSTR(effectiveDate, -4) AS INTEGER) >= ?")
        params.append(start_year)
    elif end_year:
        conditions.append("CAST(SUBSTR(effectiveDate, -4) AS INTEGER) <= ?")
        params.append(end_year)
    if exp_date:
        conditions.append("expDate <= ?")
        params.append(exp_date)
    if amount:
        conditions.append("amount >= ?")
        params.append(amount)
    if zip_code:
        conditions.append("zipCode = ?")
        params.append(zip_code)
    if state:
        conditions.append("state LIKE ?")
        params.append(f"%{state}%")
    if country:
        conditions.append("country LIKE ?")
        params.append(f"%{country}%")

    # Combine conditions to form the WHERE clause
    if conditions:
        query += " AND " + " AND ".join(conditions)

    # Execute and return JSON results
    return query_to_json(query, params)


# pandas and plotly example
@app.route('/example', methods=['POST'])
def pandas_example():
    

    # test data
    # data = [{"awardID":"0000009","title":"Design of Cutting Tools for High Speed Milling","effectiveDate":"06\/15\/2000","expDate":"05\/31\/2004","amount":280000.0,"instrument":"Continuing Grant","programOfficer":"george hazelrigg","institution":"University of Florida","zipCode":"326111941","state":"Florida","country":"United States","org_abbr":"ENG","org_name":"Directorate For Engineering","primary_investigators":"John C Ziegert","co_primary_investigators":"Jiri Tlusty,Tony L Schmitz","programElementCodes":"146800","programReferenceCodes":"9146,MANU"},
    #         {"awardID":"0000047","title":"Collaborative Research: Deep Basin Experiment Synthesis","effectiveDate":"03\/01\/2000","expDate":"02\/29\/2004","amount":200000.0,"instrument":"Standard Grant","programOfficer":"Eric C. Itsweire","institution":"Florida State University","zipCode":"323060001","state":"Florida","country":"United States","org_abbr":"GEO","org_name":"Directorate For Geosciences","primary_investigators":"Kevin Speer","co_primary_investigators":None,"programElementCodes":"161000","programReferenceCodes":"1326,EGCH"}
    #         ]

    data = request.json

    df = pd.DataFrame(data['results'])  # Create DataFrame from JSON

    # Department by Year - Bar Chart
    df['effectiveYear'] = pd.to_datetime(df['effectiveDate']).dt.year
    ptable = pd.pivot_table(df, values='amount', index='effectiveYear', columns='org_abbr', aggfunc='sum')
    ptable = ptable.fillna(0).reset_index()

    # Convert the pivot table to long format for plotly
    ptable_long = pd.melt(ptable, id_vars=['effectiveYear'], value_vars=ptable.columns[1:], var_name='Department', value_name='AwardTotal')

    # Create the plotly figure
    if data['type'] == 'bar':
        fig = px.bar(ptable_long, x='effectiveYear', y='AwardTotal', color='Department', title='Department by Year')
    elif data['type'] == 'line':
        fig = px.line(ptable_long, x='effectiveYear', y='AwardTotal', color='Department', title='Department by Year')
    else:
        fig = px.scatter(ptable_long, x='effectiveYear', y='AwardTotal', color='Department', title='Department by Year')

    # Convert the plotly figure to JSON
    graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
    return graphJSON
    
    ### Can also return as an object with other json objects like below
    # return json.dumps({'bar': graphJSON, 'line': graphJSON2, 'scatter': graphJSON3})









# Function to automatically push github updates to Pythonanywhere
@app.route('/git_update', methods=['POST'])
def git_update():
    repo = git.Repo('../NSF-Award-Search')
    repo.git.fetch()
    repo.git.reset('--hard', 'origin/main')
    repo.git.pull('origin', 'main')
    return '', 200



if __name__ == '__main__':
    app.run(debug=True)

