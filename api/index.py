from flask import Flask
import sqlite3
import polars as pl
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
    # Convert list to dataframe and assign column values
    df = pl.DataFrame({"a":[1,2,3,4,5], "b":[1,4,9,16,25]})

    fig = px.line(x=df["a"], y=df["b"])
     
    # Create graphJSON
    graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
     
    return f"""<!doctype html>
<html>
<style>
*{{
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}}
body {{
    background-color: #272b34;
    font-family: 'Khula', sans-serif;
    font-weight: 300;
    color: white;
    line-height: 1em;
    margin: 0;
  padding: 2em 1em;
}}
 
</style>
 <body>
  <div id='chart' class='chart'”></div>
</body>
 
<script src='https://cdn.plot.ly/plotly-latest.min.js'></script>
<script type='text/javascript'>
  var graphs = {graphJSON};
  Plotly.plot('chart',graphs,{{}});
</script>
</html>"""

