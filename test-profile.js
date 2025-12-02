can we do somthing now// Quick test script for profile creation
const testProfile = async () => {
  const testData = {
    userId: `test-user-${Date.now()}`,
    email: 'test@example.com',
    name: 'Test Student',
    profile: {
      currentRole: 'Student',
      targetRole: 'Software Engineer',
      skills: ['JavaScript', 'React', 'Node.js'],
      experience: 'Freshman',
      location: 'San Francisco, CA',
      salaryExpectation: 120000,
    },
    isStudent: true,
    major: 'Computer Science',
    currentSemester: 3,
    graduationDate: '2025-05-15',
    studyGoalsPerWeek: 10,
    totalPoints: 0,
    currentStreak: 0,
    level: 1,
  };

  try {
    console.log('🧪 Testing profile creation...');
    console.log('Test data:', JSON.stringify(testData, null, 2));
    
    // Test 1: Create profile
    const createResponse = await fetch('http://localhost:3001/api/users/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      throw new Error(`Create failed: ${JSON.stringify(error)}`);
    }

    const createResult = await createResponse.json();
    console.log('✅ Profile created:', createResult);

    // Test 2: Get profile
    const getResponse = await fetch(`http://localhost:3001/api/users/profile/${testData.userId}`);
    
    if (!getResponse.ok) {
      throw new Error('Get profile failed');
    }

    const getResult = await getResponse.json();
    console.log('✅ Profile retrieved:', getResult);

    // Test 3: Update profile
    const updateResponse = await fetch(`http://localhost:3001/api/users/profile/${testData.userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        totalPoints: 100,
        currentStreak: 5,
        level: 2,
      }),
    });

    if (!updateResponse.ok) {
      throw new Error('Update profile failed');
    }

    const updateResult = await updateResponse.json();
    console.log('✅ Profile updated:', updateResult);

    console.log('\n🎉 All tests passed! Profile creation is working!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
};

testProfile();
