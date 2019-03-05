from pyshark import *
import sys
from flask import Flask, jsonify, request
from packetCallback import captureBluetooth
import pymongo
import os


app = Flask(__name__)

app_data = {}
MongoClient = pymongo.MongoClient()
db = MongoClient['bluetooth_data']

capture = ""
timeout = None

@app.route("/capture", methods=['POST'])
def capture_callback():

    global capture
    arguments = request.json

    if arguments['capture_method'] == 'start':

        if arguments['capture_type'] == "":
            print("Select Capture Type: <live> or <file>")
            sys.exit(2)

        if arguments['capture_type'] == 'file' and arguments['capture_file'] == "":
            print("No capture file selected for file capture")
            sys.exit(2)

        if arguments['capture_type'] == 'live':

            if sys.platform != 'linux':
                return jsonify({'result': 'Live Capture Only Available in Linux'})

            capture = LiveCapture(interface='bluetooth0')

        elif arguments['capture_type'] == 'file':
            capture = FileCapture(arguments['capture_file'])

        capture.set_debug(True)
        capture.use_json = True
        capture.keep_packets = False

        capture.apply_on_packets(captureBluetooth)
        return jsonify({'result': "Finished Capture"})

    elif arguments["capture_method"] == 'stop':

        capture_processes = list(capture._running_processes)
        for process in capture_processes:

            os.kill(process.pid, 15)

        return jsonify({'result': 'Stopped Capture'})


if __name__ == '__main__':

    app.run()
