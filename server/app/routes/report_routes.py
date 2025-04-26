from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import datetime

bp = Blueprint('report', __name__, url_prefix='/api/report')

# In-memory report storage (replace with database in production)
reports = {}

@bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_report():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    report_id = str(len(reports) + 1)
    reports[report_id] = {
        'id': report_id,
        'user': get_jwt_identity(),
        'data': data,
        'timestamp': datetime.datetime.now().isoformat()
    }
    
    return jsonify({
        'message': 'Report generated successfully',
        'report_id': report_id
    }), 201

@bp.route('/<report_id>', methods=['GET'])
@jwt_required()
def get_report(report_id):
    if report_id not in reports:
        return jsonify({'error': 'Report not found'}), 404
    
    return jsonify(reports[report_id]), 200 