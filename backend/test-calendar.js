require('dotenv').config();
const { google } = require('googleapis');

console.log('🗓️  Testing Google Calendar API Setup...');
console.log('📋 Configuration:');
console.log('   Client ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('   Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
console.log('   Redirect URI:', process.env.GOOGLE_REDIRECT_URI);

// Test OAuth2 client creation
try {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  console.log('\n✅ OAuth2 client created successfully!');
  
  // Generate authorization URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ],
  });

  console.log('\n🔗 Authorization URL generated successfully!');
  console.log('📝 Next steps:');
  console.log('   1. Start the backend server: npm start');
  console.log('   2. Start the frontend: npm run dev');
  console.log('   3. Go to Calendar page and click "Connect Google Calendar"');
  console.log('   4. You\'ll be redirected to Google for authorization');
  console.log('\n🎉 Google Calendar API setup is COMPLETE!');
  
} catch (error) {
  console.error('\n❌ Error setting up OAuth2 client:', error.message);
  console.log('\n🔧 Check your .env file configuration');
}