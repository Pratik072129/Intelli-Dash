# IntelliDash: Smart Insights & Analytics Platform

IntelliDash is a comprehensive data analytics platform that combines machine learning, natural language processing, and data visualization to provide intelligent insights from your data.

## Features

- 📊 Interactive Dashboard with KPIs and Charts
- 🤖 AI-Powered Data Analysis and Q&A
- 📈 Machine Learning Predictions
- 📄 Automated PDF Report Generation
- 🔐 Secure User Authentication
- 📁 Easy CSV Data Upload

## Tech Stack

- **Frontend**: React.js + Tailwind CSS
- **Backend**: Flask (Python)
- **Machine Learning**: Scikit-learn, pandas
- **AI Chat**: LangChain + OpenAI
- **Data Visualization**: Chart.js / Recharts
- **Authentication**: JWT
- **PDF Generation**: FPDF / pdfkit

## Project Structure

```
IntelliDash/
├── client/          # Frontend - React
├── server/          # Backend - Flask
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Docker (optional)

### Installation

1. Clone the repository
2. Set up the frontend:
   ```bash
   cd client
   npm install
   ```

3. Set up the backend:
   ```bash
   cd server
   pip install -r requirements.txt
   ```

4. Create `.env` files in both client and server directories with necessary environment variables

5. Start the development servers:
   - Frontend: `cd client && npm start`
   - Backend: `cd server && python app/main.py`

## License

MIT # Intelli-Dash
