/**
 * @file components/ProjectListItem.jsx
 * @description Компонент для отображения одного проекта в списке на странице курса.
 */
import React from "react";
import { Link } from "react-router-dom";

// Стили можно вынести в отдельный CSS-файл
const itemStyle = {
  display: "flex",
  alignItems: "center",
  padding: "15px 20px",
  marginBottom: "10px",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  textDecoration: "none",
  color: "inherit",
  transition: "background-color 0.2s ease, box-shadow 0.2s ease",
};

const itemHoverStyle = {
  backgroundColor: "#f9f9f9",
  boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
};

const orderStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "#007bff",
  marginRight: "20px",
};

const ProjectListItem = ({ project }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  // В будущем мы будем переходить на страницу вроде /projects/5
  // А пока ссылка ведет на заглушку
  const projectUrl = `/projects/${project.id}`;

  return (
    <Link
      to={projectUrl}
      style={itemStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={isHovered ? { ...itemStyle, ...itemHoverStyle } : itemStyle}>
        <div style={orderStyle}>{project.order}</div>
        <div>
          <h4 style={{ margin: "0 0 5px 0" }}>{project.title}</h4>
          {/* Можно добавить краткое описание, если оно есть */}
          {/* <p style={{ margin: 0, color: '#666' }}>{project.description}</p> */}
        </div>
      </div>
    </Link>
  );
};

export default ProjectListItem;
