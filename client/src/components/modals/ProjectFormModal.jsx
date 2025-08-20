/**
 * @file components/modals/ProjectFormModal.jsx
 * @description Модальное окно с формой для СОЗДАНИЯ нового проекта.
 */
import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import "./Modal.css";

const ProjectFormModal = observer(() => {
  const { courseStore } = useStore();

  // Локальное состояние для полей формы
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(0);
  const [html_template, setHtmlTemplate] = useState(
    "<div>\n  <!-- Ваш код здесь -->\n</div>"
  );
  const [css_template, setCssTemplate] = useState("/* Ваши стили здесь */");
  const [js_template, setJsTemplate] = useState("// Ваш JS здесь");
  const [error, setError] = useState("");

  if (!courseStore.isProjectCreateModalOpen) {
    return null;
  }

  const handleClose = () => {
    // Сбрасываем все поля при закрытии
    setTitle("");
    setDescription("");
    setOrder(0);
    setHtmlTemplate("<div>\n  <!-- Ваш код здесь -->\n</div>");
    setCssTemplate("/* Ваши стили здесь */");
    setJsTemplate("// Ваш JS здесь");
    setError("");
    courseStore.closeProjectCreateModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await courseStore.createProject({
        title,
        description,
        order,
        html_template,
        css_template,
        js_template,
      });
      handleClose();
    } catch (err) {
      setError(
        err.response?.data?.error || "Произошла ошибка при создании проекта"
      );
    }
  };

  const isLoading = courseStore.isLoadingProjectCreate;

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Создать новый проект</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="proj-title">Название проекта</label>
            <input
              id="proj-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="proj-order">Порядковый номер</label>
            <input
              id="proj-order"
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="proj-desc">Описание</label>
            <textarea
              id="proj-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />
          </div>
          <div className="form-group">
            <label htmlFor="proj-html">HTML-шаблон</label>
            <textarea
              id="proj-html"
              value={html_template}
              onChange={(e) => setHtmlTemplate(e.target.value)}
              rows="5"
            />
          </div>
          <div className="form-group">
            <label htmlFor="proj-css">CSS-шаблон</label>
            <textarea
              id="proj-css"
              value={css_template}
              onChange={(e) => setCssTemplate(e.target.value)}
              rows="5"
            />
          </div>
          <div className="form-group">
            <label htmlFor="proj-js">JS-шаблон</label>
            <textarea
              id="proj-js"
              value={js_template}
              onChange={(e) => setJsTemplate(e.target.value)}
              rows="5"
            />
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
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? "Создание..." : "Создать проект"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default ProjectFormModal;
