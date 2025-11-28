import nodemailer from 'nodemailer';
import 'dotenv/config';

const {
    EMAIL_USER,
    EMAIL_CLIENT_ID,
    EMAIL_CLIENT_SECRET,
    EMAIL_REFRESH_TOKEN
} = process.env;

console.log('Testing email configuration...');
console.log('Email User:', EMAIL_USER);
console.log('Client ID:', EMAIL_CLIENT_ID ? 'Present' : 'Missing');
console.log('Client Secret:', EMAIL_CLIENT_SECRET ? 'Present' : 'Missing');
console.log('Refresh Token:', EMAIL_REFRESH_TOKEN ? 'Present' : 'Missing');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: EMAIL_USER,
        clientId: EMAIL_CLIENT_ID,
        clientSecret: EMAIL_CLIENT_SECRET,
        refreshToken: EMAIL_REFRESH_TOKEN,
    },
});

// Verify the connection
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Configuration error:', error);
        if (error.code === 'EAUTH') {
            console.log('\n💡 Possible solutions:');
            console.log('1. Generate a new refresh token using OAuth2 Playground');
            console.log('2. Check that redirect URI matches in Google Cloud Console');
            console.log('3. Ensure Gmail API is enabled');
        }
    } else {
        console.log('✅ Email configuration is valid!');
    }
});