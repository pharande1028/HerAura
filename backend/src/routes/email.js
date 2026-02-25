const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Send password reset email
router.post('/send-reset-link', async (req, res) => {
  try {
    const { email, resetLink } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const mailOptions = {
      from: `"HerAura" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - HerAura',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f8f6f0 0%, #fff8e7 100%); padding: 30px; text-align: center;">
            <h1 style="font-family: 'Dancing Script', cursive; color: #8B4513; font-size: 2.5rem; margin: 0;">HerAura</h1>
            <p style="color: #666; margin-top: 5px;">Jewellery & Accessories</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              We received a request to reset your password. Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background: #d4a574; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #999; font-size: 0.9rem; margin-top: 20px;">
              Or copy and paste this link in your browser:<br>
              <a href="${resetLink}" style="color: #d4a574; word-break: break-all;">${resetLink}</a>
            </p>
            
            <p style="color: #999; font-size: 0.85rem; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              This link will expire in 1 hour. If you didn't request this, please ignore this email.
            </p>
          </div>
          
          <div style="background: #f5f5f5; padding: 20px; text-align: center; color: #999; font-size: 0.85rem;">
            <p>&copy; 2024 HerAura. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Reset link sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

module.exports = router;
