from flask import Flask, request
import sqlite3
import pandas as pd
import git
import us
import plotly.express as px
import json
import plotly.utils


app = Flask(__name__)


# Database connection
def get_db_connection():
    conn = sqlite3.connect('api/Awards.db')
    return conn

def query_to_json(q, args, params=()):
    query = q + get_advanced_search(args)[0]
    parameters = params + get_advanced_search(args)[1]
    conn = get_db_connection()
    df = pd.read_sql_query(query + " LIMIT 3000", conn, params=parameters)
    conn.close()
    return df.to_json(orient='records')


# Search by keyword
@app.route('/search_keyword', methods=['GET'])
def search_by_keyword():
    keyword = request.args.get('keyword')
    query = """SELECT * FROM awards WHERE (title LIKE ? OR awardID = ? OR institution LIKE ? OR primary_investigators LIKE ? 
                OR co_primary_investigators LIKE ? OR programOfficer LIKE ? OR org_abbr LIKE ? OR org_name LIKE ? 
                OR programElementCodes LIKE ? OR programReferenceCodes LIKE ?)""" 
    return query_to_json(query, request.args, (f"%{keyword}%", keyword, f"%{keyword}%", f"%{keyword}%", f"%{keyword}%", f"%{keyword}%", f"%{keyword}%", f"%{keyword}%", f"%{keyword}%", f"%{keyword}%"))



#####    Main Search Page    #####

# Search by Award Title or Award ID
@app.route('/search_award_title', methods=['GET'])
def search_by_award_title():
    title = request.args.get('title')
    query = "SELECT * from awards where (title LIKE ? OR awardID = ?)"
    return query_to_json(query, request.args, (f"%{title}%", title))


# Search by Investigator Name
@app.route('/search_name', methods=['GET'])
def search_by_name():
    investigator_name = request.args.get('name')
    includeCoPI = request.args.get('includeCoPI')

    query = "SELECT * FROM awards WHERE primary_investigators LIKE ?"
    params = (f"%{investigator_name}%",)

    if includeCoPI == 'true':
        query = "SELECT * FROM awards WHERE (primary_investigators LIKE ? OR co_primary_investigators LIKE ?)"
        params = (f"%{investigator_name}%", f"%{investigator_name}%")

    return query_to_json(query, request.args, params)


# Search by Program 
@app.route('/search_program', methods=['GET'])
def search_by_program():
    program = request.args.get('program')
    programOfficer = request.args.get('programOfficer')
    refCode = request.args.get('referenceCode')
    eleCode = request.args.get('elementCode')
    query = "SELECT * FROM awards WHERE 1=1"
    params = ()

    if program:
        query += " AND org_name LIKE ?"
        params += (f"%{program}%",)

    if programOfficer:
        query += " AND programOfficer LIKE ?"
        params += (f"%{programOfficer}%",)

    if refCode:
        query += " AND programReferenceCodes LIKE ?"
        params += (f"%{refCode}%",)

    if eleCode:
        query += " AND programElementCodes LIKE ?"
        params += (f"%{eleCode}%",)

    return query_to_json(query, request.args, params)


# Search by Organization/University
@app.route('/search_institution', methods=['GET'])
def search_by_institution():
    institution_name = request.args.get('institution')
    query = "SELECT * FROM awards WHERE institution LIKE ?"
    return query_to_json(query, request.args, (f"%{institution_name}%",))

# Advanced Search Function
def get_advanced_search(args):
    start_year = args.get('startYear')
    end_year = args.get('endYear')
    zip_code = args.get('zipCode')
    state = args.get('state')
    country = args.get('country')
    
    # Start building the SQL query
    query = ""
    params = ()
    
    if start_year and end_year:
        # Match any date within the start and end year by isolating the year
        query += " AND CAST(SUBSTR(effectiveDate, -4) AS INTEGER) BETWEEN ? AND ?"
        params += (start_year, end_year)
    elif start_year:
        query += " AND CAST(SUBSTR(effectiveDate, -4) AS INTEGER) >= ?"
        params += (start_year,)
    elif end_year:
        query += " AND CAST(SUBSTR(effectiveDate, -4) AS INTEGER) <= ?"
        params += (end_year,)
    if zip_code:
        query += " AND zipCode = ?"
        params += (zip_code,)
    if state:
        query += " AND state LIKE ?"
        params += (f"%{state}%",)
    if country:
        query += " AND country LIKE ?"
        params += (f"%{country}%",)

    return [query, params]


# Data Visualization - Charts
@app.route('/example', methods=['POST'])
def pandas_example():
    data = request.json
    df = pd.DataFrame(data)

    df['State'] = df['state'].apply(lambda x: us.states.lookup(x).abbr if x and us.states.lookup(x) else None)
    df['Year'] = pd.to_datetime(df['effectiveDate']).dt.year

    # Figure 1: Departments by Number of Awards
    dep_counts = df['org_abbr'].value_counts()
    fig1 = px.pie(values=dep_counts, names=dep_counts.index, title='Departments by Number of Awards')

    # Figure 2: Department by Year
    df['effectiveYear'] = pd.to_datetime(df['effectiveDate']).dt.year
    ptable = pd.pivot_table(df, values='amount', index='effectiveYear', columns='org_abbr', aggfunc='sum').fillna(0).reset_index()
    ptable_long = pd.melt(ptable, id_vars=['effectiveYear'], var_name='Department', value_name='AwardTotal')
    fig2 = px.bar(ptable_long, x='effectiveYear', y='AwardTotal', color='Department', title='Department by Year')

    # Figure 3: US States by Award Amount
    df['amount'] = pd.to_numeric(df['amount'])
    df_aggregated = df.groupby('State', as_index=False)['amount'].sum()
    fig3 = px.choropleth(
        df_aggregated,
        locations='State',
        locationmode='USA-states',
        color='amount',
        scope="usa",
        color_continuous_scale="Viridis",
        title="US States by Award Amount",
    )
    fig3.update_layout(coloraxis_colorbar=dict(title="Awards in USD"))

    # Figure 4: Top Five Awards by Amount
    df_aggregated_org = df.groupby('title', as_index=False)['amount'].sum().sort_values(by='amount', ascending=False).head(5)
    fig4 = px.bar(
        df_aggregated_org,
        x='amount',
        y='title',
        orientation='h',
        labels={'amount': 'Amount in USD', 'title': 'Award'},
        title="Top Five Awards by Amount",
        color='title'
    )
    fig4.update_layout(
        legend=dict(orientation="h", yanchor="bottom", y=-0.6, xanchor="center", x=0.5),
        yaxis_showticklabels=False,
        title_x=0.5
    )

    # Figure 5: Department Awards by Year
    award_agg = df.groupby(['Year', 'org_abbr'])['amount'].sum().reset_index()
    full_years = pd.DataFrame({'Year': range(award_agg['Year'].min(), award_agg['Year'].max() + 1)})
    categories = pd.DataFrame({'org_abbr': award_agg['org_abbr'].unique()})
    full_index = pd.merge(full_years, categories, how='cross')
    df_full = pd.merge(full_index, award_agg, on=['Year', 'org_abbr'], how='left').fillna({'amount': 0})
    fig5 = px.line(df_full, x="Year", y="amount", color='org_abbr', title="Department Awards by Year", labels={'amount': 'Award Total in USD'})

    # Convert figures to JSON
    figures = {
        'fig1': json.dumps(fig1, cls=plotly.utils.PlotlyJSONEncoder),
        'fig2': json.dumps(fig2, cls=plotly.utils.PlotlyJSONEncoder),
        'fig3': json.dumps(fig3, cls=plotly.utils.PlotlyJSONEncoder),
        'fig4': json.dumps(fig4, cls=plotly.utils.PlotlyJSONEncoder),
        'fig5': json.dumps(fig5, cls=plotly.utils.PlotlyJSONEncoder),
    }

    return json.dumps(figures)









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

