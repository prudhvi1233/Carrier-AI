import json
import logging
from app.models.user import User
import google.generativeai as genai
from app.config.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)

class AnalyticsService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-3.5-flash')
        else:
            self.model = None

    async def generate_insights(self, user: User, activities: list):
        if not self.model:
            return ["Configure Gemini API key to see AI insights."]

        activity_text = "\n".join([f"- {a.type}: {a.description}" for a in activities]) if activities else "No recent activities."

        prompt = f"""
        You are an AI Career Coach. Analyze the user's recent activity and provide 3-4 short, actionable weekly insights.
        User Activity:
        {activity_text}
        
        Return exactly a JSON array of strings. Each string is a short insight (max 15 words).
        Example: ["Your ATS score improved by 12%.", "You learned 4 new skills.", "You haven't applied to jobs this week."]
        """
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith("```json"):
                text = text.split("```json")[1].split("```")[0].strip()
            elif text.startswith("```"):
                text = text.split("```")[1].split("```")[0].strip()
                
            return json.loads(text)
        except Exception as e:
            logger.error(f"Insight generation error: {e}")
            return [
                "Keep uploading your latest resume versions to track ATS improvements.",
                "Review the Job Match page to find roles suited to your skills.",
                "Practice your interview skills using the AI Mentor."
            ]

analytics_service = AnalyticsService()
