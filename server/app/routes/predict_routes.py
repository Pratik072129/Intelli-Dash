from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
import pandas as pd
import joblib
import os
from ..ml.predictor import make_prediction

bp = Blueprint('predict', __name__, url_prefix='/api/predict')

@bp.route('/model-info', methods=['GET'])
@jwt_required()
def get_model_info():
    try:
        model_path = current_app.config['ML_MODEL_PATH']
        if not os.path.exists(model_path):
            return jsonify({'error': 'Model not found'}), 404
        
        model = joblib.load(model_path)
        return jsonify({
            'model_type': type(model).__name__,
            'features': model.feature_names_in_.tolist() if hasattr(model, 'feature_names_in_') else [],
            'last_updated': os.path.getmtime(model_path)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/predict', methods=['POST'])
@jwt_required()
def predict():
    try:
        data = request.get_json()
        if not data or 'features' not in data:
            return jsonify({'error': 'No features provided'}), 400
        
        # Convert features to DataFrame
        features = pd.DataFrame([data['features']])
        
        # Make prediction
        prediction = make_prediction(features)
        
        return jsonify({
            'prediction': prediction.tolist(),
            'confidence': None  # Add confidence scores if available
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/batch-predict', methods=['POST'])
@jwt_required()
def batch_predict():
    try:
        data = request.get_json()
        if not data or 'features_list' not in data:
            return jsonify({'error': 'No features list provided'}), 400
        
        # Convert features to DataFrame
        features = pd.DataFrame(data['features_list'])
        
        # Make predictions
        predictions = make_prediction(features)
        
        return jsonify({
            'predictions': predictions.tolist(),
            'count': len(predictions)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500 