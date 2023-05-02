from flask import Flask, json
from flask_cors import CORS
from queue import Queue, Empty
from threading import Thread

from rtl_power_to_json import rtl_power_to_json
from rtl_power_loop import run_rtl_power

app = Flask(__name__)
CORS(app)
commands = Queue()

Thread(target=run_rtl_power, daemon=True).start()

@app.route("/rtl", methods=['GET'])
def get_rtl():
    return rtl_power_to_json("data")

if __name__ == "__main__":
    app.run()