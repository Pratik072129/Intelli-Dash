import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import joblib
import os

def generate_sample_data(n_samples=1000):
    """Generate sample data for demonstration."""
    np.random.seed(42)
    
    # Generate features
    X = pd.DataFrame({
        'feature1': np.random.normal(0, 1, n_samples),
        'feature2': np.random.normal(0, 1, n_samples),
        'feature3': np.random.normal(0, 1, n_samples),
        'feature4': np.random.normal(0, 1, n_samples)
    })
    
    # Generate target (binary classification)
    y = ((X['feature1'] + X['feature2'] + X['feature3'] + X['feature4']) > 0).astype(int)
    
    return X, y

def train_and_save_model():
    """Train a model and save it with associated metadata."""
    # Generate sample data
    X, y = generate_sample_data()
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale the features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train the model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate the model
    train_score = model.score(X_train_scaled, y_train)
    test_score = model.score(X_test_scaled, y_test)
    print(f"Training accuracy: {train_score:.4f}")
    print(f"Testing accuracy: {test_score:.4f}")
    
    # Prepare model data for saving
    model_data = {
        'model': model,
        'scaler': scaler,
        'feature_names': X.columns.tolist(),
        'metadata': {
            'training_accuracy': train_score,
            'testing_accuracy': test_score,
            'n_features': X.shape[1],
            'feature_names': X.columns.tolist()
        }
    }
    
    # Save the model
    model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
    joblib.dump(model_data, model_path)
    print(f"Model saved to {model_path}")

if __name__ == '__main__':
    train_and_save_model() 