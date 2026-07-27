# CareerAI - AI Career Management Platform

CareerAI is an enterprise-quality, AI-powered platform for intelligent resume management, career tracking, and mock interviews. Built with React (Vite) and FastAPI.

## Features

- **AI Resume Builder & Parser**: Upload and instantly parse your resume with deep AI insights.
- **ATS Score Analytics**: Track how your resume stands against automated screening.
- **AI Job Recommendations**: Get intelligent matches based on your skills and experience.
- **AI Interview Mentor**: Practice real-time mock interviews with an AI assistant.
- **Goal & Application Tracker**: Manage your job hunt in an intuitive dashboard.
- **Enterprise Ready**: Postgres integration, Alembic migrations, Slowapi rate limiting, and Loguru logging.

## Tech Stack

**Frontend**:
- React 18, Vite, React Router
- TailwindCSS, Framer Motion for beautiful UI/UX
- Recharts for analytics
- Vitest for testing

**Backend**:
- Python 3.10+, FastAPI
- SQLAlchemy, Alembic, PostgreSQL
- Slowapi (Rate limiting)
- Loguru (Structured Logging)
- Pytest for testing
- Google Gemini AI integration

## Quick Start (Docker)

To run the entire stack locally in production mode:

```bash
# Provide your Gemini API key
export GEMINI_API_KEY="your-key-here"

# Start the stack
docker-compose up --build
```
Frontend will be available at `http://localhost`, Backend API at `http://localhost:8000`.

## Local Development Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Or venv\Scripts\activate on Windows
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend
```bash
cd ai-resume-checker
npm install
npm run dev
```

## Running Tests
- **Frontend**: `npm run test`
- **Backend**: `pytest`

## License
MIT License