/**
 * @file examples/enhanced-validation-examples.js
 * @description Examples demonstrating the enhanced validation system capabilities
 */

// Example 1: Interactive Button with Multiple Validation Rules
const interactiveButtonExample = {
  instructions: "Создайте интерактивную кнопку, которая меняет цвет и текст при клике, и выводит сообщение в консоль",
  validationRules: [
    // HTML Structure
    { 
      type: "elementExists", 
      selector: "button" 
    },
    { 
      type: "elementHasClass", 
      selector: "button", 
      className: "interactive-btn" 
    },
    
    // Initial CSS Styles
    {
      type: "computedStyle",
      selector: "button",
      property: "padding",
      expected: "10px 20px"
    },
    {
      type: "computedStyle",
      selector: "button",
      property: "border-radius",
      expected: "4px"
    },
    
    // JavaScript Functionality
    {
      type: "eventListenerAttached",
      selector: "button",
      eventType: "click"
    },
    {
      type: "jsConsoleContains",
      message: "Button clicked!",
      consoleType: "log"
    },
    
    // Interactive Behavior
    {
      type: "eventDispatchChangesDom",
      selector: "button",
      eventType: "click",
      expectChange: true,
      condition: "document.querySelector('button').textContent !== 'Click me'"
    },
    
    // Logical composition - Button should have either primary or secondary styling
    {
      type: "anyOf",
      rules: [
        { type: "elementHasClass", selector: "button", className: "btn-primary" },
        { type: "elementHasClass", selector: "button", className: "btn-secondary" }
      ]
    }
  ]
};

// Example 2: Form Validation with Complex Logic
const formValidationExample = {
  instructions: "Создайте форму с валидацией, включающую поля email, пароль и подтверждение пароля",
  validationRules: [
    // All required form elements must exist
    {
      type: "allOf",
      rules: [
        { type: "elementExists", selector: "form" },
        { type: "elementExists", selector: "input[type='email']" },
        { type: "elementExists", selector: "input[type='password']" },
        { type: "elementExists", selector: "button[type='submit']" }
      ]
    },
    
    // Email field should have proper attributes
    {
      type: "allOf",
      rules: [
        { type: "elementHasAttribute", selector: "input[type='email']", attribute: "required" },
        { type: "elementHasAttribute", selector: "input[type='email']", attribute: "name" },
        { type: "elementAttribute", selector: "input[type='email']", attribute: "placeholder", expected: "Введите ваш email" }
      ]
    },
    
    // At least 2 password fields should exist (password + confirm)
    {
      type: "countAtLeast",
      minimum: 2,
      rules: [
        { type: "elementCount", selector: "input[type='password']", expected: 2 }
      ]
    },
    
    // Form should have validation JavaScript function
    {
      type: "jsGlobalDefined",
      name: "validateForm"
    },
    
    // Validation function should work correctly
    {
      type: "jsFunctionReturns",
      functionName: "validateForm",
      args: ["test@example.com", "password123", "password123"],
      expected: true
    },
    
    // Form should not submit with mismatched passwords
    {
      type: "jsFunctionReturns",
      functionName: "validateForm", 
      args: ["test@example.com", "password123", "different"],
      expected: false
    }
  ]
};

// Example 3: CSS Animation and Responsive Design
const responsiveAnimationExample = {
  instructions: "Создайте анимированную карточку с адаптивным дизайном",
  validationRules: [
    // Card structure
    { type: "elementExists", selector: ".card" },
    { type: "elementExists", selector: ".card .title" },
    { type: "elementExists", selector: ".card .content" },
    
    // Basic responsive styling
    {
      type: "computedStyle",
      selector: ".card",
      property: "max-width",
      expected: "400px"
    },
    
    // CSS animation properties should be defined
    {
      type: "anyOf",
      rules: [
        { type: "styleRuleProperty", selector: ".card", property: "transition" },
        { type: "styleRuleProperty", selector: ".card", property: "animation" }
      ]
    },
    
    // Hover effects
    {
      type: "styleRuleExists",
      selector: ".card:hover"
    },
    
    // Card should have hover interaction
    {
      type: "eventDispatchChangesDom",
      selector: ".card",
      eventType: "mouseover",
      expectChange: false, // DOM doesn't change, but styles might
      condition: "getComputedStyle(document.querySelector('.card')).transform !== 'none'"
    },
    
    // Text content validation with regex
    {
      type: "elementMatches",
      selector: ".card .title",
      pattern: "^[A-ZА-Я].+",
      flags: "u"
    }
  ]
};

// Example 4: Complex JavaScript Application
const jsApplicationExample = {
  instructions: "Создайте ToDo приложение с добавлением, удалением и отметкой задач",
  validationRules: [
    // Application structure
    { type: "elementExists", selector: "#todo-app" },
    { type: "elementExists", selector: "#todo-input" },
    { type: "elementExists", selector: "#add-btn" },
    { type: "elementExists", selector: "#todo-list" },
    
    // Global functions should exist
    {
      type: "allOf",
      rules: [
        { type: "jsGlobalDefined", name: "addTodo" },
        { type: "jsGlobalDefined", name: "removeTodo" },
        { type: "jsGlobalDefined", name: "toggleTodo" }
      ]
    },
    
    // Adding todos should work
    {
      type: "jsFunctionReturns",
      functionName: "addTodo",
      args: ["Test task"],
      expected: true
    },
    
    // Should log success when adding todos
    {
      type: "jsConsoleContains",
      message: "Todo added",
      consoleType: "log"
    },
    
    // Event listeners should be attached
    {
      type: "allOf",
      rules: [
        { type: "eventListenerAttached", selector: "#add-btn", eventType: "click" },
        { type: "eventListenerAttached", selector: "#todo-input", eventType: "keypress" }
      ]
    },
    
    // Adding todo should update DOM
    {
      type: "eventDispatchChangesDom",
      selector: "#add-btn",
      eventType: "click",
      expectChange: true,
      condition: "document.querySelectorAll('#todo-list li').length > 0"
    },
    
    // Should handle empty input gracefully
    {
      type: "not",
      rule: {
        type: "jsExpression",
        expression: "addTodo('') === true"
      }
    }
  ]
};

// Example 5: Accessibility and SEO validation
const accessibilityExample = {
  instructions: "Создайте доступную веб-страницу с правильной семантикой и ARIA атрибутами",
  validationRules: [
    // Semantic HTML structure
    {
      type: "allOf",
      rules: [
        { type: "elementExists", selector: "header" },
        { type: "elementExists", selector: "main" },
        { type: "elementExists", selector: "footer" }
      ]
    },
    
    // Page should have proper heading hierarchy
    {
      type: "allOf",
      rules: [
        { type: "elementCount", selector: "h1", expected: 1 },
        { type: "elementExists", selector: "h2" }
      ]
    },
    
    // Images should have alt attributes
    {
      type: "not",
      rule: { type: "elementExists", selector: "img:not([alt])" }
    },
    
    // Form labels should be properly associated
    {
      type: "anyOf",
      rules: [
        { type: "elementExists", selector: "label[for]" },
        { type: "elementExists", selector: "input[aria-label]" }
      ]
    },
    
    // Skip navigation should exist
    { type: "elementExists", selector: "a[href='#main']" },
    
    // ARIA landmarks should be used appropriately
    {
      type: "countAtLeast",
      minimum: 2,
      rules: [
        { type: "elementExists", selector: "[role='banner']" },
        { type: "elementExists", selector: "[role='main']" },
        { type: "elementExists", selector: "[role='contentinfo']" },
        { type: "elementExists", selector: "[role='navigation']" }
      ]
    },
    
    // Focus management for interactive elements
    {
      type: "allOf",
      rules: [
        { type: "styleRuleExists", selector: ":focus" },
        { type: "styleRuleProperty", selector: ":focus", property: "outline" }
      ]
    }
  ]
};

module.exports = {
  interactiveButtonExample,
  formValidationExample,
  responsiveAnimationExample,
  jsApplicationExample,
  accessibilityExample
};

console.log("📚 Enhanced Validation Examples");
console.log("===============================");
console.log("1. Interactive Button Example - Advanced DOM interaction validation");
console.log("2. Form Validation Example - Complex form logic and validation");  
console.log("3. Responsive Animation Example - CSS animations and responsive design");
console.log("4. JavaScript Application Example - Full application logic validation");
console.log("5. Accessibility Example - Semantic HTML and ARIA validation");
console.log("\nThese examples demonstrate the power of the enhanced validation system");
console.log("with logical compositions, CSS validation, JavaScript testing, and accessibility checks.");