import re
from typing import Dict, Optional
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def validate_email(email: str) -> bool:
    """
    Validate email format.
    
    Args:
        email (str): Email address to validate
        
    Returns:
        bool: True if email is valid, False otherwise
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_password(password: str) -> bool:
    """
    Validate password strength.
    
    Args:
        password (str): Password to validate
        
    Returns:
        bool: True if password meets requirements, False otherwise
    """
    # At least 8 characters
    return len(password) >= 8

def create_user(email: str, password: str) -> Dict:
    """
    Create a new user with hashed password.
    
    Args:
        email (str): User's email
        password (str): User's password
        
    Returns:
        Dict: User data
    """
    if not validate_email(email):
        raise ValueError("Invalid email format")
    if not validate_password(password):
        raise ValueError("Password does not meet requirements")
    
    return {
        'email': email,
        'password_hash': generate_password_hash(password)
    }

def verify_password(password_hash: str, password: str) -> bool:
    """
    Verify a password against its hash.
    
    Args:
        password_hash (str): Hashed password
        password (str): Password to verify
        
    Returns:
        bool: True if password matches hash, False otherwise
    """
    return check_password_hash(password_hash, password)

def generate_token(user_data: Dict) -> str:
    """
    Generate a JWT token for a user.
    
    Args:
        user_data (Dict): User data to include in token
        
    Returns:
        str: JWT token
    """
    return create_access_token(identity=user_data['email'])

def get_user_from_token(token: str) -> Optional[Dict]:
    """
    Extract user data from a JWT token.
    
    Args:
        token (str): JWT token
        
    Returns:
        Optional[Dict]: User data if token is valid, None otherwise
    """
    try:
        # This is a placeholder. In a real implementation, you would:
        # 1. Verify the token
        # 2. Extract the user data
        # 3. Return the user data
        return None
    except Exception as e:
        logger.error(f"Error extracting user from token: {str(e)}")
        return None 