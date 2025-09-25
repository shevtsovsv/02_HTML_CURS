# Enhanced Validation System

## Overview

This project has been enhanced with a comprehensive validation system that supports HTML, CSS, JavaScript, and logical composition validation rules. The system includes a visual Rule Builder interface and 21 different validation rule types.

## Key Features

### 🎯 21 Validation Rule Types

#### HTML Rules (8)
- `elementExists` - Check if element exists
- `elementNotExists` - Check if element doesn't exist  
- `elementText` - Validate element text content
- `elementMatches` - Regex pattern matching for content
- `elementHasClass` - Check if element has specific class
- `elementAttribute` - Validate attribute values
- `elementHasAttribute` - Check if attribute exists
- `elementCount` - Count matching elements

#### CSS Rules (3)
- `computedStyle` - Check computed CSS values
- `styleRuleExists` - Verify CSS rules exist
- `styleRuleProperty` - Check CSS rule properties

#### JavaScript Rules (6)
- `jsGlobalDefined` - Check global variables/functions
- `jsExpression` - Evaluate JavaScript expressions
- `jsFunctionReturns` - Test function return values
- `jsConsoleContains` - Monitor console messages
- `eventListenerAttached` - Verify event listeners
- `eventDispatchChangesDom` - Test DOM interactions

#### Logic Rules (4)
- `allOf` - All rules must pass (AND)
- `anyOf` - At least one rule must pass (OR)
- `not` - Rule must not pass (NOT)
- `countAtLeast` - Minimum N rules must pass

### 🛠 Visual Rule Builder

The system includes a React-based Rule Builder component that allows creating validation rules without writing JSON manually:

- **Category-based selection** - Rules organized by HTML/CSS/JavaScript/Logic
- **Parameter validation** - Real-time validation with error feedback
- **Live preview** - See generated JSON rules
- **Help text** - Examples and descriptions for each rule type

### 🔒 Safe Execution Environment

JavaScript validation runs in a controlled JSDOM environment with:

- **Console interception** - Captures console messages safely
- **Event monitoring** - Tracks addEventListener calls
- **Sandboxed execution** - Secure code execution
- **Error handling** - Robust error management

## Installation & Setup

### Backend Setup

1. Navigate to server directory:
```bash
cd server
npm install
```

2. Start the server:
```bash
npm run dev
```

The validation API will be available at `/api/validation/*`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
npm install
```

2. Start the development server:
```bash
npm run dev
```

## API Endpoints

### GET `/api/validation/categories`
Returns all validation rule categories with their rules.

```json
{
  "success": true,
  "categories": {
    "HTML": [
      {
        "type": "elementExists",
        "title": "Элемент существует",
        "description": "Проверяет, что элемент с указанным селектором существует"
      }
    ]
  }
}
```

### GET `/api/validation/schema`
Returns the complete validation schema with all rule definitions.

### GET `/api/validation/schema/:ruleType`
Returns the schema for a specific rule type.

### POST `/api/validation/validate-rule`
Validates a rule configuration before saving.

```json
{
  "type": "elementExists",
  "selector": "h1"
}
```

## Usage Examples

### Basic HTML Validation

```json
{
  "instructions": "Create a heading with specific text",
  "validationRules": [
    { "type": "elementExists", "selector": "h1" },
    { "type": "elementText", "selector": "h1", "expected": "Welcome!" }
  ]
}
```

### Advanced CSS + JavaScript Validation

```json
{
  "instructions": "Create an interactive button",
  "validationRules": [
    {
      "type": "allOf",
      "rules": [
        { "type": "elementExists", "selector": "button" },
        { "type": "computedStyle", "selector": "button", "property": "padding", "expected": "10px 20px" },
        { "type": "eventListenerAttached", "selector": "button", "eventType": "click" }
      ]
    },
    {
      "type": "eventDispatchChangesDom",
      "selector": "button", 
      "eventType": "click",
      "expectChange": true,
      "condition": "document.querySelector('button').textContent !== 'Click me'"
    }
  ]
}
```

### Complex Logic with OR Conditions

```json
{
  "validationRules": [
    {
      "type": "anyOf",
      "rules": [
        { "type": "elementHasClass", "selector": "button", "className": "btn-primary" },
        { "type": "elementHasClass", "selector": "button", "className": "btn-secondary" }
      ]
    }
  ]
}
```

## Testing

Run the validation system tests:

```bash
cd server
node test/validationTest.js
node test/apiTest.js
```

View example projects:

```bash
node examples/enhanced-validation-examples.js
```

## Component Integration

### Using the Rule Builder

```jsx
import RuleBuilder from './components/ProjectPage/RuleBuilder';

function ProjectAdmin() {
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);
  
  const handleRuleCreate = (rule) => {
    // Add rule to validation rules
    console.log('New rule created:', rule);
    setShowRuleBuilder(false);
  };

  return (
    <div>
      <button onClick={() => setShowRuleBuilder(true)}>
        Add Validation Rule
      </button>
      
      {showRuleBuilder && (
        <RuleBuilder
          onRuleCreate={handleRuleCreate}
          onClose={() => setShowRuleBuilder(false)}
        />
      )}
    </div>
  );
}
```

## File Structure

```
server/
├── lib/
│   ├── validationRules.js        # Core validation logic
│   └── validationSchema.js       # Rule schema definitions
├── controllers/
│   ├── validationController.js   # Main validation controller  
│   └── validationSchemaController.js # Schema API controller
├── routes/
│   └── validation.js             # Validation API routes
├── test/
│   ├── validationTest.js         # Validation tests
│   └── apiTest.js                # API configuration tests
├── examples/
│   └── enhanced-validation-examples.js # Example projects
└── docs/
    └── validation-rules.md       # Complete documentation

client/
└── src/
    └── components/
        └── ProjectPage/
            ├── RuleBuilder.jsx   # Rule Builder component
            └── RuleBuilder.css   # Rule Builder styles
```

## Advanced Features

### Console Message Monitoring

```json
{
  "type": "jsConsoleContains",
  "message": "Function executed successfully",
  "consoleType": "log"
}
```

### Event-Driven Validation

```json
{
  "type": "eventDispatchChangesDom",
  "selector": "#toggle-btn",
  "eventType": "click", 
  "expectChange": true,
  "condition": "document.querySelector('.content').style.display === 'block'"
}
```

### Regular Expression Matching

```json
{
  "type": "elementMatches",
  "selector": ".date",
  "pattern": "\\d{2}\\.\\d{2}\\.\\d{4}",
  "flags": "g"
}
```

### Complex Logical Compositions

```json
{
  "type": "countAtLeast",
  "minimum": 3,
  "rules": [
    { "type": "elementExists", "selector": "h1" },
    { "type": "elementExists", "selector": "p" },
    { "type": "elementExists", "selector": "img" },
    { "type": "elementExists", "selector": "button" },
    { "type": "elementExists", "selector": "form" }
  ]
}
```

## Migration from Old System

The new system is backward compatible. Existing validation rules will continue to work without changes. To upgrade existing rules to use new features:

1. **Simple HTML rules** - No changes needed
2. **CSS rules** - Can enhance with `styleRuleExists` and `styleRuleProperty`
3. **Add JavaScript validation** - Use new JS rules for interactive features
4. **Add logical compositions** - Wrap existing rules in `allOf`, `anyOf`, etc.

## Performance Considerations

- **JSDOM Environment** - Each validation creates a new JSDOM instance
- **JavaScript Execution** - Code runs safely but consider timeout limits
- **Memory Usage** - Large validation rule sets may need optimization
- **Caching** - Consider caching validation schemas for better performance

## Contributing

To add new validation rule types:

1. Add the rule method to `ValidationRules` class
2. Add schema definition to `validationSchema.js`
3. Add tests to `validationTest.js`
4. Update documentation in `validation-rules.md`

## Support

For questions or issues with the enhanced validation system:

1. Check the test files for usage examples
2. Review the example projects in `server/examples/`
3. Consult the complete documentation in `server/docs/validation-rules.md`