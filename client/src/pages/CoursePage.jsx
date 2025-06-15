/**
 * @file pages/CoursePage.jsx
 * @description Страница для детального просмотра одного курса и списка его проектов.
 */
import React, { useEffect } from "react";
import { useParams } from "react-router-dom"; // Хук для получения параметров из URL
import { observer } from "mobx-react-lite";
import { useStore } from "../hooks/useStore";
import ProjectListItem from "../components/ProjectListItem";

const CoursePage = observer(() => {
  const { courseStore } = useStore();
  // useParams() достает параметры из URL. В нашем случае, :slug
  const { slug } = useParams();

  useEffect(() => {
    // Когда компонент монтируется или slug меняется, запрашиваем данные о курсе
    if (slug) {
      courseStore.fetchCourseBySlug(slug);
    }
  }, [slug, courseStore]);

  // Пока данные грузятся, показываем заглушку
  if (courseStore.isLoading || !courseStore.currentCourse) {
    return <div>Загрузка курса...</div>;
  }

  const { title, description, projects } = courseStore.currentCourse;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{title}</h1>
      <p style={{ color: "#555" }}>{description}</p>
      <hr />
      <h2>Проекты курса</h2>
      <div>
        {/* --- 2. Используем ProjectListItem в цикле --- */}
        {projects && projects.length > 0 ? (
          projects
            // На всякий случай отсортируем проекты по полю order
            .slice() // .slice() создает копию, чтобы не мутировать исходный массив в сторе
            .sort((a, b) => a.order - b.order)
            .map((project) => (
              <ProjectListItem key={project.id} project={project} />
            ))
        ) : (
          <p>В этом курсе пока нет проектов.</p>
        )}
      </div>
    </div>
  );
});

export default CoursePage;
