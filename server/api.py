from flask import Flask, json
from flask_cors import CORS
from rtl_power_to_json import rtl_power_to_json

app = Flask(__name__)
CORS(app)

@app.route("/rtl", methods=['GET'])
def get_rtl():
    return rtl_power_to_json("mock/data.csv")

if __name__ == "__main__":
    app.run()