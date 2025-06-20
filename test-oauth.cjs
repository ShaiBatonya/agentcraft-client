#!/usr/bin/env node

/**
 * OAuth Test Script
 * Tests the OAuth authentication flow and server endpoints
 */

const https = require('https');
const http = require('http');

const API_BASE = 'http://localhost:5000/api';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    const req = client.request(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'OAuth-Test-Script/1.0',
        ...options.headers
      },
      ...options
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data,
          cookies: res.headers['set-cookie'] || []
        });
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testServerHealth() {
  log('\n🔍 Testing server health...', 'cyan');
  
  try {
    const response = await makeRequest(`${API_BASE}/health`);
    
    if (response.status === 200) {
      log('✅ Server is running and healthy', 'green');
      log(`   Status: ${response.status}`, 'blue');
      return true;
    } else {
      log(`❌ Server health check failed: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Server health check failed: ${error.message}`, 'red');
    return false;
  }
}

async function testAuthEndpoints() {
  log('\n🔍 Testing authentication endpoints...', 'cyan');
  
  // Test /auth/me without authentication
  try {
    const response = await makeRequest(`${API_BASE}/auth/me`);
    log(`📊 GET /auth/me (no auth): ${response.status}`, response.status === 401 ? 'yellow' : 'red');
  } catch (error) {
    log(`❌ Error testing /auth/me: ${error.message}`, 'red');
  }
  
  // Test /auth/health
  try {
    const response = await makeRequest(`${API_BASE}/auth/health`);
    log(`📊 GET /auth/health: ${response.status}`, response.status === 200 ? 'green' : 'red');
    
    if (response.status === 200) {
      try {
        const data = JSON.parse(response.data);
        log(`   Authenticated: ${data.data?.authenticated || false}`, 'blue');
      } catch (e) {
        log('   Could not parse response data', 'yellow');
      }
    }
  } catch (error) {
    log(`❌ Error testing /auth/health: ${error.message}`, 'red');
  }
}

async function testGoogleOAuthUrl() {
  log('\n🔍 Testing Google OAuth URL generation...', 'cyan');
  
  const callbackUrl = 'http://localhost:3000/auth/callback';
  const oauthUrl = `${API_BASE.replace('/api', '')}/api/auth/google?callback=${encodeURIComponent(callbackUrl)}`;
  
  log(`🔗 Generated OAuth URL:`, 'blue');
  log(`   ${oauthUrl}`, 'magenta');
  
  // Test if the OAuth endpoint responds
  try {
    const response = await makeRequest(oauthUrl, { 
      maxRedirects: 0,
      timeout: 5000
    });
    
    if (response.status >= 300 && response.status < 400) {
      log(`✅ OAuth endpoint responds with redirect: ${response.status}`, 'green');
      log(`   Location: ${response.headers.location || 'none'}`, 'blue');
    } else {
      log(`❌ Unexpected OAuth response: ${response.status}`, 'red');
    }
  } catch (error) {
    log(`❌ Error testing OAuth URL: ${error.message}`, 'red');
  }
}

async function testCookieHandling() {
  log('\n🔍 Testing cookie handling...', 'cyan');
  
  // This would normally require a real OAuth flow
  // For now, just test if the server accepts cookies
  try {
    const response = await makeRequest(`${API_BASE}/auth/me`, {
      headers: {
        'Cookie': 'test=value'
      }
    });
    
    log(`📊 Cookie test request: ${response.status}`, 'blue');
    log(`   Set-Cookie headers: ${response.cookies.length}`, 'blue');
    
    if (response.cookies.length > 0) {
      response.cookies.forEach(cookie => {
        log(`   Cookie: ${cookie}`, 'magenta');
      });
    }
  } catch (error) {
    log(`❌ Error testing cookies: ${error.message}`, 'red');
  }
}

async function main() {
  log('🧪 OAuth Authentication Test Script', 'cyan');
  log('=====================================', 'cyan');
  
  const serverHealthy = await testServerHealth();
  
  if (!serverHealthy) {
    log('\n❌ Server is not responding. Please start the backend server first.', 'red');
    log('   Run: cd server && npm start', 'yellow');
    process.exit(1);
  }
  
  await testAuthEndpoints();
  await testGoogleOAuthUrl();
  await testCookieHandling();
  
  log('\n📋 Test Summary:', 'cyan');
  log('================', 'cyan');
  log('✅ Server is running', 'green');
  log('🔍 Check the logs above for any issues', 'blue');
  log('\n💡 To test the full OAuth flow:', 'yellow');
  log('   1. Start the frontend: npm run dev', 'blue');
  log('   2. Visit: http://localhost:3000/oauth-debug.html', 'blue');
  log('   3. Click "Test Google Login"', 'blue');
  log('   4. Monitor console logs for detailed debugging', 'blue');
}

// Run the tests
main().catch(error => {
  log(`\n❌ Test script failed: ${error.message}`, 'red');
  process.exit(1);
}); 