from config import password
import pymongo
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

conn = f'mongodb://manda036:{password}@cluster0-shard-00-00-kjmy2.mongodb.net:27017,cluster0-shard-00-01-kjmy2.mongodb.net:27017,cluster0-shard-00-02-kjmy2.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true'
client = pymongo.MongoClient(conn)
db = client.GlobalMarkets_DB

app = Flask(__name__)

@app.route("/")
def home():
    global_markets = list(db.GlobalMarkets.find())
    print(global_markets)

    return render_template("index.html", global_markets=global_markets)

if __name__ == "__main__":
    app.run(debug=True)