from flask import Flask, request, jsonify
from flask_cors import CORS
from collections import defaultdict
from inv_sim import get_predicted_data
from datetime import datetime, timedelta


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})  # Allow CORS for /api/* routes and localhost:3000 origin

# Dummy data
dummy_data = [
        { "month": 'Jan', "value": 10 },
        { "month": 'Feb', "value": 20 },
        { "month": 'Mar', "value": 30 },
        { "month": 'Apr', "value": 25 },
        { "month": 'May', "value": 40 },
        { "month": 'Jun', "value": 35 },
    ]

@app.route('/api/data', methods=["POST"])
def add_one():
    data = request.json
    money = data.get('money')
    company = data.get('company')
    temp, df = get_predicted_data(company, money)
    
    last_date = datetime(2024, 5, 16)
    index_diff = temp.index.to_series().diff().fillna(1)
    date_mapping = {temp.index[-1]: last_date}
    for i in range(len(temp.index) - 2, -1, -1):
        current_index = temp.index[i]
        next_index = temp.index[i + 1]
        date_mapping[current_index] = date_mapping[next_index] - timedelta(days=int(index_diff.iloc[i + 1]))
    data = [{"month": date_mapping[index].strftime('%B %d'), "value": value} for index, value in temp.items()]

    def generate_date_range(start_date, days):
        return [start_date + timedelta(days=i) for i in range(days)]
    start_date = datetime(2024, 3, 7)
    flat_df = [item[0] for item in df]
    dates = generate_date_range(start_date, len(flat_df))
    data2 = [{"month": date.strftime("%B %d"), "value": price} for date, price in zip(dates, flat_df)]

    return jsonify({"data": data, "pred": data2})

if __name__ == '__main__':
    app.run(port=5000)  # Running on port 5000