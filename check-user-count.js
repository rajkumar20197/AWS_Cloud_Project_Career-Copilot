#!/usr/bin/env node

/**
 * AWS Cognito User Count Checker
 * 
 * This script checks how many users are registered in your Cognito User Pool
 * 
 * Usage:
 * 1. Make sure you have AWS CLI configured with proper credentials
 * 2. Run: node check-user-count.js
 */

const { execSync } = require('child_process');

// Your Cognito User Pool ID from the config
const USER_POOL_ID = 'us-east-1_RbxnBYOCS';
const REGION = 'us-east-1';

console.log('🔍 Checking AWS Cognito User Pool Registration Count...\n');

try {
  // Method 1: Get total user count
  console.log('📊 Method 1: Total User Count');
  console.log('─'.repeat(50));
  
  const listUsersCommand = `aws cognito-idp list-users --user-pool-id ${USER_POOL_ID} --region ${REGION} --query "Users[].Username" --output json`;
  
  try {
    const result = execSync(listUsersCommand, { encoding: 'utf8' });
    const users = JSON.parse(result);
    
    console.log(`✅ Total Registered Users: ${users.length}`);
    
    if (users.length > 0) {
      console.log('\n👥 Registered Users:');
      users.forEach((username, index) => {
        console.log(`   ${index + 1}. ${username}`);
      });
    } else {
      console.log('   No users registered yet.');
    }
    
  } catch (error) {
    console.log('❌ Error getting user list:', error.message);
    console.log('💡 This might be due to missing AWS credentials or permissions.');
  }

  console.log('\n' + '─'.repeat(50));

  // Method 2: Get detailed user information
  console.log('\n📋 Method 2: Detailed User Information');
  console.log('─'.repeat(50));
  
  const detailedUsersCommand = `aws cognito-idp list-users --user-pool-id ${USER_POOL_ID} --region ${REGION} --output json`;
  
  try {
    const detailedResult = execSync(detailedUsersCommand, { encoding: 'utf8' });
    const detailedData = JSON.parse(detailedResult);
    
    console.log(`✅ Total Users: ${detailedData.Users.length}`);
    
    if (detailedData.Users.length > 0) {
      console.log('\n📊 User Status Breakdown:');
      
      const statusCounts = {};
      const creationDates = [];
      
      detailedData.Users.forEach(user => {
        // Count by status
        const status = user.UserStatus;
        statusCounts[status] = (statusCounts[status] || 0) + 1;
        
        // Collect creation dates
        creationDates.push(new Date(user.UserCreateDate));
        
        // Show user details
        const email = user.Attributes.find(attr => attr.Name === 'email')?.Value || 'No email';
        const emailVerified = user.Attributes.find(attr => attr.Name === 'email_verified')?.Value || 'false';
        
        console.log(`\n   👤 User: ${user.Username}`);
        console.log(`      📧 Email: ${email}`);
        console.log(`      ✅ Verified: ${emailVerified}`);
        console.log(`      📊 Status: ${status}`);
        console.log(`      📅 Created: ${new Date(user.UserCreateDate).toLocaleDateString()}`);
      });
      
      console.log('\n📈 Status Summary:');
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`   ${status}: ${count} users`);
      });
      
      // Show registration timeline
      if (creationDates.length > 0) {
        const sortedDates = creationDates.sort((a, b) => a - b);
        const firstUser = sortedDates[0];
        const lastUser = sortedDates[sortedDates.length - 1];
        
        console.log('\n📅 Registration Timeline:');
        console.log(`   First User: ${firstUser.toLocaleDateString()} ${firstUser.toLocaleTimeString()}`);
        console.log(`   Latest User: ${lastUser.toLocaleDateString()} ${lastUser.toLocaleTimeString()}`);
        
        // Users registered today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayUsers = creationDates.filter(date => date >= today).length;
        console.log(`   Registered Today: ${todayUsers} users`);
        
        // Users registered this week
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekUsers = creationDates.filter(date => date >= weekAgo).length;
        console.log(`   Registered This Week: ${weekUsers} users`);
      }
    }
    
  } catch (error) {
    console.log('❌ Error getting detailed user information:', error.message);
  }

  console.log('\n' + '─'.repeat(50));

  // Method 3: User Pool Statistics
  console.log('\n📊 Method 3: User Pool Statistics');
  console.log('─'.repeat(50));
  
  const poolStatsCommand = `aws cognito-idp describe-user-pool --user-pool-id ${USER_POOL_ID} --region ${REGION} --output json`;
  
  try {
    const statsResult = execSync(poolStatsCommand, { encoding: 'utf8' });
    const poolData = JSON.parse(statsResult);
    
    console.log(`✅ User Pool Name: ${poolData.UserPool.Name || 'Not set'}`);
    console.log(`📅 Created: ${new Date(poolData.UserPool.CreationDate).toLocaleDateString()}`);
    console.log(`📅 Last Modified: ${new Date(poolData.UserPool.LastModifiedDate).toLocaleDateString()}`);
    console.log(`🔧 Status: ${poolData.UserPool.Status}`);
    
    if (poolData.UserPool.EstimatedNumberOfUsers !== undefined) {
      console.log(`👥 Estimated Users: ${poolData.UserPool.EstimatedNumberOfUsers}`);
    }
    
  } catch (error) {
    console.log('❌ Error getting user pool statistics:', error.message);
  }

} catch (error) {
  console.error('❌ Script execution error:', error.message);
  console.log('\n💡 Troubleshooting:');
  console.log('   1. Make sure AWS CLI is installed: aws --version');
  console.log('   2. Configure AWS credentials: aws configure');
  console.log('   3. Check if you have Cognito permissions');
  console.log('   4. Verify the User Pool ID is correct');
}

console.log('\n' + '='.repeat(60));
console.log('🎯 User Pool Information:');
console.log(`   User Pool ID: ${USER_POOL_ID}`);
console.log(`   Region: ${REGION}`);
console.log(`   Client ID: 5a6kq9althf2te07sv157a26so`);
console.log('='.repeat(60));