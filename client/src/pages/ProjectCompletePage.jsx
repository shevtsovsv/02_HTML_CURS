/**
 * @file pages/ProjectCompletePage.jsx
 * @description Страница, которая отображается после успешного завершения проекта.
 */
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../hooks/useStore';
import PreviewPane from '../components/ProjectPage/PreviewPane'; // Переиспользуем наше превью
import './ProjectCompletePage.css'; // Создадим файл для стилей

const ProjectCompletePage = observer(() => {
  const { projectStore } = useStore();
  const { id: projectId } = useParams();

  // Загружаем данные проекта, чтобы показать финальный результат
  useEffect(() => {
    if (projectId) {
      projectStore.fetchProject(projectId);
    }
  }, [projectId, projectStore]);

  if (projectStore.isLoading || !projectStore.currentProject) {
    return <div>Загрузка результатов...</div>;
  }

  const project = projectStore.currentProject;
  // Нам нужен код самого последнего шага
  const lastStep = project.steps?.slice().sort((a, b) => b.order - a.order)[0];
  const finalCode = project.userCodes?.find(code => code.step_id === lastStep?.id);
  
  return (
    <div className="completion-container">
      <div className="completion-card">
        <h1>🎉 Поздравляем!</h1>
        <h2>Вы успешно завершили проект "{project.title}"</h2>
        <p>Отличная работа! Вы сделали еще один шаг к освоению веб-разработки.</p>

        {/* Финальное превью */}
        <div className="final-preview">
          <h3>Ваш итоговый результат:</h3>
          <div className="preview-wrapper">
            {finalCode ? (
              <PreviewPane html={finalCode.html} css={finalCode.css} js={finalCode.js} />
            ) : (
              <p>Не удалось загрузить итоговый код.</p>
            )}
          </div>
        </div>
        
        {/* Кнопки "Что дальше?" */}
        <div className="completion-actions">
          <Link to={`/courses/${project.course?.slug}`} className="btn-secondary">
            Вернуться к курсу
          </Link>
          {/* В будущем здесь может быть ссылка на следующий проект */}
          <Link to="/dashboard" className="btn-primary">
            К другим курсам
          </Link>
        </div>
      </div>
    </div>
  );
});

export default ProjectCompletePage;