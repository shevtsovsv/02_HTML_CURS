import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../hooks/useStore";
import ProjectListItem from "../components/ProjectListItem";
import "./CoursePage.css"; // Подключаем стили

const CoursePage = observer(() => {
  const { courseStore } = useStore();
  const { slug } = useParams();

  useEffect(() => {
    if (slug) courseStore.fetchCourseBySlug(slug);
  }, [slug, courseStore]);

  if (courseStore.isLoading || !courseStore.currentCourse) {
    return <div>Загрузка курса...</div>;
  }

  const { title, description, projects } = courseStore.currentCourse;

  return (
    <div className="course-page-container">
      <div className="course-header">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <h2>Проекты курса</h2>
      <div>
        {projects && projects.length > 0 ? (
          projects
            .slice()
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
