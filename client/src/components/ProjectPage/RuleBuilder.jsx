/**
 * @file components/ProjectPage/RuleBuilder.jsx
 * @description Rule Builder component for creating validation rules
 */
import React, { useState, useEffect, useRef } from "react";
import api from "../../api";
import "./RuleBuilder.css";

const RuleBuilder = ({ onRuleCreate, onClose }) => {
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRuleType, setSelectedRuleType] = useState("");
  const [ruleSchema, setRuleSchema] = useState(null);
  const [ruleData, setRuleData] = useState({});
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedRuleType) {
      loadRuleSchema(selectedRuleType);
    }
  }, [selectedRuleType]);

  // Предотвращаем закрытие при переключении вкладок
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Не делаем ничего при смене видимости страницы
    };

    const handleFocusLoss = (e) => {
      // Проверяем, что фокус не перешел внутри модального окна
      if (modalRef.current && modalRef.current.contains(e.relatedTarget)) {
        return;
      }
      // Не закрываем модальное окно при потере фокуса
    };

    const handleEscapeKey = (e) => {
      // Закрываем только при явном нажатии Escape и только если модальное окно активно
      if (
        e.key === "Escape" &&
        e.isTrusted &&
        document.activeElement &&
        modalRef.current &&
        modalRef.current.contains(document.activeElement)
      ) {
        onClose();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("focusout", handleFocusLoss);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("focusout", handleFocusLoss);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  const loadCategories = async () => {
    try {
      const response = await api.get("/validation/categories");
      if (response.data.success) {
        setCategories(response.data.categories);
        // Don't auto-select the first category - let the user choose
      }
      setLoading(false);
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
      setLoading(false);
    }
  };

  const loadRuleSchema = async (ruleType) => {
    try {
      const response = await api.get(`/validation/schema/${ruleType}`);
      if (response.data.success) {
        setRuleSchema(response.data.rule);
        // Initialize rule data with defaults
        const initialData = { type: ruleType };
        Object.keys(response.data.rule.parameters).forEach((paramName) => {
          const param = response.data.rule.parameters[paramName];
          if (param.default !== undefined) {
            initialData[paramName] = param.default;
          }
        });
        setRuleData(initialData);
      }
    } catch (error) {
      console.error("Ошибка загрузки схемы правила:", error);
    }
  };

  const handleParameterChange = (paramName, value) => {
    const param = ruleSchema.parameters[paramName];

    // Convert value based on parameter type
    let convertedValue = value;
    if (param.type === "number") {
      convertedValue = value === "" ? "" : Number(value);
    } else if (param.type === "boolean") {
      convertedValue = value === "true" || value === true;
    } else if (param.type === "json") {
      try {
        if (typeof value === "string" && value.trim()) {
          convertedValue = JSON.parse(value);
        }
      } catch {
        // Keep original value if JSON is invalid, validation will catch it
        convertedValue = value;
      }
    }

    setRuleData((prev) => ({
      ...prev,
      [paramName]: convertedValue,
    }));
  };

  const validateAndCreateRule = async () => {
    try {
      const response = await api.post("/validation/validate-rule", ruleData);

      if (response.data.success) {
        onRuleCreate(ruleData);
        setErrors([]);
      } else {
        setErrors(response.data.errors || ["Ошибка валидации"]);
      }
    } catch (error) {
      console.error("Ошибка валидации правила:", error);
      setErrors(["Ошибка сервера при валидации"]);
    }
  };

  // Безопасное закрытие модального окна - только при явном клике на backdrop
  const handleBackdropClick = (e) => {
    // Проверяем, что клик был именно на backdrop, а не на дочерние элементы
    if (e.target === e.currentTarget) {
      // Дополнительная проверка: убеждаемся что это был реальный клик мышью
      if (e.isTrusted && e.clientX > 0 && e.clientY > 0) {
        onClose();
      }
    }
  };

  const renderParameterInput = (paramName, param) => {
    const value = ruleData[paramName] || "";

    switch (param.type) {
      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleParameterChange(paramName, e.target.value)}
            min={param.min}
            max={param.max}
            placeholder={param.placeholder}
            className="rule-builder-input"
          />
        );

      case "boolean":
        return (
          <select
            value={value.toString()}
            onChange={(e) => handleParameterChange(paramName, e.target.value)}
            className="rule-builder-select"
          >
            <option value="true">Да</option>
            <option value="false">Нет</option>
          </select>
        );

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleParameterChange(paramName, e.target.value)}
            className="rule-builder-select"
          >
            <option value="">Выберите...</option>
            {param.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "text":
        return (
          <textarea
            value={value}
            onChange={(e) => handleParameterChange(paramName, e.target.value)}
            placeholder={param.placeholder}
            className="rule-builder-textarea"
            rows={3}
          />
        );

      case "json":
        return (
          <textarea
            value={
              typeof value === "string" ? value : JSON.stringify(value, null, 2)
            }
            onChange={(e) => handleParameterChange(paramName, e.target.value)}
            placeholder={param.placeholder}
            className="rule-builder-textarea"
            rows={4}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleParameterChange(paramName, e.target.value)}
            placeholder={param.placeholder}
            className="rule-builder-input"
          />
        );
    }
  };

  if (loading) {
    return <div className="rule-builder-loading">Загрузка...</div>;
  }

  return (
    <div className="rule-builder-backdrop" onClick={handleBackdropClick}>
      <div
        className="rule-builder"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rule-builder-header">
          <h3>Создание правила валидации</h3>
          <button onClick={onClose} className="rule-builder-close">
            ×
          </button>
        </div>

        <div className="rule-builder-content">
          {/* Category Selection */}
          <div className="rule-builder-section">
            <label className="rule-builder-label">Категория:</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedRuleType("");
                setRuleSchema(null);
              }}
              className="rule-builder-select"
            >
              <option value="">Выберите категорию...</option>
              {Object.keys(categories).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Rule Type Selection */}
          {selectedCategory && (
            <div className="rule-builder-section">
              <label className="rule-builder-label">Тип правила:</label>
              <select
                value={selectedRuleType}
                onChange={(e) => setSelectedRuleType(e.target.value)}
                className="rule-builder-select"
              >
                <option value="">Выберите тип правила...</option>
                {categories[selectedCategory].map((rule) => (
                  <option key={rule.type} value={rule.type}>
                    {rule.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Rule Description */}
          {ruleSchema && (
            <div className="rule-builder-section">
              <div className="rule-builder-description">
                {ruleSchema.description}
              </div>
            </div>
          )}

          {/* Parameters */}
          {ruleSchema &&
            Object.keys(ruleSchema.parameters).map((paramName) => {
              const param = ruleSchema.parameters[paramName];
              return (
                <div key={paramName} className="rule-builder-section">
                  <label className="rule-builder-label">
                    {param.title}
                    {param.required && <span className="required">*</span>}
                  </label>
                  {param.description && (
                    <div className="rule-builder-help">{param.description}</div>
                  )}
                  {renderParameterInput(paramName, param)}
                </div>
              );
            })}

          {/* Example */}
          {ruleSchema && (
            <div className="rule-builder-section">
              <label className="rule-builder-label">Пример:</label>
              <pre className="rule-builder-example">
                {JSON.stringify(ruleSchema.example, null, 2)}
              </pre>
            </div>
          )}

          {/* Current Rule Preview */}
          {ruleSchema && Object.keys(ruleData).length > 1 && (
            <div className="rule-builder-section">
              <label className="rule-builder-label">Текущее правило:</label>
              <pre className="rule-builder-preview">
                {JSON.stringify(ruleData, null, 2)}
              </pre>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="rule-builder-errors">
              {errors.map((error, index) => (
                <div key={index} className="rule-builder-error">
                  {error}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rule-builder-footer">
          <button
            onClick={validateAndCreateRule}
            disabled={!selectedRuleType}
            className="rule-builder-create-btn"
          >
            Создать правило
          </button>
          <button onClick={onClose} className="rule-builder-cancel-btn">
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default RuleBuilder;
