# Enhanced Validation Rules Documentation

## Overview

The validation system has been greatly enhanced to support comprehensive validation of HTML, CSS, JavaScript, and logical compositions. The system now includes a visual Rule Builder for easy configuration and supports safe execution of user code.

## Supported Validation Types

### HTML Validation Rules

#### 1. `elementExists`
Checks if an element with the specified selector exists in the document.

**Parameters:**
- `selector` (string): CSS selector

**Example:**
```json
{ "type": "elementExists", "selector": "h1" }
```

#### 2. `elementNotExists`
Checks if an element with the specified selector does NOT exist in the document.

**Parameters:**
- `selector` (string): CSS selector

**Example:**
```json
{ "type": "elementNotExists", "selector": ".deprecated-class" }
```

#### 3. `elementText`
Checks if an element contains the expected text content.

**Parameters:**
- `selector` (string): CSS selector
- `expected` (string): Expected text content

**Example:**
```json
{ "type": "elementText", "selector": "h1", "expected": "Welcome!" }
```

#### 4. `elementMatches`
Checks if an element's content matches a regular expression pattern.

**Parameters:**
- `selector` (string): CSS selector
- `pattern` (string): Regular expression pattern
- `flags` (string, optional): Regex flags (i, g, m, s, u, y)
- `property` (string, optional): "textContent" or "innerHTML" (default: "textContent")

**Example:**
```json
{
  "type": "elementMatches",
  "selector": ".date",
  "pattern": "\\d{2}\\.\\d{2}\\.\\d{4}",
  "flags": "g"
}
```

#### 5. `elementHasClass`
Checks if an element has a specific CSS class.

**Parameters:**
- `selector` (string): CSS selector
- `className` (string): CSS class name to check

**Example:**
```json
{ "type": "elementHasClass", "selector": "button", "className": "btn-primary" }
```

#### 6. `elementAttribute`
Checks if an element's attribute has the expected value.

**Parameters:**
- `selector` (string): CSS selector
- `attribute` (string): Attribute name
- `expected` (string): Expected attribute value

**Example:**
```json
{ "type": "elementAttribute", "selector": "img", "attribute": "alt", "expected": "My image" }
```

#### 7. `elementHasAttribute`
Checks if an element has a specific attribute (regardless of its value).

**Parameters:**
- `selector` (string): CSS selector
- `attribute` (string): Attribute name

**Example:**
```json
{ "type": "elementHasAttribute", "selector": "img", "attribute": "src" }
```

#### 8. `elementCount`
Checks if the number of elements matching the selector equals the expected count.

**Parameters:**
- `selector` (string): CSS selector
- `expected` (number): Expected number of elements

**Example:**
```json
{ "type": "elementCount", "selector": "ul li", "expected": 3 }
```

### CSS Validation Rules

#### 9. `computedStyle`
Checks if an element's computed CSS style property has the expected value.

**Parameters:**
- `selector` (string): CSS selector
- `property` (string): CSS property name
- `expected` (string): Expected property value

**Example:**
```json
{ "type": "computedStyle", "selector": ".card", "property": "width", "expected": "300px" }
```

#### 10. `styleRuleExists`
Checks if a CSS rule exists for the specified selector in the stylesheet.

**Parameters:**
- `selector` (string): CSS selector

**Example:**
```json
{ "type": "styleRuleExists", "selector": ".hero-section" }
```

#### 11. `styleRuleProperty`
Checks if a CSS rule contains a specific property with an optional expected value.

**Parameters:**
- `selector` (string): CSS selector
- `property` (string): CSS property name
- `expected` (string, optional): Expected property value

**Example:**
```json
{
  "type": "styleRuleProperty",
  "selector": ".btn",
  "property": "border-radius",
  "expected": "4px"
}
```

### JavaScript Validation Rules

#### 12. `jsGlobalDefined`
Checks if a global variable or function is defined.

**Parameters:**
- `name` (string): Variable or function name

**Example:**
```json
{ "type": "jsGlobalDefined", "name": "calculateSum" }
```

#### 13. `jsExpression`
Checks if a JavaScript expression evaluates to the expected result.

**Parameters:**
- `expression` (string): JavaScript expression to evaluate
- `expected` (any, optional): Expected result (default: expects truthy)

**Example:**
```json
{
  "type": "jsExpression",
  "expression": "typeof myFunction === 'function'",
  "expected": true
}
```

#### 14. `jsFunctionReturns`
Checks if a function call returns the expected value.

**Parameters:**
- `functionName` (string): Function name
- `args` (array, optional): Arguments to pass to the function
- `expected` (any): Expected return value

**Example:**
```json
{
  "type": "jsFunctionReturns",
  "functionName": "add",
  "args": [5, 3],
  "expected": 8
}
```

#### 15. `jsConsoleContains`
Checks if the console contains a specific message.

**Parameters:**
- `message` (string): Message text to search for
- `type` (string, optional): Console method type (log, info, warn, error)

**Example:**
```json
{
  "type": "jsConsoleContains",
  "message": "Функция выполнена успешно",
  "type": "log"
}
```

#### 16. `eventListenerAttached`
Checks if an event listener is attached to an element.

**Parameters:**
- `selector` (string): CSS selector
- `eventType` (string): Event type (click, mouseover, etc.)

**Example:**
```json
{
  "type": "eventListenerAttached",
  "selector": "#submit-btn",
  "eventType": "click"
}
```

#### 17. `eventDispatchChangesDom`
Checks if dispatching an event changes the DOM as expected.

**Parameters:**
- `selector` (string): CSS selector of element to dispatch event on
- `eventType` (string): Event type to dispatch
- `expectChange` (boolean, optional): Whether DOM should change (default: true)
- `condition` (string, optional): JavaScript expression to check after event

**Example:**
```json
{
  "type": "eventDispatchChangesDom",
  "selector": "#toggle-btn",
  "eventType": "click",
  "expectChange": true,
  "condition": "document.querySelector('.content').style.display === 'block'"
}
```

### Logical Composition Rules

#### 18. `allOf`
Checks that ALL nested rules pass (AND logic).

**Parameters:**
- `rules` (array): Array of validation rules

**Example:**
```json
{
  "type": "allOf",
  "rules": [
    { "type": "elementExists", "selector": "h1" },
    { "type": "elementText", "selector": "h1", "expected": "Welcome" }
  ]
}
```

#### 19. `anyOf`
Checks that at least ONE nested rule passes (OR logic).

**Parameters:**
- `rules` (array): Array of validation rules

**Example:**
```json
{
  "type": "anyOf",
  "rules": [
    { "type": "elementExists", "selector": "h1" },
    { "type": "elementExists", "selector": "h2" }
  ]
}
```

#### 20. `not`
Checks that a rule does NOT pass (NOT logic).

**Parameters:**
- `rule` (object): Validation rule to negate

**Example:**
```json
{
  "type": "not",
  "rule": { "type": "elementExists", "selector": ".error" }
}
```

#### 21. `countAtLeast`
Checks that at least N rules pass from a set.

**Parameters:**
- `minimum` (number): Minimum number of rules that must pass
- `rules` (array): Array of validation rules

**Example:**
```json
{
  "type": "countAtLeast",
  "minimum": 2,
  "rules": [
    { "type": "elementExists", "selector": "h1" },
    { "type": "elementExists", "selector": "p" },
    { "type": "elementExists", "selector": "img" }
  ]
}
```

## Rule Builder Interface

The system now includes a visual Rule Builder interface that allows creating validation rules without writing JSON manually:

### Features:
- Category-based rule selection (HTML, CSS, JavaScript, Logic)
- Parameter validation with type checking
- Live preview of the generated rule
- Error feedback for invalid configurations
- Examples and help text for each rule type

### API Endpoints:
- `GET /api/validation/categories` - Get rule categories
- `GET /api/validation/schema` - Get complete validation schema
- `GET /api/validation/schema/:ruleType` - Get specific rule schema
- `POST /api/validation/validate-rule` - Validate rule configuration

## Advanced Features

### Console Interception
The system automatically captures console messages (log, info, warn, error) during JavaScript execution for validation purposes.

### Event Listener Monitoring
Event listeners attached during code execution are tracked and can be validated.

### Safe JavaScript Execution
JavaScript code is executed in a controlled JSDOM environment with security considerations.

## Usage in Project Steps

Each project step should have a `validationRules` field containing an array of validation rule objects. The enhanced system is backward compatible with existing rules.

```json
{
  "instructions": "Create an interactive button that changes color on click",
  "validationRules": [
    { "type": "elementExists", "selector": "button" },
    { "type": "elementHasClass", "selector": "button", "className": "interactive" },
    { "type": "eventListenerAttached", "selector": "button", "eventType": "click" },
    {
      "type": "eventDispatchChangesDom",
      "selector": "button",
      "eventType": "click",
      "expectChange": true,
      "condition": "getComputedStyle(document.querySelector('button')).backgroundColor !== 'rgb(255, 255, 255)'"
    }
  ]
}
```