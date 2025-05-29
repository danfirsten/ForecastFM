from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# copy-pasted
@app.route("/api/data")
def data():
    return jsonify(message="This is API data")

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8000)