from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import datetime

bp = Blueprint('chat', __name__, url_prefix='/api/chat')

# In-memory chat history (replace with database in production)
chat_history = []

@bp.route('/message', methods=['POST'])
@jwt_required()
def send_message():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({'error': 'Message is required'}), 400
    
    message = {
        'user': get_jwt_identity(),
        'message': data['message'],
        'timestamp': datetime.datetime.now().isoformat()
    }
    
    chat_history.append(message)
    return jsonify({'message': 'Message sent successfully'}), 200

@bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    return jsonify({'messages': chat_history}), 200 