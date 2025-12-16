// Test AWS Connection and DynamoDB Access
// Run with: node backend/test-aws-connection.js

require('dotenv').config({ path: './backend/.env' });
const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

console.log('🧪 Testing AWS Connection...\n');

// Test 1: Check environment variables
console.log('📋 Step 1: Checking environment variables...');
console.log('✓ AWS_REGION:', process.env.AWS_REGION);
console.log('✓ AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '***' + process.env.AWS_ACCESS_KEY_ID.slice(-4) : '❌ MISSING');
console.log('✓ AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '***' + process.env.AWS_SECRET_ACCESS_KEY.slice(-4) : '❌ MISSING');
console.log('✓ DYNAMODB_USERS_TABLE:', process.env.DYNAMODB_USERS_TABLE);
console.log('');

// Test 2: Create DynamoDB client
console.log('📋 Step 2: Creating DynamoDB client...');
const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});
console.log('✅ DynamoDB client created successfully\n');

// Test 3: List tables
async function testConnection() {
    try {
        console.log('📋 Step 3: Testing AWS credentials by listing tables...');
        const command = new ListTablesCommand({});
        const response = await client.send(command);

        console.log('✅ AWS credentials are valid!\n');
        console.log('📊 Found', response.TableNames.length, 'DynamoDB tables:');
        response.TableNames.forEach(table => {
            const isOurs = table.includes('ai-career-agent');
            console.log(isOurs ? '  ✅' : '  -', table);
        });
        console.log('');

        // Test 4: Check our specific tables
        console.log('📋 Step 4: Verifying our tables exist...');
        const ourTables = [
            process.env.DYNAMODB_USERS_TABLE,
            process.env.DYNAMODB_JOBS_TABLE,
            process.env.DYNAMODB_APPLICATIONS_TABLE,
            process.env.DYNAMODB_INTERVIEWS_TABLE
        ];

        let allTablesExist = true;
        for (const tableName of ourTables) {
            const exists = response.TableNames.includes(tableName);
            console.log(exists ? '  ✅' : '  ❌', tableName);
            if (!exists) allTablesExist = false;
        }
        console.log('');

        if (allTablesExist) {
            console.log('🎉 SUCCESS! All tests passed!');
            console.log('');
            console.log('✅ AWS credentials are valid');
            console.log('✅ DynamoDB connection working');
            console.log('✅ All 4 tables exist');
            console.log('');
            console.log('🚀 You\'re ready to start building the backend!');
        } else {
            console.log('⚠️  Some tables are missing. Please create them in AWS Console.');
        }

    } catch (error) {
        console.log('❌ ERROR:', error.message);
        console.log('');

        if (error.name === 'InvalidSignatureException') {
            console.log('🔍 Issue: Invalid AWS credentials');
            console.log('💡 Solution: Check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env');
        } else if (error.name === 'UnrecognizedClientException') {
            console.log('🔍 Issue: AWS credentials not recognized');
            console.log('💡 Solution: Verify your AWS access keys are correct');
        } else if (error.name === 'CredentialsProviderError') {
            console.log('🔍 Issue: Missing AWS credentials');
            console.log('💡 Solution: Make sure .env file has AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY');
        } else {
            console.log('🔍 Unexpected error. Please check your AWS configuration.');
        }
    }
}

testConnection();
