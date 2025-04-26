from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required
import os
import pandas as pd
from ..utils.file_handler import allowed_file, process_uploaded_file

bp = Blueprint('upload', __name__, url_prefix='/api/upload')

@bp.route('/file', methods=['POST'])
@jwt_required()
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed. Please upload a CSV file.'}), 400
        
        # Ensure upload directory exists
        os.makedirs(current_app.config['UPLOAD_FOLDER'], exist_ok=True)
        
        # Secure the filename and save the file
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Process the uploaded file
        df = process_uploaded_file(filepath)
        
        # Get basic statistics about the data
        stats = {
            'rows': len(df),
            'columns': list(df.columns),
            'sample_data': df.head().to_dict('records')
        }
        
        return jsonify({
            'message': 'File uploaded successfully',
            'filename': filename,
            'stats': stats
        }), 200
        
    except Exception as e:
        # Clean up the file if processing fails
        if 'filepath' in locals() and os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({'error': str(e)}), 500

@bp.route('/list', methods=['GET'])
@jwt_required()
def list_uploads():
    try:
        files = []
        upload_folder = current_app.config['UPLOAD_FOLDER']
        if not os.path.exists(upload_folder):
            return jsonify({'files': []}), 200
            
        for filename in os.listdir(upload_folder):
            if allowed_file(filename):
                filepath = os.path.join(upload_folder, filename)
                files.append({
                    'name': filename,
                    'size': os.path.getsize(filepath),
                    'uploaded_at': os.path.getctime(filepath)
                })
        
        return jsonify({'files': files}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/<filename>', methods=['DELETE'])
@jwt_required()
def delete_file(filename):
    try:
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], secure_filename(filename))
        if os.path.exists(filepath):
            os.remove(filepath)
            return jsonify({'message': 'File deleted successfully'}), 200
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500 