/**
 * @file components/CourseCard.jsx
 * @description Переиспользуемый компонент для отображения карточки курса.
 * Это "глупый" компонент, который просто получает данные через props и отображает их.
 */
import React from "react";
import { Link } from "react-router-dom"; // Для создания ссылки на страницу курса
import { useStore } from "../hooks/useStore";

// Простое стилизованное оформление. Вы можете вынести стили в отдельный CSS-файл.
const cardStyle = {
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  transition: "transform 0.2s ease-in-out",
};

const cardHoverStyle = {
  transform: "translateY(-5px)",
};

const CourseCard = ({ course, isAdmin, onDelete }) => {
  const { courseStore } = useStore();
  // Состояние для отслеживания наведения мыши для добавления hover-эффекта
  const [isHovered, setIsHovered] = React.useState(false);
  console.log(isAdmin);

  const handleEditClick = (e) => {
    // Предотвращаем переход по ссылке, когда кликаем на кнопку
    e.preventDefault();
    e.stopPropagation();
    courseStore.openEditModal(course); // <-- 3. Вызываем action
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(course); // Вызываем функцию, переданную из родителя
  };

  return (
    <div style={{ position: "relative" }}>
      <Link
        to={`/courses/${course.slug}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div
          style={{ ...cardStyle, ...(isHovered ? cardHoverStyle : {}) }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <p>
            <strong>Проектов в курсе:</strong>{" "}
            {course.projects ? course.projects.length : 0}
          </p>
        </div>
      </Link>
      {/* --- КНОПКИ ДЛЯ АДМИНА ВНУТРИ КАРТОЧКИ --- */}
      {isAdmin && (
        <div
          className="card-admin-actions"
          style={{ position: "absolute", top: "15px", right: "15px" }}
        >
          <button onClick={handleEditClick} style={{ marginRight: "5px" }}>
            ✏️
          </button>
          <button onClick={handleDeleteClick}>🗑️</button>
        </div>
      )}
      {/* -------------------------------------- */}
    </div>
  );
};

export default CourseCard;
