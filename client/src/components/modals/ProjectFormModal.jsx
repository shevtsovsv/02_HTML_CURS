// /**
//  * @file components/modals/ProjectFormModal.jsx
//  * @description Модальное окно с формой для СОЗДАНИЯ нового проекта.
//  */
// import React, { useState } from "react";
// import { observer } from "mobx-react-lite";
// import { useStore } from "../../hooks/useStore";
// import "./Modal.css";

// const ProjectFormModal = observer(() => {
//   const { courseStore } = useStore();

//   // Локальное состояние для полей формы
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [order, setOrder] = useState(0);
//   const [html_template, setHtmlTemplate] = useState(
//     "<div>\n  <!-- Ваш код здесь -->\n</div>"
//   );
//   const [css_template, setCssTemplate] = useState("/* Ваши стили здесь */");
//   const [js_template, setJsTemplate] = useState("// Ваш JS здесь");
//   const [error, setError] = useState("");

//   if (!courseStore.isProjectCreateModalOpen) {
//     return null;
//   }

//   const handleClose = () => {
//     // Сбрасываем все поля при закрытии
//     setTitle("");
//     setDescription("");
//     setOrder(0);
//     setHtmlTemplate("<div>\n  <!-- Ваш код здесь -->\n</div>");
//     setCssTemplate("/* Ваши стили здесь */");
//     setJsTemplate("// Ваш JS здесь");
//     setError("");
//     courseStore.closeProjectCreateModal();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       await courseStore.createProject({
//         title,
//         description,
//         order,
//         html_template,
//         css_template,
//         js_template,
//       });
//       handleClose();
//     } catch (err) {
//       setError(
//         err.response?.data?.error || "Произошла ошибка при создании проекта"
//       );
//     }
//   };

//   const isLoading = courseStore.isLoadingProjectCreate;

//   return (
//     <div className="modal-backdrop" onClick={handleClose}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <h2>Создать новый проект</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="proj-title">Название проекта</label>
//             <input
//               id="proj-title"
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="proj-order">Порядковый номер</label>
//             <input
//               id="proj-order"
//               type="number"
//               value={order}
//               onChange={(e) => setOrder(Number(e.target.value))}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="proj-desc">Описание</label>
//             <textarea
//               id="proj-desc"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               rows="3"
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="proj-html">HTML-шаблон</label>
//             <textarea
//               id="proj-html"
//               value={html_template}
//               onChange={(e) => setHtmlTemplate(e.target.value)}
//               rows="5"
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="proj-css">CSS-шаблон</label>
//             <textarea
//               id="proj-css"
//               value={css_template}
//               onChange={(e) => setCssTemplate(e.target.value)}
//               rows="5"
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="proj-js">JS-шаблон</label>
//             <textarea
//               id="proj-js"
//               value={js_template}
//               onChange={(e) => setJsTemplate(e.target.value)}
//               rows="5"
//             />
//           </div>

//           {error && <p className="error-message">{error}</p>}
//           <div className="modal-actions">
//             <button
//               type="button"
//               onClick={handleClose}
//               className="btn-secondary"
//             >
//               Отмена
//             </button>
//             <button type="submit" disabled={isLoading} className="btn-primary">
//               {isLoading ? "Создание..." : "Создать проект"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// });

// export default ProjectFormModal;

/**
 * @file components/modals/ProjectFormModal.jsx
 * @description Универсальное модальное окно с формой для СОЗДАНИЯ и РЕДАКТИРОВАНИЯ проекта.
 */
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';
import './Modal.css';

const ProjectFormModal = observer(() => {
  const { courseStore } = useStore();

  // Определяем режим работы (создание или редактирование)
  const isEditing = !!courseStore.editingProject;
  const projectToEdit = courseStore.editingProject;

  // Локальное состояние для всех полей формы
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(0);
  const [html_template, setHtmlTemplate] = useState('<div>\n  <!-- Ваш код здесь -->\n</div>');
  const [css_template, setCssTemplate] = useState('/* Ваши стили здесь */');
  const [js_template, setJsTemplate] = useState('// Ваш JS здесь');
  const [error, setError] = useState('');

  // Этот useEffect заполняет форму данными при открытии в режиме редактирования
  // или сбрасывает ее в режим создания.
  useEffect(() => {
    if (isEditing && projectToEdit) {
      // Режим редактирования: заполняем поля из объекта projectToEdit
      setTitle(projectToEdit.title);
      setDescription(projectToEdit.description || '');
      setOrder(projectToEdit.order || 0);
      setHtmlTemplate(projectToEdit.html_template || '');
      setCssTemplate(projectToEdit.css_template || '');
      setJsTemplate(projectToEdit.js_template || '');
    } else {
      // Режим создания: устанавливаем значения по умолчанию
      setTitle('');
      setDescription('');
      setOrder(0); // Можно вычислять следующий `order` на основе существующих проектов
      setHtmlTemplate('<div>\n  <!-- Ваш код здесь -->\n</div>');
      setCssTemplate('/* Ваши стили здесь */');
      setJsTemplate('// Ваш JS здесь');
    }
  }, [isEditing, projectToEdit]); // Запускаем при смене режима или объекта редактирования

  // Если модальное окно не должно быть открыто, ничего не рендерим
  if (!courseStore.isProjectCreateModalOpen && !courseStore.isProjectEditModalOpen) {
    return null;
  }

  const handleClose = () => {
    setError(''); // Сбрасываем ошибку
    isEditing ? courseStore.closeProjectEditModal() : courseStore.closeProjectCreateModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Собираем все данные из формы в один объект
    const projectData = { title, description, order, html_template, css_template, js_template };

    try {
      if (isEditing) {
        // Вызываем action для обновления
        await courseStore.updateProject(projectToEdit.id, projectData);
      } else {
        // Вызываем action для создания
        await courseStore.createProject(projectData);
      }
      handleClose(); // Закрываем окно при успехе
    } catch (err) {
      setError(err.response?.data?.error || 'Произошла неизвестная ошибка');
    }
  };

  // Определяем, какой флаг загрузки использовать
  const isLoading = courseStore.isLoadingProjectCreate || courseStore.isLoadingProjectUpdate;

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? "Редактировать проект" : "Создать новый проект"}</h2>
        <form onSubmit={handleSubmit}>
          {/* Название и порядок */}
          <div className="form-group">
            <label htmlFor="proj-title">Название проекта</label>
            <input id="proj-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="proj-order">Порядковый номер</label>
            <input id="proj-order" type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} required />
          </div>
          <div className="form-group">
            <label htmlFor="proj-desc">Описание</label>
            <textarea id="proj-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" />
          </div>
          
          {/* Шаблоны кода */}
          <div className="form-group">
            <label htmlFor="proj-html">HTML-шаблон</label>
            <textarea id="proj-html" value={html_template} onChange={(e) => setHtmlTemplate(e.target.value)} rows="5" />
          </div>
          <div className="form-group">
            <label htmlFor="proj-css">CSS-шаблон</label>
            <textarea id="proj-css" value={css_template} onChange={(e) => setCssTemplate(e.target.value)} rows="5" />
          </div>
          <div className="form-group">
            <label htmlFor="proj-js">JS-шаблон</label>
            <textarea id="proj-js" value={js_template} onChange={(e) => setJsTemplate(e.target.value)} rows="5" />
          </div>

          {error && <p className="error-message">{error}</p>}
          
          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="btn-secondary">Отмена</button>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? "Сохранение..." : isEditing ? "Сохранить изменения" : "Создать проект"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default ProjectFormModal;