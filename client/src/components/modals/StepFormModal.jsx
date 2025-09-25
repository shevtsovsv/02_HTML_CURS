/**
 * @file components/modals/StepFormModal.jsx
 * @description Модальное окно с формой для СОЗДАНИЯ и РЕДАКТИРОВАНИЯ шага проекта.
 */
import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import RuleBuilder from "../ProjectPage/RuleBuilder";
import "./Modal.css";

const StepFormModal = observer(() => {
  const { projectStore } = useStore();

  const isEditing = !!projectStore.editingStep;
  const stepToEdit = projectStore.editingStep;

  // Локальное состояние формы
  const [instructions, setInstructions] = useState("");
  const [order, setOrder] = useState(0);
  // Правила валидации будем хранить и редактировать как строку JSON
  const [validationRules, setValidationRules] = useState("[]");
  const [error, setError] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);

  useEffect(() => {
    if (isEditing && stepToEdit) {
      setInstructions(stepToEdit.instructions || "");
      setOrder(stepToEdit.order || 0);
      // Превращаем объект/массив JSON в отформатированную строку для удобного редактирования
      setValidationRules(JSON.stringify(stepToEdit.validationRules, null, 2));
    } else {
      // Устанавливаем порядок для нового шага (следующий после последнего)
      const nextOrder = projectStore.currentProject?.steps.length || 0;
      setOrder(nextOrder);
    }
  }, [isEditing, stepToEdit, projectStore.currentProject]);

  if (
    !projectStore.isStepCreateModalOpen &&
    !projectStore.isStepEditModalOpen
  ) {
    return null;
  }

  const handleClose = () => {
    // Сброс всех полей
    setInstructions("");
    setOrder(0);
    setValidationRules("[]");
    setError("");
    setJsonError("");
    isEditing
      ? projectStore.closeStepEditModal()
      : projectStore.closeStepCreateModal();
  };

  const handleValidationRulesChange = (e) => {
    const value = e.target.value;
    setValidationRules(value);
    // Проверяем валидность JSON "на лету"
    try {
      JSON.parse(value);
      setJsonError(""); // Если парсинг прошел, ошибки нет
    } catch {
      setJsonError("Невалидный JSON"); // Если парсинг упал, показываем ошибку
    }
  };

  const appendRule = (newRule) => {
    try {
      const current = validationRules?.trim() ? JSON.parse(validationRules) : [];
      const arr = Array.isArray(current) ? current : [];
      arr.push(newRule);
      setValidationRules(JSON.stringify(arr, null, 2));
      setJsonError('');
    } catch {
      // если текущее содержимое — невалидный JSON, просто заменим массивом с одним правилом
      setValidationRules(JSON.stringify([newRule], null, 2));
      setJsonError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (jsonError) return; // Не даем отправить форму с невалидным JSON

    setError("");
    try {
      // Превращаем строку обратно в объект JSON перед отправкой
      const rules = JSON.parse(validationRules);
      const stepData = { instructions, order, validationRules: rules };

      if (isEditing) {
        await projectStore.updateStep(stepToEdit.id, stepData);
      } else {
        await projectStore.createStep(stepData);
      }
      handleClose();
    } catch (err) {
      setError(err.response?.data?.error || "Произошла ошибка");
    }
  };

  const isLoading = projectStore.isLoadingStepAction;

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>
          {isEditing
            ? `Редактировать Шаг ${stepToEdit?.order}`
            : "Создать новый шаг"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="step-order">Порядковый номер</label>
            <input
              id="step-order"
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="step-instr">
              Инструкции (поддерживает Markdown)
            </label>
            <textarea
              id="step-instr"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows="5"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="step-rules">Правила валидации (JSON)</label>
            <textarea
              id="step-rules"
              value={validationRules}
              onChange={handleValidationRulesChange}
              rows="8"
              style={{
                fontFamily: "monospace",
                color: jsonError ? "#e53e3e" : "inherit",
              }}
            />
            {jsonError && (
              <p
                className="error-message"
                style={{ textAlign: "left", marginTop: "5px" }}
              >
                {jsonError}
              </p>
            )}
            <button
              type="button"
              onClick={() => setShowRuleBuilder(true)}
              style={{ marginTop: "10px" }}
            >
              Открыть конструктор правил
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading || !!jsonError}
              className="btn-primary"
            >
              {isLoading
                ? "Сохранение..."
                : isEditing
                ? "Сохранить"
                : "Создать"}
            </button>
          </div>
        </form>
      </div>
      {showRuleBuilder && (
        <RuleBuilder
          onRuleCreate={(rule) => {
            appendRule(rule);
            setShowRuleBuilder(false);
          }}
          onClose={() => setShowRuleBuilder(false)}
        />
      )}
    </div>
  );
});

export default StepFormModal;
