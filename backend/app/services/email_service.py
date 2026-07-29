import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config.config import get_settings

settings = get_settings()

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587

def send_reset_email(to_email: str, reset_link: str):
    if not settings.SMTP_EMAIL or not settings.SMTP_PASSWORD:
        print("Warning: SMTP_EMAIL or SMTP_PASSWORD not set. Cannot send real email.")
        return False
        
    try:
        msg = MIMEMultipart()
        msg['From'] = settings.SMTP_EMAIL
        msg['To'] = to_email
        msg['Subject'] = "Reset your CareerAI Password"
        
        # HTML Email Template
        html = f"""
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f5; padding: 20px;">
            <div style="max-w-md mx-auto; background-color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <h2 style="color: #111827; text-align: center;">CareerAI Password Reset</h2>
              <p style="color: #4b5563; font-size: 16px;">We received a request to reset your password. Click the button below to choose a new one:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{reset_link}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Reset Password</a>
              </div>
              <p style="color: #6b7280; font-size: 14px;">If you did not request this, please ignore this email. This link will expire in 15 minutes.</p>
            </div>
          </body>
        </html>
        """
        
        msg.attach(MIMEText(html, 'html'))
        
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_EMAIL, settings.SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False
