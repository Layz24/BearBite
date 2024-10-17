from flask import Flask, request, jsonify, send_from_directory
import mysql.connector
from flask_cors import CORS

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Laila2001!",
    database="bearbite"
)

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/mock_data.json')
def serve_mock_data():
    return send_from_directory('.', 'mock_data.json')

@app.route('/api/menu', methods=['GET'])
def get_menu():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM menu_items")
    menu = cursor.fetchall()
    cursor.close()
    return jsonify(menu)

@app.route('/api/order', methods=['POST'])
def place_order():
    data = request.json
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM users WHERE user_id = %s", (1,))
        user = cursor.fetchone()
        if not user:
            return jsonify({"success": False, "message": "User not found!"}), 404

        total_amount = 0
        for item in data['cart']:
            cursor.execute("SELECT price FROM menu_items WHERE item_id = %s", (item['item_id'],))
            result = cursor.fetchone()
            if result:
                total_amount += result['price'] * item['quantity']
            else:
                return jsonify({"success": False, "message": f"Item {item['item_id']} not found"}), 404

        cursor.execute(
            "INSERT INTO orders (user_id, total_amount) VALUES (%s, %s)",
            (1, total_amount)
        )
        order_id = cursor.lastrowid

        for item in data['cart']:
            cursor.execute(
                "INSERT INTO order_items (order_id, item_id, quantity) VALUES (%s, %s, %s)",
                (order_id, item['item_id'], item['quantity'])
            )

        db.commit()
        cursor.close()
        return jsonify({"success": True, "message": "Order placed successfully!"}), 200

    except mysql.connector.Error:
        db.rollback()
        return jsonify({"success": False, "message": "Order failed!"}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM users WHERE username = %s AND password_hash = %s",
        (data['username'], data['password'])
    )
    user = cursor.fetchone()
    cursor.close()

    if user:
        return jsonify({"success": True, "message": "Login successful!"}), 200
    else:
        return jsonify({"success": False, "message": "Invalid username or password."}), 401

if __name__ == '__main__':
    app.run(debug=True)
