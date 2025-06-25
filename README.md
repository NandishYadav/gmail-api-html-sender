# 📧 Gmail API HTML Email Sender

Send beautiful HTML emails directly from your Gmail account using the Gmail API and OAuth2 — with your name, profile picture, and UTF-8-safe subject lines.

This project is ideal for sending branded, personalized emails securely via your Google account — perfect for alerts, onboarding messages, marketing emails, and more.

---

## ✨ Features

- ✅ Send HTML-formatted emails from file or string
- ✅ Uses official Gmail API (not SMTP or app password)
- ✅ OAuth2 authentication with token reuse
- ✅ UTF-8-safe subject line (supports emojis, em-dashes, etc.)
- ✅ Sends from your real Gmail identity (name + profile picture)
- ✅ Simple CLI-based Node.js script


## 🔧 Setup

1. Enable Gmail API at [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth credentials (Desktop app)
3. Download `credentials.json` to project root
4. Install dependencies:

   ```bash
   npm install 
   npm run start
   ```

## Note

1. You’re using the OAuth “Desktop App” setup.
2. The redirect URI is set to something like http://localhost or urn:ietf:wg:oauth:2.0:oob (or it's just not actually listening for the redirect).
3. Google tries to redirect you back to the app — but since your Node.js app isn't running a web server to receive that redirect, it fails.

## ✅ Fix and What You Should Do

- http://localhost:port/?code=4%2F0AX...&scope=https://www.googleapis.com/auth/gmail.send
- Copy the code=... portion (everything after code= and before &scope=).
- Go back to your terminal — the app should be waiting with this prompt: Enter the code from that page here:
- Paste the code, hit Enter — it will save the token and send your email
 