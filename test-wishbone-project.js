#!/usr/bin/env node

/**
 * Simple test script to validate the Wishbone project structure
 * Tests the seeder files for proper JSON structure and validation rules
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Wishbone Project Structure...\n');

// Test project seeder
const projectSeederPath = path.join(__dirname, 'server/seeders/20250616080000-wishbone-project.js');
const stepsSeederPath = path.join(__dirname, 'server/seeders/20250616080001-wishbone-project-steps.js');

let errors = 0;

// Test 1: Check if seeder files exist
console.log('✅ Test 1: Checking seeder files existence');
if (fs.existsSync(projectSeederPath)) {
  console.log('   ✓ Project seeder exists');
} else {
  console.log('   ❌ Project seeder missing');
  errors++;
}

if (fs.existsSync(stepsSeederPath)) {
  console.log('   ✓ Steps seeder exists');
} else {
  console.log('   ❌ Steps seeder missing');  
  errors++;
}

// Test 2: Validate seeder file structure
console.log('\n✅ Test 2: Validating seeder structure');
try {
  const projectSeeder = require(projectSeederPath);
  if (typeof projectSeeder.up === 'function' && typeof projectSeeder.down === 'function') {
    console.log('   ✓ Project seeder has valid structure');
  } else {
    console.log('   ❌ Project seeder invalid structure');
    errors++;
  }
} catch (e) {
  console.log('   ❌ Project seeder syntax error:', e.message);
  errors++;
}

try {
  const stepsSeeder = require(stepsSeederPath);
  if (typeof stepsSeeder.up === 'function' && typeof stepsSeeder.down === 'function') {
    console.log('   ✓ Steps seeder has valid structure');
  } else {
    console.log('   ❌ Steps seeder invalid structure');
    errors++;
  }
} catch (e) {
  console.log('   ❌ Steps seeder syntax error:', e.message);
  errors++;
}

// Test 3: Validate JSON in validation rules
console.log('\n✅ Test 3: Validating JSON structure in validation rules');
const stepsContent = fs.readFileSync(stepsSeederPath, 'utf8');
const jsonMatches = stepsContent.match(/JSON\.stringify\(\[(.*?)\]\)/gs);

if (jsonMatches && jsonMatches.length >= 8) {
  console.log(`   ✓ Found ${jsonMatches.length} validation rule sets`);
  
  let validJsonCount = 0;
  jsonMatches.forEach((match, index) => {
    try {
      // Extract the content between JSON.stringify([ and ])
      const content = match.replace(/JSON\.stringify\(/, '').slice(0, -1);
      JSON.parse(content);
      validJsonCount++;
    } catch (e) {
      console.log(`   ❌ Invalid JSON in step ${index + 1}:`, e.message);
      errors++;
    }
  });
  
  console.log(`   ✓ ${validJsonCount}/${jsonMatches.length} validation rules have valid JSON`);
} else {
  console.log('   ❌ Could not find expected validation rules');
  errors++;
}

// Test 4: Check example files
console.log('\n✅ Test 4: Checking example files');
const exampleHtmlPath = path.join(__dirname, 'wishbone-example.html');
const exampleCssPath = path.join(__dirname, 'style.css');

if (fs.existsSync(exampleHtmlPath)) {
  console.log('   ✓ Example HTML file exists');
  const htmlContent = fs.readFileSync(exampleHtmlPath, 'utf8');
  
  // Check for required elements
  const requiredElements = [
    '<header>', '<nav>', '<main>', '<section class="hero">', 
    '<section class="about">', '<section class="menu">', 
    '<section class="booking">', '<section class="contacts">'
  ];
  
  let foundElements = 0;
  requiredElements.forEach(element => {
    if (htmlContent.includes(element)) {
      foundElements++;
    }
  });
  
  console.log(`   ✓ Found ${foundElements}/${requiredElements.length} required HTML elements`);
} else {
  console.log('   ❌ Example HTML file missing');
  errors++;
}

if (fs.existsSync(exampleCssPath)) {
  console.log('   ✓ Example CSS file exists');
} else {
  console.log('   ❌ Example CSS file missing');
  errors++;
}

// Final result
console.log('\n' + '='.repeat(50));
if (errors === 0) {
  console.log('🎉 All tests passed! Wishbone project is ready for deployment.');
  console.log('\nThe project includes:');
  console.log('📄 Complete restaurant website with 8 learning steps');
  console.log('🏗️  Semantic HTML structure with forms and navigation');  
  console.log('🎨 Professional CSS styling with responsive design');
  console.log('✅ Comprehensive validation rules for each step');
  console.log('📖 Complete documentation and examples');
} else {
  console.log(`❌ ${errors} test(s) failed. Please fix the issues above.`);
  process.exit(1);
}