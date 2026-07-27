# AI Career Platform Backend

A clean, modular, and production-ready backend foundation for the AI Career Platform.

## Folder Structure

```
backend/
├── app/
│   ├── api/          # API routers and endpoints
│   ├── config/       # Environment and application configuration
│   ├── core/         # Core application logic (e.g., security, deps)
│   ├── database/     # Database setup and connection
│   ├── models/       # SQLAlchemy ORM models
│   ├── prompts/      # AI Prompts
│   ├── schemas/      # Pydantic validation schemas
│   ├── services/     # Business logic
│   ├── static/       # Static files
│   ├── uploads/      # Uploaded files
│   ├── utils/        # Utility functions
│   ├── __init__.py
│   └── main.py       # FastAPI application entry point
├── .env
├── .gitignore
├── README.md
└── requirements.txt
```

## Installation

### 1. Create a Virtual Environment
```bash
python -m venv venv
```

### 2. Activate the Virtual Environment
- **Windows:** `venv\Scripts\activate`
- **Mac/Linux:** `source venv/bin/activate`

### 3. Install Requirements
```bash
pip install -r requirements.txt
```

## Running the Backend

Run the server using Uvicorn with hot-reload enabled:
```bash
uvicorn app.main:app --reload
```

## API Documentation
Once running, interactive API documentation is available at:
- **Swagger UI:** `http://127.0.0.1:8000/docs`
- **ReDoc:** `http://127.0.0.1:8000/redoc`
