/**
 * @file test/validationTest.js
 * @description Test the enhanced validation system
 */

const ValidationRules = require("../server/lib/validationRules");
const { JSDOM } = require("jsdom");

// Test HTML content
const testHTML = `
  <div class="container">
    <h1 id="title">Welcome to My Site</h1>
    <p class="intro">This is a test paragraph.</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <img src="test.jpg" alt="Test image" class="responsive">
    <button id="click-btn" class="btn btn-primary">Click me</button>
  </div>
`;

// Test CSS content
const testCSS = `
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .btn-primary {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
  }
  
  .responsive {
    max-width: 100%;
    height: auto;
  }
`;

// Test JavaScript content
const testJS = `
  function greetUser(name) {
    return "Hello, " + name + "!";
  }
  
  console.log("Page loaded successfully");
  
  document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('click-btn');
    if (button) {
      button.addEventListener('click', function() {
        this.textContent = 'Clicked!';
        this.style.backgroundColor = '#28a745';
      });
    }
  });
`;

function runValidationTests() {
  console.log("🧪 Starting Enhanced Validation System Tests...\n");

  // Create JSDOM environment
  const dom = new JSDOM(
    `<html><head><style>${testCSS}</style></head><body>${testHTML}</body></html>`,
    {
      url: "http://localhost",
      referrer: "http://localhost",
      contentType: "text/html",
      includeNodeLocations: true,
      storageQuota: 10000000,
      runScripts: "dangerously"
    }
  );

  const { document } = dom.window;
  const validator = new ValidationRules(dom, document, testHTML, testCSS, testJS);

  // Test cases
  const testCases = [
    // HTML Tests
    {
      name: "elementExists - should pass",
      rule: { type: "elementExists", selector: "h1" },
      shouldPass: true
    },
    {
      name: "elementExists - should fail",
      rule: { type: "elementExists", selector: ".nonexistent" },
      shouldPass: false
    },
    {
      name: "elementText - should pass",
      rule: { type: "elementText", selector: "h1", expected: "Welcome to My Site" },
      shouldPass: true
    },
    {
      name: "elementText - should fail",
      rule: { type: "elementText", selector: "h1", expected: "Wrong text" },
      shouldPass: false
    },
    {
      name: "elementHasClass - should pass",
      rule: { type: "elementHasClass", selector: "button", className: "btn-primary" },
      shouldPass: true
    },
    {
      name: "elementHasClass - should fail",
      rule: { type: "elementHasClass", selector: "button", className: "nonexistent-class" },
      shouldPass: false
    },
    {
      name: "elementCount - should pass",
      rule: { type: "elementCount", selector: "li", expected: 3 },
      shouldPass: true
    },
    {
      name: "elementCount - should fail",
      rule: { type: "elementCount", selector: "li", expected: 5 },
      shouldPass: false
    },
    {
      name: "elementAttribute - should pass",
      rule: { type: "elementAttribute", selector: "img", attribute: "alt", expected: "Test image" },
      shouldPass: true
    },
    {
      name: "elementHasAttribute - should pass",
      rule: { type: "elementHasAttribute", selector: "img", attribute: "src" },
      shouldPass: true
    },
    {
      name: "elementNotExists - should pass",
      rule: { type: "elementNotExists", selector: ".nonexistent" },
      shouldPass: true
    },
    
    // CSS Tests
    {
      name: "computedStyle - should pass",
      rule: { type: "computedStyle", selector: ".container", property: "max-width", expected: "1200px" },
      shouldPass: true
    },
    
    // JavaScript Tests
    {
      name: "jsGlobalDefined - should pass",
      rule: { type: "jsGlobalDefined", name: "greetUser" },
      shouldPass: true
    },
    {
      name: "jsGlobalDefined - should fail",
      rule: { type: "jsGlobalDefined", name: "nonexistentFunction" },
      shouldPass: false
    },
    {
      name: "jsFunctionReturns - should pass",
      rule: { type: "jsFunctionReturns", functionName: "greetUser", args: ["World"], expected: "Hello, World!" },
      shouldPass: true
    },
    {
      name: "jsConsoleContains - should pass",
      rule: { type: "jsConsoleContains", message: "Page loaded successfully", type: "log" },
      shouldPass: true
    },
    {
      name: "jsExpression - should pass",
      rule: { type: "jsExpression", expression: "typeof greetUser === 'function'", expected: true },
      shouldPass: true
    },
    
    // Logical Tests
    {
      name: "allOf - should pass",
      rule: {
        type: "allOf",
        rules: [
          { type: "elementExists", selector: "h1" },
          { type: "elementExists", selector: "button" }
        ]
      },
      shouldPass: true
    },
    {
      name: "allOf - should fail",
      rule: {
        type: "allOf",
        rules: [
          { type: "elementExists", selector: "h1" },
          { type: "elementExists", selector: ".nonexistent" }
        ]
      },
      shouldPass: false
    },
    {
      name: "anyOf - should pass",
      rule: {
        type: "anyOf",
        rules: [
          { type: "elementExists", selector: ".nonexistent" },
          { type: "elementExists", selector: "h1" }
        ]
      },
      shouldPass: true
    },
    {
      name: "not - should pass",
      rule: {
        type: "not",
        rule: { type: "elementExists", selector: ".nonexistent" }
      },
      shouldPass: true
    },
    {
      name: "countAtLeast - should pass",
      rule: {
        type: "countAtLeast",
        minimum: 2,
        rules: [
          { type: "elementExists", selector: "h1" },
          { type: "elementExists", selector: "button" },
          { type: "elementExists", selector: ".nonexistent" }
        ]
      },
      shouldPass: true
    }
  ];

  let passed = 0;
  let failed = 0;

  // Run tests
  testCases.forEach(testCase => {
    try {
      const error = validator.validateRule(testCase.rule);
      const actualPass = error === null;
      
      if (actualPass === testCase.shouldPass) {
        console.log(`✅ ${testCase.name}`);
        passed++;
      } else {
        console.log(`❌ ${testCase.name}`);
        console.log(`   Expected: ${testCase.shouldPass ? 'PASS' : 'FAIL'}`);
        console.log(`   Actual: ${actualPass ? 'PASS' : 'FAIL'}`);
        if (error) console.log(`   Error: ${error}`);
        failed++;
      }
    } catch (err) {
      console.log(`💥 ${testCase.name} - Exception: ${err.message}`);
      failed++;
    }
  });

  // Summary
  console.log(`\n📊 Test Results:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log(`\n🎉 All tests passed! The enhanced validation system is working correctly.`);
  } else {
    console.log(`\n⚠️  Some tests failed. Please review the implementation.`);
  }
}

// Run tests if called directly
if (require.main === module) {
  runValidationTests();
}

module.exports = { runValidationTests };