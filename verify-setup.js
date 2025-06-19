// Simple verification script to test API connectivity and configuration
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 AgentCraft Setup Verification');
console.log('================================');

// Test backend API connectivity
function testBackendAPI() {
  return new Promise((resolve) => {
    const req = http.request('http://localhost:5000/api/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.status === 'ok') {
            console.log('✅ Backend API: Connected and healthy');
            resolve(true);
          } else {
            console.log('❌ Backend API: Unhealthy response');
            resolve(false);
          }
        } catch (error) {
          console.log('❌ Backend API: Invalid response format');
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Backend API: Connection failed (make sure server is running)');
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Backend API: Connection timeout');
      resolve(false);
    });
    
    req.end();
  });
}

// Test frontend server
function testFrontendServer() {
  return new Promise((resolve) => {
    const req = http.request('http://localhost:5174', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Frontend Server: Running on port 5174');
        resolve(true);
      } else {
        console.log(`❌ Frontend Server: Unexpected status ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', () => {
      console.log('❌ Frontend Server: Not running (start with: npm run dev)');
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Frontend Server: Connection timeout');
      resolve(false);
    });
    
    req.end();
  });
}

// Check environment files
function checkEnvironmentFiles() {
  let allGood = true;
  
  // Check client .env
  const clientEnvPath = path.join(__dirname, '.env');
  if (fs.existsSync(clientEnvPath)) {
    const clientEnv = fs.readFileSync(clientEnvPath, 'utf8');
    if (clientEnv.includes('VITE_API_URL=http://localhost:5000/api')) {
      console.log('✅ Client .env: VITE_API_URL configured correctly');
    } else {
      console.log('❌ Client .env: VITE_API_URL not found or incorrect');
      allGood = false;
    }
    
    if (clientEnv.includes('VITE_CLIENT_URL=http://localhost:5174')) {
      console.log('✅ Client .env: VITE_CLIENT_URL configured correctly');
    } else {
      console.log('❌ Client .env: VITE_CLIENT_URL not found or incorrect');
      allGood = false;
    }
  } else {
    console.log('❌ Client .env: File not found');
    allGood = false;
  }
  
  // Check server .env
  const serverEnvPath = path.join(__dirname, '../server/.env');
  if (fs.existsSync(serverEnvPath)) {
    const serverEnv = fs.readFileSync(serverEnvPath, 'utf8');
    const requiredVars = [
      'PORT=5000',
      'CLIENT_URL=http://localhost:5174',
      'MONGODB_URI=',
      'JWT_SECRET=',
      'GOOGLE_CLIENT_ID=',
      'GOOGLE_CLIENT_SECRET=',
      'GEMINI_API_KEY='
    ];
    
    requiredVars.forEach(varPattern => {
      if (serverEnv.includes(varPattern)) {
        console.log(`✅ Server .env: ${varPattern.split('=')[0]} configured`);
      } else {
        console.log(`❌ Server .env: ${varPattern.split('=')[0]} not found or incorrect`);
        allGood = false;
      }
    });
  } else {
    console.log('❌ Server .env: File not found');
    allGood = false;
  }
  
  return allGood;
}

// Run all tests
async function runVerification() {
  console.log('\n📋 Checking Environment Configuration...');
  const envOk = checkEnvironmentFiles();
  
  console.log('\n🔌 Testing Server Connectivity...');
  const backendOk = await testBackendAPI();
  const frontendOk = await testFrontendServer();
  
  console.log('\n📊 Verification Results:');
  console.log('========================');
  
  if (envOk && backendOk && frontendOk) {
    console.log('🎉 ALL SYSTEMS GO! Your AgentCraft setup is ready.');
    console.log('🌐 Visit: http://localhost:5174');
    console.log('📚 API Docs: http://localhost:5000/api/docs');
  } else {
    console.log('❌ Setup issues detected. Please fix the issues above.');
    console.log('\n🛠️  Common fixes:');
    console.log('   1. Start backend: cd server && npm start');
    console.log('   2. Start frontend: cd client && npm run dev');
    console.log('   3. Check .env files exist and have correct values');
    console.log('   4. Verify MongoDB is running');
  }
}

runVerification(); 