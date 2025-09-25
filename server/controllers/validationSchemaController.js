/**
 * @file controllers/validationSchemaController.js
 * @description Controller for validation schema management
 */

const validationSchema = require("../lib/validationSchema");

/**
 * @desc    Get validation rules schema for Rule Builder
 * @route   GET /api/validation/schema
 * @access  Public
 */
const getValidationSchema = (req, res) => {
  try {
    return res.json({
      success: true,
      schema: validationSchema
    });
  } catch (error) {
    console.error("Ошибка при получении схемы валидации:", error);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
};

/**
 * @desc    Get categories of validation rules
 * @route   GET /api/validation/categories
 * @access  Public
 */
const getValidationCategories = (req, res) => {
  try {
    const categories = {};
    
    Object.keys(validationSchema).forEach(ruleType => {
      const rule = validationSchema[ruleType];
      if (!categories[rule.category]) {
        categories[rule.category] = [];
      }
      categories[rule.category].push({
        type: ruleType,
        title: rule.title,
        description: rule.description
      });
    });

    return res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error("Ошибка при получении категорий валидации:", error);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
};

/**
 * @desc    Get specific validation rule schema
 * @route   GET /api/validation/schema/:ruleType
 * @access  Public
 */
const getValidationRuleSchema = (req, res) => {
  try {
    const { ruleType } = req.params;
    
    if (!validationSchema[ruleType]) {
      return res.status(404).json({ error: "Тип правила не найден" });
    }

    return res.json({
      success: true,
      rule: validationSchema[ruleType]
    });
  } catch (error) {
    console.error("Ошибка при получении схемы правила:", error);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
};

/**
 * @desc    Validate rule configuration
 * @route   POST /api/validation/validate-rule
 * @access  Public
 */
const validateRuleConfiguration = (req, res) => {
  try {
    const rule = req.body;
    const errors = [];
    
    if (!rule.type) {
      errors.push("Тип правила обязателен");
    } else if (!validationSchema[rule.type]) {
      errors.push(`Неизвестный тип правила: ${rule.type}`);
    } else {
      const schema = validationSchema[rule.type];
      
      // Validate required parameters
      Object.keys(schema.parameters).forEach(paramName => {
        const param = schema.parameters[paramName];
        if (param.required && (rule[paramName] === undefined || rule[paramName] === '')) {
          errors.push(`Параметр '${param.title}' обязателен`);
        }
        
        // Type validation
        if (rule[paramName] !== undefined) {
          switch (param.type) {
            case 'number':
              if (isNaN(rule[paramName])) {
                errors.push(`Параметр '${param.title}' должен быть числом`);
              } else {
                const num = Number(rule[paramName]);
                if (param.min !== undefined && num < param.min) {
                  errors.push(`Параметр '${param.title}' должен быть не менее ${param.min}`);
                }
                if (param.max !== undefined && num > param.max) {
                  errors.push(`Параметр '${param.title}' должен быть не более ${param.max}`);
                }
              }
              break;
            case 'boolean':
              if (typeof rule[paramName] !== 'boolean') {
                errors.push(`Параметр '${param.title}' должен быть логическим значением`);
              }
              break;
            case 'select':
              if (param.options && !param.options.includes(rule[paramName])) {
                errors.push(`Параметр '${param.title}' должен быть одним из: ${param.options.join(', ')}`);
              }
              break;
            case 'json':
              try {
                if (typeof rule[paramName] === 'string') {
                  JSON.parse(rule[paramName]);
                }
              } catch (e) {
                errors.push(`Параметр '${param.title}' должен быть валидным JSON`);
              }
              break;
          }
        }
      });
    }
    
    if (errors.length > 0) {
      return res.json({ success: false, errors });
    }
    
    return res.json({ success: true, message: "Правило валидно" });
  } catch (error) {
    console.error("Ошибка при валидации конфигурации правила:", error);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
};

module.exports = {
  getValidationSchema,
  getValidationCategories,
  getValidationRuleSchema,
  validateRuleConfiguration
};