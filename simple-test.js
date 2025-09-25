#!/usr/bin/env node

/**
 * Simplified test for Wishbone project validation
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Wishbone Project Validation Test\n');

const projectSeederPath = path.join(__dirname, 'server/seeders/20250616080000-wishbone-project.js');
const stepsSeederPath = path.join(__dirname, 'server/seeders/20250616080001-wishbone-project-steps.js');
const exampleHtmlPath = path.join(__dirname, 'wishbone-example.html');
const exampleCssPath = path.join(__dirname, 'style.css');
const docPath = path.join(__dirname, 'WISHBONE_PROJECT.md');

let passed = 0;
let total = 0;

function test(name, condition) {
  total++;
  if (condition) {
    console.log(`✅ ${name}`);
    passed++;
  } else {
    console.log(`❌ ${name}`);
  }
}

// Basic file existence tests
test('Project seeder exists', fs.existsSync(projectSeederPath));
test('Steps seeder exists', fs.existsSync(stepsSeederPath));
test('Example HTML exists', fs.existsSync(exampleHtmlPath));
test('Example CSS exists', fs.existsSync(exampleCssPath));
test('Documentation exists', fs.existsSync(docPath));

// Content validation tests
if (fs.existsSync(stepsSeederPath)) {
  const stepsContent = fs.readFileSync(stepsSeederPath, 'utf8');
  test('Contains 8 project steps', (stepsContent.match(/Шаг \d+/g) || []).length >= 8);
  test('Has elementExists validation', stepsContent.includes('elementExists'));
  test('Has elementText validation', stepsContent.includes('elementText'));
  test('Has elementCount validation', stepsContent.includes('elementCount'));
  test('Project ID is 13', stepsContent.includes('project_id: 13'));
}

if (fs.existsSync(exampleHtmlPath)) {
  const htmlContent = fs.readFileSync(exampleHtmlPath, 'utf8');
  test('HTML has semantic structure', htmlContent.includes('<header>') && 
       htmlContent.includes('<main>') && htmlContent.includes('<footer'));
  test('HTML has navigation', htmlContent.includes('<nav>') && htmlContent.includes('Wishbone'));
  test('HTML has hero section', htmlContent.includes('class="hero"'));
  test('HTML has menu section', htmlContent.includes('class="menu"'));
  test('HTML has booking form', htmlContent.includes('class="booking"') && htmlContent.includes('<form>'));
  test('HTML has contact info', htmlContent.includes('class="contacts"'));
}

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Test Results: ${passed}/${total} tests passed`);

if (passed === total) {
  console.log('🎉 All tests passed! Wishbone project is ready.');
  console.log('\n📋 Project Summary:');
  console.log('• Restaurant website project for HTML/CSS course');
  console.log('• 8 progressive learning steps');
  console.log('• Complete semantic HTML structure');
  console.log('• Professional CSS styling');
  console.log('• Working example with screenshots');
  console.log('• Comprehensive documentation');
  process.exit(0);
} else {
  console.log(`❌ ${total - passed} tests failed.`);
  process.exit(1);
}