from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from ..utils.auth import validate_email, validate_password
import os
import json

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# File-based user storage
USERS_FILE = 'users.json'

def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f)

# Load users on startup
users = load_users()

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print("Register request received:", data)
    
    # Validate input
    if not all(k in data for k in ('email', 'password')):
        return jsonify({'error': 'Missing required fields'}), 400
    
    email = data['email']
    password = data['password']
    
    # Validate email and password
    if not validate_email(email):
        return jsonify({'error': 'Invalid email format'}), 400
    if not validate_password(password):
        return jsonify({'error': 'Password must be at least 8 characters long'}), 400
    
    # Check if user already exists
    if email in users:
        return jsonify({'error': 'User already exists'}), 409
    
    # Create new user
    users[email] = {
        'password_hash': generate_password_hash(password),
        'email': email
    }
    save_users(users)
    
    # Create access token
    access_token = create_access_token(identity=email)
    
    return jsonify({
        'message': 'User registered successfully',
        'token': access_token,
        'user': {'email': email}
    }), 201

@bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.get_json()
        print("Login request received:", data)
        
        # Validate input
        if not all(k in data for k in ('email', 'password')):
            print("Missing fields in login request")
            return jsonify({'error': 'Missing required fields'}), 400
        
        email = data['email']
        password = data['password']
        
        # Check if user exists
        if email not in users:
            print(f"User not found: {email}")
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Verify password
        if not check_password_hash(users[email]['password_hash'], password):
            print(f"Invalid password for user: {email}")
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create access token
        access_token = create_access_token(identity=email)
        print(f"Login successful for user: {email}")
        
        response = jsonify({
            'token': access_token,
            'user': {'email': email}
        })
        
        return response, 200
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user = get_jwt_identity()
    return jsonify({
        'email': current_user,
        'message': 'Protected route accessed successfully'
    }), 200 