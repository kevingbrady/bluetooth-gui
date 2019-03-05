import pymongo
import os
import sys
from pyshark_tools import *
from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/test", methods=['POST'])
def run_python():

    MongoClient = pymongo.MongoClient()
    db = MongoClient['bluetooth_data']
    collection = db['python_data']

    data = {
        "process_id": os.getpid(),
        "arg1": sys.argv[1],
        "arg2": sys.argv[2]
    }

    collection.insert_one(toJSON(data))
    
    return jsonify(data)


if __name__ == '__main__':
    app.run()
