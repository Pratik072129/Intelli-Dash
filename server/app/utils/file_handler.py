import os
import pandas as pd
from typing import Tuple, Dict, Any
import logging
from werkzeug.utils import secure_filename

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def allowed_file(filename: str) -> bool:
    """
    Check if the file extension is allowed.
    
    Args:
        filename (str): Name of the file
        
    Returns:
        bool: True if file extension is allowed, False otherwise
    """
    ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_uploaded_file(filepath: str) -> pd.DataFrame:
    """
    Process an uploaded file and return a DataFrame.
    
    Args:
        filepath (str): Path to the uploaded file
        
    Returns:
        pd.DataFrame: Processed data
    """
    try:
        # Get file extension
        _, ext = os.path.splitext(filepath)
        ext = ext.lower()
        
        # Read file based on extension
        if ext == '.csv':
            df = pd.read_csv(filepath)
        elif ext in ['.xlsx', '.xls']:
            df = pd.read_excel(filepath)
        else:
            raise ValueError(f"Unsupported file type: {ext}")
        
        # Basic data cleaning
        df = df.dropna(how='all')  # Drop rows that are all NA
        df = df.fillna(method='ffill')  # Forward fill missing values
        
        return df
        
    except Exception as e:
        logger.error(f"Error processing file {filepath}: {str(e)}")
        raise

def get_file_stats(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Get basic statistics about a DataFrame.
    
    Args:
        df (pd.DataFrame): DataFrame to analyze
        
    Returns:
        Dict[str, Any]: Statistics about the data
    """
    stats = {
        'rows': len(df),
        'columns': len(df.columns),
        'column_types': df.dtypes.astype(str).to_dict(),
        'missing_values': df.isnull().sum().to_dict(),
        'numeric_stats': {}
    }
    
    # Add statistics for numeric columns
    numeric_cols = df.select_dtypes(include=['number']).columns
    for col in numeric_cols:
        stats['numeric_stats'][col] = {
            'mean': df[col].mean(),
            'std': df[col].std(),
            'min': df[col].min(),
            'max': df[col].max()
        }
    
    return stats

def save_processed_data(df: pd.DataFrame, output_path: str) -> str:
    """
    Save processed data to a file.
    
    Args:
        df (pd.DataFrame): Data to save
        output_path (str): Path to save the file
        
    Returns:
        str: Path to the saved file
    """
    try:
        # Ensure directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Save based on file extension
        _, ext = os.path.splitext(output_path)
        if ext == '.csv':
            df.to_csv(output_path, index=False)
        elif ext in ['.xlsx', '.xls']:
            df.to_excel(output_path, index=False)
        else:
            raise ValueError(f"Unsupported output format: {ext}")
        
        return output_path
        
    except Exception as e:
        logger.error(f"Error saving processed data: {str(e)}")
        raise 