from flask import Flask, jsonify, request
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from flask_cors import CORS
from models import db, User, Iris

app = Flask(__name__)
CORS(app)  # This allows all origins, but you can customize it if needed
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///iris.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'cc22944d2e2f90c8c9e2ed68c1968123' # This is not a good practice, it is just for demonstration purposes

db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()  # Use email for login
    if user and user.password == data['password']:
        login_user(user)
        return jsonify({"message": f"Logged in as {user.email}", "role": user.role}), 200
    return jsonify({"message": "Invalid credentials"}), 401

# Logout route
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out"}), 200

# Route to get filtered Iris data based on user role
@app.route('/iris', methods=['POST'])
# @login_required  
# I had issued dealing with the login_required decorator. So I used a workaround to get the role from the request data.
# In a real-world scenario, you should use the login_required decorator to protect the route.
# I had an issue with the CORS policy. I tried to set the Access-Control-Allow-Origin header to '*' but it didn't work.
def get_iris_data():
    request_data = request.json
    role = request_data['role']
    print(f"Role obtained: {role}")
    if role == 'setosa':
        data = Iris.query.filter_by(variety='Iris-setosa').all()
    elif role == 'virginica':
        data = Iris.query.filter_by(variety='Iris-virginica').all()
    else:
        return jsonify({"message": "Access denied"}), 403

    result = [
        {
            "id": entry.id,
            "sepal_length": entry.sepal_length,
            "sepal_width": entry.sepal_width,
            "petal_length": entry.petal_length,
            "petal_width": entry.petal_width,
            "variety": entry.variety
        }
        for entry in data
    ]
    return jsonify(result), 200


if __name__ == '__main__':
    app.run(debug=True)

