# IntelliDash Server

This is the backend server for the IntelliDash platform, built with Flask.

## Features

- RESTful API endpoints
- JWT-based authentication
- File upload and processing
- Machine learning predictions
- AI-powered data analysis
- PDF report generation

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file with your configuration (see `.env.example`)

4. Run the development server:
   ```bash
   python app/main.py
   ```

## API Endpoints

### Authentication
- POST `/auth/register` - Register a new user
- POST `/auth/login` - Login and get JWT token

### Data Management
- POST `/upload` - Upload CSV file
- GET `/data` - Get processed data
- POST `/predict` - Get ML predictions

### AI Features
- POST `/chat` - Ask questions about your data
- GET `/report` - Generate PDF report

## Development

The server uses Flask blueprints to organize routes:
- `auth_routes.py` - Authentication endpoints
- `upload_routes.py` - File upload handling
- `predict_routes.py` - ML predictions
- `data_routes.py` - Data management
- `chat_routes.py` - AI chat functionality
- `report_routes.py` - PDF report generation

## Testing

Run tests with:
```bash
python -m pytest
``` 