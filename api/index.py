from flask import Flask, request
import sqlite3
import pandas as pd
import git
import matplotlib.pyplot as plt
from plottable import Table, ColumnDefinition
import seaborn as sns
import plotly.express as px
import json
import plotly




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
    query = "SELECT * FROM awards WHERE title LIKE ? LIMIT 3000"
    return query_to_json(query, (f"%{title}%",))

# Search by Award ID
@app.route('/search_award_id', methods=['GET'])
def search_by_award_id():
    award_id = request.args.get('award_id')
    query = "SELECT * FROM awards WHERE awardID = ? LIMIT 3000"
    return query_to_json(query, (award_id,))

# Search by Organization/University
@app.route('/search_institution', methods=['GET'])
def search_by_institution():
    institution_name = request.args.get('institution')
    query = "SELECT * FROM awards WHERE institution LIKE ? LIMIT 3000"
    return query_to_json(query, (f"%{institution_name}%",))

# Search by Investigator Name
@app.route('/search_name', methods=['GET'])
def search_by_name():
    investigator_name = request.args.get('name')
    query = "SELECT * FROM investigators WHERE name LIKE ? LIMIT 3000"
    return query_to_json(query, (f"%{investigator_name}%",))

#Search by Organization Abbreviation
@app.route('/search_org_abbr', methods=['GET'])
def search_by_org_abbr():
    org_abbr = request.args.get('org_abbr')
    query = "SELECT * FROM awards WHERE org_abbr LIKE ? LIMIT 3000"
    return query_to_json(query, (f"%{org_abbr}%",))





# pandas and plotly example
@app.route('/example', methods=['GET'])
def pandas_example():

    # test data
    data = [
        {"awardID": "1004589", "title": "Nonequilibrium Quantum Mechanics of Strongly Correlated Systems", "effectiveDate": "09/15/2010", "expDate": "08/31/2014", "amount": 285000.0, "instrument": "Continuing Grant", "programOfficer": "Daryl Hess", "institution": "New York University", "zipCode": "100121019", "state": "New York", "country": "United States", "org_abbr": "MPS", "org_name": "Direct For Mathematical & Physical Scien"},
        {"awardID": "1005861", "title": "Nonequilibrium Materials Synthesis: Understanding and Controlling the Formation of Hierarchically Structured Microtubes", "effectiveDate": "09/15/2010", "expDate": "08/31/2015", "amount": 225000.0, "instrument": "Continuing Grant", "programOfficer": "Michael J. Scott", "institution": "Florida State University", "zipCode": "323060001", "state": "Florida", "country": "United States", "org_abbr": "MPS", "org_name": "Direct For Mathematical & Physical Scien"},
        {"awardID": "1006605", "title": "Transport and Nonequilibrium Effects in Strongly Correlated Multilayer Nanostructure", "effectiveDate": "08/01/2010", "expDate": "07/31/2014", "amount": 630000.0, "instrument": "Continuing Grant", "programOfficer": "Andrey Dobrynin", "institution": "Georgetown University", "zipCode": "200570001", "state": "District of Columbia", "country": "United States", "org_abbr": "MPS", "org_name": "Direct For Mathematical & Physical Scien"}
    ]
    df = pd.DataFrame(data)

    # Department by Year - Line Chart
    df['effectiveYear'] = pd.to_datetime(df['effectiveDate']).dt.year
    ptable = pd.pivot_table(df, values='amount', index='effectiveYear', columns='org_abbr', aggfunc='sum')
    ptable = ptable.fillna(0).reset_index()

    # Convert the pivot table to long format for plotly
    ptable_long = pd.melt(ptable, id_vars=['effectiveYear'], value_vars=ptable.columns[1:], var_name='Department', value_name='AwardTotal')

    # Create the plotly figure
    fig = px.line(ptable_long, x='effectiveYear', y='AwardTotal', color='Department', title='Department by Year')

    # Convert the plotly figure to JSON
    graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
    return graphJSON






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

