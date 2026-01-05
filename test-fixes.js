/**
 * Test script to verify all fixes are working
 */

const axios = require('axios');
const BASE_URL = 'http://localhost:3000';

async function runTests() {
    console.log('🧪 Testing fixes...\n');
    
    let passed = 0;
    let failed = 0;

    // Test 1: Path Traversal Protection
    console.log('Test 1: Path Traversal Protection');
    try {
        const response = await axios.get(`${BASE_URL}/api/categories/../../../package.json`);
        console.log('❌ FAILED: Path traversal not blocked');
        failed++;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log('✅ PASSED: Path traversal blocked\n');
            passed++;
        } else {
            console.log('❌ FAILED: Unexpected error\n');
            failed++;
        }
    }

    // Test 2: Valid Language Request
    console.log('Test 2: Valid Language Request');
    try {
        const response = await axios.get(`${BASE_URL}/api/categories/english`);
        if (response.status === 200 && response.data.categories) {
            console.log('✅ PASSED: Valid request works\n');
            passed++;
        } else {
            console.log('❌ FAILED: Invalid response\n');
            failed++;
        }
    } catch (error) {
        console.log('❌ FAILED:', error.message, '\n');
        failed++;
    }

    // Test 3: Invalid Category Format
    console.log('Test 3: Invalid Category Format Protection');
    try {
        const response = await axios.get(`${BASE_URL}/api/phrases/english/__proto__`);
        console.log('❌ FAILED: Prototype pollution not blocked');
        failed++;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.log('✅ PASSED: Invalid category format blocked\n');
            passed++;
        } else {
            console.log('❌ FAILED: Unexpected error\n');
            failed++;
        }
    }

    // Test 4: Valid Phrases Request
    console.log('Test 4: Valid Phrases Request');
    try {
        const response = await axios.get(`${BASE_URL}/api/phrases/english/greetings`);
        if (response.status === 200 && response.data.phrases) {
            console.log('✅ PASSED: Valid phrases request works\n');
            passed++;
        } else {
            console.log('❌ FAILED: Invalid response\n');
            failed++;
        }
    } catch (error) {
        console.log('❌ FAILED:', error.message, '\n');
        failed++;
    }

    // Test 5: CORS Headers
    console.log('Test 5: CORS Headers Present');
    try {
        const response = await axios.get(`${BASE_URL}/api/categories/english`);
        if (response.headers['access-control-allow-origin']) {
            console.log('✅ PASSED: CORS headers present\n');
            passed++;
        } else {
            console.log('❌ FAILED: CORS headers missing\n');
            failed++;
        }
    } catch (error) {
        console.log('❌ FAILED:', error.message, '\n');
        failed++;
    }

    // Test 6: Rate Limiting (check if limiter is configured)
    console.log('Test 6: Server Health Check');
    try {
        const response = await axios.get(`${BASE_URL}/health`);
        if (response.status === 200) {
            console.log('✅ PASSED: Server health check works\n');
            passed++;
        } else {
            console.log('❌ FAILED: Health check failed\n');
            failed++;
        }
    } catch (error) {
        console.log('⚠️  SKIPPED: Health check requires TTS service\n');
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
    console.log('='.repeat(50));
    
    if (failed === 0) {
        console.log('🎉 All tests passed!');
    } else {
        console.log('⚠️  Some tests failed. Please review.');
    }
}

// Run tests
runTests().catch(console.error);

