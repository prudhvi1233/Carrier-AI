import json
import logging
import uuid
import google.generativeai as genai
from sqlalchemy.orm import Session
from app.config.config import get_settings
from app.models.profile import Profile
from app.models.resume import Resume
from app.models.analysis import Analysis
from app.models.interview import InterviewSession
from app.models.parsed_resume import ParsedResume

logger = logging.getLogger(__name__)
settings = get_settings()

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

class InterviewSimulatorService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemma-4-26b-a4b-it')

    def _clean_json(self, text: str) -> dict:
        start_idx = text.find('{')
        if start_idx == -1:
            raise ValueError(f"No JSON object found in response: {text[:100]}")
        
        brace_count = 0
        end_idx = -1
        for i in range(start_idx, len(text)):
            if text[i] == '{':
                brace_count += 1
            elif text[i] == '}':
                brace_count -= 1
                if brace_count == 0:
                    end_idx = i
                    break
                    
        if end_idx == -1:
            raise ValueError("Incomplete JSON object found.")
            
        json_str = text[start_idx:end_idx+1]
        import json
        return json.loads(json_str)

    def start_dynamic_session(self, db: Session, user_id: str, job_role: str, interview_type: str, difficulty: str, interviewer_persona: str):
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not set.")

        resume = db.query(Resume).filter(Resume.user_id == user_id, Resume.is_active == True).first()
        if not resume:
            resume = db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.uploaded_at.desc()).first()
            if not resume:
                raise ValueError("No uploaded resume found.")

        profile = db.query(Profile).filter(Profile.user_id == user_id).first()
        analysis = db.query(Analysis).filter(Analysis.resume_id == resume.id).first()
        parsed = db.query(ParsedResume).filter(ParsedResume.resume_id == resume.id).first()

        skills_ctx = profile.skills if profile and profile.skills else "Not provided"
        exp_ctx = parsed.experience if parsed and parsed.experience else "Not provided"

        profile_ctx = f"Skills: {skills_ctx}\nExperience: {exp_ctx}"
        analysis_ctx = f"Strengths: {', '.join(analysis.strengths) if analysis and analysis.strengths else 'None'}\nWeaknesses: {', '.join(analysis.weaknesses) if analysis and analysis.weaknesses else 'None'}"

        prompt = f"""
You are an expert AI Interviewer acting as a {interviewer_persona}. 
You are conducting a {difficulty} {interview_type} interview for the role of {job_role}.

Candidate Context:
Profile: {profile_ctx}
AI Analysis: {analysis_ctx}

CRITICAL RULES:
1. You must act exactly like a human HR professional. Do NOT sound robotic.
2. The interview follows this strict flow: Greeting -> Intro -> Behavioral -> Technical -> Project -> Situational -> HR -> Closing.
3. Your goal for this turn is to GREET the candidate naturally, introduce yourself, and ask the first question (e.g., "Tell me about yourself").

Return ONLY valid JSON matching this schema:
{{
  "ai_response": "string (spoken greeting and first question)",
  "question_category": "Greeting/Intro"
}}
"""
        logger.info(f"Starting dynamic {interview_type} interview for {job_role} as {interviewer_persona}")
        
        import time
        max_retries = 3
        retry_delay = 2
        data = None

        for attempt in range(max_retries):
            try:
                response = self.model.generate_content(prompt)
                logger.info(f"Gemini Response Text (Start Session):\n{response.text}")
                
                # Check for token usage if available in response
                usage = getattr(response, 'usage_metadata', None)
                if usage:
                    logger.info(f"Token Usage - Prompt: {usage.prompt_token_count}, Response: {usage.candidates_token_count}, Total: {usage.total_token_count}")

                data = self._clean_json(response.text)
                break # Success
            except Exception as e:
                error_msg = str(e)
                logger.error(f"Gemini API Error (Attempt {attempt+1}/{max_retries}): {error_msg}")
                if "429" in error_msg or "Quota exceeded" in error_msg:
                    logger.warning(f"Rate limit hit. Retrying in {retry_delay} seconds...")
                    time.sleep(retry_delay)
                    retry_delay *= 2 # Exponential backoff
                else:
                    raise ValueError(f"AI Generation failed: {error_msg}")
        
        if not data:
            raise ValueError("Failed to get a response from Gemini after multiple retries due to rate limiting or API errors. Please wait a moment and try again.")

        session_id = str(uuid.uuid4())
        
        initial_question = {
            "question": data.get("ai_response"),
            "category": data.get("question_category"),
            "turn": 1
        }
        
        new_session = InterviewSession(
            id=session_id,
            user_id=user_id,
            resume_id=resume.id,
            job_role=job_role,
            interview_type=interview_type,
            difficulty=difficulty,
            questions=[initial_question],
            answers=[],
            score=None,
            feedback=None
        )
        db.add(new_session)
        db.commit()
        db.refresh(new_session)
        
        return new_session

    def process_turn(self, db: Session, user_id: str, session_id: str, user_answer: str):
        session = db.query(InterviewSession).filter(InterviewSession.id == session_id, InterviewSession.user_id == user_id).first()
        if not session:
            raise ValueError("Session not found")
            
        questions = list(session.questions)
        answers = list(session.answers)
        
        if len(questions) == 0:
            raise ValueError("No questions have been asked yet.")
            
        current_question = questions[-1]["question"]
        
        # Build chat history for context
        history = ""
        for i in range(len(answers)):
            history += f"AI: {questions[i]['question']}\nCandidate: {answers[i]['answer']}\n\n"
        
        history += f"AI: {current_question}\nCandidate: {user_answer}\n\n"
        
        # Determine current stage based on turn number
        turn_num = len(questions)
        flow_stages = ["Greeting", "Intro", "Behavioral", "Technical", "Project", "Situational", "HR", "Closing"]
        target_stage = flow_stages[min(turn_num, len(flow_stages)-1)]

        prompt = f"""
You are an expert AI Interviewer acting as a real human HR manager or Senior Engineer.
You just received the candidate's answer to your last question.

CRITICAL INSTRUCTION: CONVERSATIONAL MEMORY
You MUST read the Conversation History below. NEVER repeat a question you have already asked. 
NEVER ignore the candidate's answer.

Conversation History:
{history}

Task:
1. Evaluate the candidate's LAST answer strictly on the rubrics provided.
2. Generate your next spoken response as a human interviewer based on these rules:
   - If the answer is WRONG: Politely explain why it is incorrect and ask the candidate to try again or clarify.
   - If the answer is PARTIALLY CORRECT: Acknowledge what they got right, and ask a deeper follow-up question to probe their knowledge.
   - If the answer is EXCELLENT: Praise it briefly (e.g., "That's a great example.", "Perfectly explained.") and move naturally to the next topic.
3. The next question should align with the current interview stage: {target_stage}. Do NOT repeat previous questions.
4. DO NOT use generic responses like "Interesting", "That's good", or "Let's move on." Naturally reference what they just said.

Return ONLY valid JSON matching this schema exactly:
{{
  "evaluation": {{
    "score": number (0-100),
    "grammar_score": number (0-100),
    "communication_score": number (0-100),
    "confidence_score": number (0-100),
    "technical_accuracy": number (0-100),
    "completeness": number (0-100),
    "star_method_usage": number (0-100),
    "professional_tone": number (0-100),
    "strengths": ["string"],
    "weaknesses": ["string"],
    "feedback": "string (Detailed explanation of scores)"
  }},
  "next_ai_response": "string (human-like reaction to their answer + the next question. DO NOT REPEAT QUESTIONS.)",
  "next_category": "string (e.g., {target_stage} or Follow-up)"
}}
"""
        logger.info(f"--- GENERATING NEXT INTERVIEW TURN ---")
        logger.info(f"Prompt sent to Gemini:\n{prompt}")

        import time
        max_retries = 3
        retry_delay = 2
        data = None

        for attempt in range(max_retries):
            try:
                response = self.model.generate_content(prompt)
                logger.info(f"Gemini Response Text:\n{response.text}")
                
                # Check for token usage if available in response
                usage = getattr(response, 'usage_metadata', None)
                if usage:
                    logger.info(f"Token Usage - Prompt: {usage.prompt_token_count}, Response: {usage.candidates_token_count}, Total: {usage.total_token_count}")
                else:
                    logger.info("Token Usage metadata not available in this response.")

                data = self._clean_json(response.text)
                break # Success
            except Exception as e:
                error_msg = str(e)
                logger.error(f"Gemini API Error (Attempt {attempt+1}/{max_retries}): {error_msg}")
                if "429" in error_msg or "Quota exceeded" in error_msg:
                    logger.warning(f"Rate limit hit. Retrying in {retry_delay} seconds...")
                    time.sleep(retry_delay)
                    retry_delay *= 2 # Exponential backoff
                else:
                    raise ValueError(f"AI Generation failed: {error_msg}")
        
        if not data:
            raise ValueError("Failed to get a response from Gemini after multiple retries due to rate limiting or API errors. Please wait a moment and try again.")

        eval_data = data.get("evaluation", {})
        
        # Save answer and evaluation
        answers.append({
            "answer": user_answer,
            "evaluation": eval_data,
            "turn": len(questions)
        })
        
        # Save next question
        next_question_str = data.get("next_ai_response")
        questions.append({
            "question": next_question_str,
            "category": data.get("next_category", "General"),
            "turn": len(questions) + 1
        })
        
        session.answers = answers
        session.questions = questions
        
        # Save to DB
        db.commit()
        db.refresh(session)
        
        return {
            "evaluation": eval_data,
            "next_question": next_question_str
        }

    def complete_dynamic_interview(self, db: Session, user_id: str, session_id: str):
        session = db.query(InterviewSession).filter(InterviewSession.id == session_id, InterviewSession.user_id == user_id).first()
        if not session:
            raise ValueError("Session not found")
            
        answers = session.answers
        if not answers:
            raise ValueError("No answers to evaluate")
            
        evals = [ans.get("evaluation", {}) for ans in answers]
        
        avg_score = sum(e.get("score", 0) for e in evals) // len(evals) if evals else 0
        avg_tech = sum(e.get("technical_accuracy", 0) for e in evals) // len(evals) if evals else 0
        avg_comm = sum(e.get("communication_score", 0) for e in evals) // len(evals) if evals else 0
        avg_conf = sum(e.get("confidence_score", 0) for e in evals) // len(evals) if evals else 0
        avg_gram = sum(e.get("grammar_score", 0) for e in evals) // len(evals) if evals else 0
        avg_prof = sum(e.get("professional_tone", 0) for e in evals) // len(evals) if evals else 0
        
        # Compile a final prompt to get a cohesive summary
        history = ""
        for i in range(len(answers)):
            history += f"Q: {session.questions[i]['question']}\nA: {answers[i]['answer']}\n\n"
            
        prompt = f"""
You are an expert AI Hiring Manager. Review this entire interview transcript and generate a final report.

Role: {session.job_role}
Average Metrics Computed:
- Tech: {avg_tech}
- Comm: {avg_comm}
- Conf: {avg_conf}
- Gram: {avg_gram}
- Prof: {avg_prof}

Transcript:
{history}

Return ONLY valid JSON matching this schema:
{{
  "overall_score": {avg_score},
  "communication": {avg_comm},
  "technical_skills": {avg_tech},
  "confidence": {avg_conf},
  "grammar": {avg_gram},
  "fluency": number (0-100),
  "professionalism": {avg_prof},
  "strengths": ["string"],
  "weaknesses": ["string"],
  "recommended_improvements": ["string"],
  "recommended_learning_topics": ["string"],
  "hiring_recommendation": "string (e.g. Hire, No Hire, Borderline)",
  "final_summary": "string (Detailed summary of their performance)"
}}
"""
        import time
        max_retries = 3
        retry_delay = 2
        report = None

        for attempt in range(max_retries):
            try:
                response = self.model.generate_content(prompt)
                logger.info(f"Gemini Response Text (Final Summary):\n{response.text}")
                
                usage = getattr(response, 'usage_metadata', None)
                if usage:
                    logger.info(f"Token Usage - Prompt: {usage.prompt_token_count}, Response: {usage.candidates_token_count}, Total: {usage.total_token_count}")
                    
                report = self._clean_json(response.text)
                break
            except Exception as e:
                error_msg = str(e)
                logger.error(f"Gemini API Error (Attempt {attempt+1}/{max_retries}): {error_msg}")
                if "429" in error_msg or "Quota exceeded" in error_msg:
                    logger.warning(f"Rate limit hit. Retrying in {retry_delay} seconds...")
                    time.sleep(retry_delay)
                    retry_delay *= 2
                else:
                    raise ValueError(f"AI Generation failed: {error_msg}")
                    
        if not report:
            raise ValueError("Failed to generate final report after multiple retries due to rate limits or API errors. Please wait and try again.")

        session.score = avg_score
        session.feedback = report
        db.commit()
        db.refresh(session)
        
        return session

interview_simulator_service = InterviewSimulatorService()
