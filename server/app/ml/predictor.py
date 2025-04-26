import joblib
import pandas as pd
import numpy as np
from typing import Union, List, Dict
import logging
from sklearn.preprocessing import StandardScaler

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Predictor:
    def __init__(self, model_path: str):
        """
        Initialize the predictor with a trained model.
        
        Args:
            model_path (str): Path to the trained model file
        """
        self.model_path = model_path
        self.model = None
        self.scaler = None
        self.feature_names = None
        self._load_model()
    
    def _load_model(self) -> None:
        """
        Load the trained model and associated scaler from disk.
        """
        try:
            # Load the model and scaler
            model_data = joblib.load(self.model_path)
            
            if isinstance(model_data, dict):
                self.model = model_data['model']
                self.scaler = model_data['scaler']
                self.feature_names = model_data['feature_names']
            else:
                self.model = model_data
                self.scaler = StandardScaler()  # Default scaler if none provided
            
            logger.info(f"Model loaded successfully: {type(self.model).__name__}")
            
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise
    
    def preprocess_data(self, data: pd.DataFrame) -> pd.DataFrame:
        """
        Preprocess the input data for prediction.
        
        Args:
            data (pd.DataFrame): Input data to preprocess
            
        Returns:
            pd.DataFrame: Preprocessed data
        """
        try:
            # Ensure all required features are present
            if self.feature_names is not None:
                missing_features = set(self.feature_names) - set(data.columns)
                if missing_features:
                    raise ValueError(f"Missing required features: {missing_features}")
                data = data[self.feature_names]
            
            # Scale the data if a scaler is available
            if self.scaler is not None:
                data = pd.DataFrame(
                    self.scaler.transform(data),
                    columns=data.columns
                )
            
            return data
            
        except Exception as e:
            logger.error(f"Error preprocessing data: {str(e)}")
            raise
    
    def predict(self, data: Union[pd.DataFrame, Dict, List[Dict]]) -> np.ndarray:
        """
        Make predictions using the loaded model.
        
        Args:
            data: Input data for prediction
            
        Returns:
            np.ndarray: Model predictions
        """
        try:
            # Convert input to DataFrame if necessary
            if isinstance(data, (dict, list)):
                data = pd.DataFrame(data)
            
            # Preprocess the data
            processed_data = self.preprocess_data(data)
            
            # Make predictions
            predictions = self.model.predict(processed_data)
            
            # Get prediction probabilities if available
            if hasattr(self.model, 'predict_proba'):
                probabilities = self.model.predict_proba(processed_data)
                return predictions, probabilities
                
            return predictions
            
        except Exception as e:
            logger.error(f"Error making predictions: {str(e)}")
            raise

# Global predictor instance
_predictor = None

def init_predictor(model_path: str) -> None:
    """
    Initialize the global predictor instance.
    
    Args:
        model_path (str): Path to the trained model file
    """
    global _predictor
    _predictor = Predictor(model_path)

def make_prediction(data: Union[pd.DataFrame, Dict, List[Dict]]) -> np.ndarray:
    """
    Make predictions using the global predictor instance.
    
    Args:
        data: Input data for prediction
        
    Returns:
        np.ndarray: Model predictions
    """
    if _predictor is None:
        raise RuntimeError("Predictor not initialized. Call init_predictor first.")
    
    return _predictor.predict(data) 