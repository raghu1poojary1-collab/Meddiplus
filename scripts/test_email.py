#!/usr/bin/env python3
"""
MediPulse — Gmail SMTP Dispatcher Test Utility
Tests SMTP connectivity and sends a test recovery email to verify configuration.
Usage: python scripts/test_email.py [recipient_email]
"""
import os
import sys
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

def test_smtp(target_email=None):
    smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com").strip()
    smtp_port = int(os.environ.get("SMTP_PORT", 587))
    smtp_user = os.environ.get("SMTP_USER", "raghu1poojary1@gmail.com").strip()
    smtp_pass = os.environ.get("SMTP_PASSWORD", "").strip().replace(" ", "")
    from_name = os.environ.get("SMTP_FROM_NAME", "MediPulse Healthcare System").strip()

    recipient = (target_email or smtp_user).strip()

    print("=" * 65)
    print("MediPulse — Real-Time Gmail SMTP Delivery Verifier")
    print("=" * 65)
    print(f"SMTP Host:     {smtp_host}:{smtp_port}")
    print(f"Sender:        {from_name} <{smtp_user}>")
    print(f"Recipient:     {recipient}")
    print(f"App Password:  {'[Configured - ' + str(len(smtp_pass)) + ' chars]' if smtp_pass else '[NOT SET in .env]'}")
    print("-" * 65)

    if not smtp_pass:
        print("\n[!] NOTICE: Google App Password is not yet configured in .env.")
        print("\nTo enable 100% automated Gmail recovery emails directly into inboxes:")
        print("  1. Open: https://myaccount.google.com/apppasswords")
        print("     (Make sure 2-Step Verification is active on your Google account)")
        print("  2. Enter 'MedPulse' as the app name and click 'Create'.")
        print("  3. Copy the 16-character code (e.g. 'abcd efgh ijkl mnop').")
        print("  4. Open .env in your project and set:")
        print("     SMTP_USER=raghu1poojary1@gmail.com")
        print("     SMTP_PASSWORD=abcdefghijklmnop")
        print("  5. Re-run this script to test instant delivery!\n")
        print("=" * 65)
        return False

    print("Step 1: Connecting to smtp.gmail.com on port 587...")
    try:
        server = smtplib.SMTP(smtp_host, smtp_port, timeout=12)
        server.ehlo()
        print("  ✓ Connected successfully!")

        print("Step 2: Starting TLS encryption...")
        server.starttls()
        server.ehlo()
        print("  ✓ TLS handshake successful!")

        print(f"Step 3: Authenticating as {smtp_user}...")
        server.login(smtp_user, smtp_pass)
        print("  ✓ Google SMTP Authentication successful!")

        print(f"Step 4: Dispatching recovery email to {recipient}...")
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "MediPulse Password Recovery: Your Temporary Passkey [MedPulse#7482]"
        msg["From"] = f"{from_name} <{smtp_user}>"
        msg["To"] = recipient

        text = f"""Hello,

This is a test password recovery email from MediPulse Healthcare System.
Your temporary recovery passkey: MedPulse#7482

Valid for 15 minutes.
Sign in at: http://localhost:3000/login.html
"""
        html = f"""<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #f6f6f2; padding: 24px;">
  <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 28px; border-radius: 14px; border: 1px solid #e2ded5;">
    <h2 style="color: #12312e; margin-top: 0;">Medi<span style="color: #e8622c;">Pulse</span> Recovery Email</h2>
    <p style="color: #4b5563;">Your temporary recovery passkey:</p>
    <div style="background: #fdfaf6; border: 2px dashed #e8622c; border-radius: 10px; padding: 16px; text-align: center; font-size: 24px; font-weight: bold; color: #e8622c; letter-spacing: 2px;">
      MedPulse#7482
    </div>
    <p style="color: #6b7280; font-size: 13px; margin-top: 18px;">Valid for 15 minutes. Log in to your MediPulse dashboard.</p>
  </div>
</body>
</html>"""
        msg.attach(MIMEText(text, "plain"))
        msg.attach(MIMEText(html, "html"))

        server.send_message(msg)
        server.quit()

        print(f"\n[SUCCESS] Recovery email sent to {recipient}'s Gmail inbox! Check your inbox now.")
        print("=" * 65)
        return True

    except smtplib.SMTPAuthenticationError as e:
        print(f"\n[ERROR] Authentication failed: {e}")
        print("Tip: Ensure you are using a 16-character Google 'App Password', not your personal login password.")
        print("Generate one here: https://myaccount.google.com/apppasswords")
        return False
    except Exception as e:
        print(f"\n[ERROR] Failed to send email: {e}")
        return False

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else None
    test_smtp(target)
