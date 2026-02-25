# Gmail SMTP Setup Guide for Password Reset Emails

## Step 1: Enable 2-Step Verification on Gmail

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Under "Signing in to Google", click **2-Step Verification**
4. Follow the steps to enable it

## Step 2: Generate App Password

1. After enabling 2-Step Verification, go back to **Security**
2. Under "Signing in to Google", click **App passwords**
3. Select app: **Mail**
4. Select device: **Other (Custom name)** → Type "HerAura Backend"
5. Click **Generate**
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

## Step 3: Configure Backend

1. Open `backend/.env` file
2. Update these values:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=abcdefghijklmnop
   ```
   (Remove spaces from app password)

## Step 4: Install Dependencies

```bash
cd backend
npm install
```

This will install `nodemailer` package.

## Step 5: Start Backend Server

```bash
npm start
```

Or use the batch file:
```bash
start-backend.bat
```

Server will run on: http://localhost:5000

## Step 6: Test Password Reset

1. Go to login page
2. Click "Forgot Password?"
3. Enter your email
4. Check your Gmail inbox for reset link

## Troubleshooting

### "Invalid credentials" error
- Make sure you're using App Password, not your regular Gmail password
- Remove all spaces from the app password
- Verify 2-Step Verification is enabled

### "Connection refused" error
- Make sure backend server is running
- Check if port 5000 is available
- Verify CORS is enabled in server.js

### Email not received
- Check spam/junk folder
- Verify email address is correct
- Check backend console for errors
- Make sure Gmail account is active

## Security Notes

- Never commit `.env` file to GitHub
- Keep your app password secure
- Use environment variables in production
- Consider using SendGrid/AWS SES for production

## Production Alternatives

For production, consider these services:
- **SendGrid**: 100 emails/day free
- **AWS SES**: $0.10 per 1000 emails
- **Mailgun**: 5000 emails/month free
- **Postmark**: 100 emails/month free

## Email Template

The reset email includes:
- HerAura branding
- Reset password button
- Clickable link
- 1-hour expiry notice
- Professional HTML design

## API Endpoint

```
POST http://localhost:5000/api/email/send-reset-link
Content-Type: application/json

{
  "email": "user@example.com",
  "resetLink": "http://localhost/auth-reset-password.html?token=abc123&email=user@example.com"
}
```

## Files Modified

1. `backend/src/routes/email.js` - Email route handler
2. `backend/server.js` - Added email route
3. `backend/package.json` - Added nodemailer dependency
4. `backend/.env` - Gmail credentials
5. `auth-forgot-password.html` - API integration

---

**Need Help?** Check the backend console for detailed error messages.
