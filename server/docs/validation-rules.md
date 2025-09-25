# Validation Rules Documentation

## Supported Validation Types

The validation controller supports the following validation rule types:

### 1. `elementExists`
Checks if an element with the specified selector exists in the document.

**Parameters:**
- `selector` (string): CSS selector

**Example:**
```json
{ "type": "elementExists", "selector": "h1" }
```

### 2. `elementText`
Checks if an element contains the expected text content.

**Parameters:**
- `selector` (string): CSS selector
- `expected` (string): Expected text content

**Example:**
```json
{ "type": "elementText", "selector": "h1", "expected": "Welcome!" }
```

### 3. `elementAttribute`
Checks if an element's attribute has the expected value.

**Parameters:**
- `selector` (string): CSS selector
- `attribute` (string): Attribute name
- `expected` (string): Expected attribute value

**Example:**
```json
{ "type": "elementAttribute", "selector": "img", "attribute": "alt", "expected": "My image" }
```

### 4. `elementCount`
Checks if the number of elements matching the selector equals the expected count.

**Parameters:**
- `selector` (string): CSS selector
- `expected` (number): Expected number of elements

**Example:**
```json
{ "type": "elementCount", "selector": "ul li", "expected": 3 }
```

### 5. `elementHasAttribute`
Checks if an element has a specific attribute (regardless of its value).

**Parameters:**
- `selector` (string): CSS selector
- `attribute` (string): Attribute name

**Example:**
```json
{ "type": "elementHasAttribute", "selector": "img", "attribute": "src" }
```

### 6. `computedStyle`
Checks if an element's computed CSS style property has the expected value.

**Parameters:**
- `selector` (string): CSS selector
- `property` (string): CSS property name
- `expected` (string): Expected property value

**Example:**
```json
{ "type": "computedStyle", "selector": ".card", "property": "width", "expected": "300px" }
```

## Usage in Project Steps

Each project step should have a `validationRules` field containing an array of validation rule objects:

```json
{
  "instructions": "Create a heading with the text 'Hello World'",
  "validationRules": [
    { "type": "elementExists", "selector": "h1" },
    { "type": "elementText", "selector": "h1", "expected": "Hello World" }
  ]
}
```