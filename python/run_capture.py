from pyshark import *
import sys
from flask import Flask, jsonify, request
import packetCallback
import pymongo
import os
import threading

app = Flask(__name__)
MongoClient = pymongo.MongoClient()
db = MongoClient['bluetooth_data']

capture = ""

def clear_data():
    db['raw_data'].delete_many({})
    db['Devices'].delete_many({})
    db['Connections'].delete_many({})

@app.route("/shutdown", methods=['POST'])
def shutdown_server():
    main_thread_id = threading.main_thread().ident
    os.kill(main_thread_id, 15)

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

        # Reset Capture variables before running new capture

        clear_data()

        packetCallback.app_data = {
            "devices": {
                "host": {},
                "controller": {}
            },
            "connections": {}
        }

        packetCallback.db = db
        packetCallback.advertisingAddresses = []
        packetCallback.deviceInfo = {}
        packetCallback.connectionInfo = {}
        packetCallback.handle = ""
        packetCallback.bd_addr = ""

        capture.apply_on_packets(packetCallback.captureBluetooth)

        return jsonify({'result': "Finished Capture"})

    elif arguments["capture_method"] == 'stop':

        capture_processes = list(capture._running_processes)
        for process in capture_processes:

            os.kill(process.pid, 15)

        return jsonify({'result': 'Stopped Capture'})


if __name__ == '__main__':

    clear_data()
    app.run()
