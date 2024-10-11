from flask import Flask
import sqlite3
import pandas as pd
import json
import plotly
import plotly.express as px

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


@app.route('/api/generatePlot')
def bar_with_plotly():
   # Students data available in a list of list
    students = [['Akash', 34, 'Sydney', 'Australia'],
                ['Rithika', 30, 'Coimbatore', 'India'],
                ['Priya', 31, 'Coimbatore', 'India'],
                ['Sandy', 32, 'Tokyo', 'Japan'],
                ['Praneeth', 16, 'New York', 'US'],
                ['Praveen', 17, 'Toronto', 'Canada']]
     
    # Convert list to dataframe and assign column values
    df = pd.DataFrame(students,
                      columns=['Name', 'Age', 'City', 'Country'],
                      index=['a', 'b', 'c', 'd', 'e', 'f'])
     
    # Create Bar chart
    fig = px.bar(df, x='Name', y='Age', color='City', barmode='group')
     
    # Create graphJSON
    graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
     
    return graphJSON