# from config import password, username
import pymongo
import os
from bson.json_util import dumps
import json
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

conn = os.environ.get("MONGODB_URI")
client = pymongo.MongoClient(conn)
db = client.GlobalMarkets_DB

app = Flask(__name__)

@app.route("/")
def home():
    global_markets = list(db.GlobalMarkets.find())
    print(global_markets)
    return render_template("index.html", global_markets=global_markets)

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/alldata")
def data_json():
   global_markets = list(db.GlobalMarkets.find())
   print(global_markets)
   return dumps(global_markets)
    
if __name__ == "__main__":
    app.run(debug=True)