/**
 * @file examples/ExampleComponent.jsx
 * @description Example React component demonstrating best practices
 * 
 * This component shows:
 * - Proper PropTypes validation
 * - Error handling and loading states
 * - Custom hooks usage
 * - Memoization for performance
 * - Accessibility features
 * - Clean code structure
 */

import React, { useState, useEffect, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { useStore } from '../hooks/useStore';
import { toast } from 'react-toastify';

/**
 * Subcomponent for loading state
 */
const LoadingSkeleton = () => (
  <div className="skeleton-container" role="status" aria-label="Loading">
    <div className="skeleton-line" />
    <div className="skeleton-line" />
    <div className="skeleton-line" />
  </div>
);

/**
 * Subcomponent for error state
 */
const ErrorMessage = memo(({ error, onRetry }) => (
  <div className="error-container" role="alert">
    <p className="error-message">❌ {error}</p>
    {onRetry && (
      <button onClick={onRetry} className="retry-button">
        Попробовать снова
      </button>
    )}
  </div>
));

ErrorMessage.propTypes = {
  error: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
};

/**
 * Subcomponent for empty state
 */
const EmptyState = memo(({ message, actionLabel, onAction }) => (
  <div className="empty-state">
    <p>{message || 'Нет данных для отображения'}</p>
    {actionLabel && onAction && (
      <button onClick={onAction} className="primary-button">
        {actionLabel}
      </button>
    )}
  </div>
));

EmptyState.propTypes = {
  message: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
};

/**
 * Course card component
 */
const CourseCard = memo(({ course, onClick }) => {
  const handleClick = () => {
    onClick(course.id);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(course.id);
    }
  };

  return (
    <div
      className="course-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Open course: ${course.title}`}
    >
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <div className="course-meta">
        <span className="project-count">
          📚 {course.projectCount || 0} проектов
        </span>
      </div>
    </div>
  );
});

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    projectCount: PropTypes.number,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

/**
 * Main component - Course List
 * 
 * @component
 * @example
 * ```jsx
 * <CourseList
 *   onCourseSelect={(courseId) => console.log(courseId)}
 *   showCreateButton={true}
 * />
 * ```
 */
const CourseList = observer(({ onCourseSelect, showCreateButton = false }) => {
  // 1. Hooks - всегда в начале компонента
  const { courseStore } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);

  // 2. Effects
  useEffect(() => {
    // Загрузка курсов при монтировании
    const fetchCourses = async () => {
      try {
        await courseStore.fetchCourses();
      } catch (error) {
        toast.error('Не удалось загрузить курсы');
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [courseStore]);

  // Фильтрация курсов при изменении поискового запроса
  useEffect(() => {
    if (!courseStore.courses) return;

    const filtered = courseStore.courses.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredCourses(filtered);
  }, [searchQuery, courseStore.courses]);

  // 3. Callbacks - мемоизированные функции
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCourseClick = useCallback(
    (courseId) => {
      if (onCourseSelect) {
        onCourseSelect(courseId);
      }
    },
    [onCourseSelect]
  );

  const handleRetry = useCallback(async () => {
    try {
      await courseStore.fetchCourses();
      toast.success('Курсы загружены');
    } catch (error) {
      toast.error('Ошибка при повторной загрузке');
    }
  }, [courseStore]);

  const handleCreateCourse = useCallback(() => {
    // Логика создания курса
    toast.info('Функция создания курса');
  }, []);

  // 4. Render logic с различными состояниями

  // Loading state
  if (courseStore.isLoading) {
    return (
      <div className="course-list-container">
        <h2>Курсы</h2>
        <LoadingSkeleton />
      </div>
    );
  }

  // Error state
  if (courseStore.error) {
    return (
      <div className="course-list-container">
        <h2>Курсы</h2>
        <ErrorMessage error={courseStore.error} onRetry={handleRetry} />
      </div>
    );
  }

  // Empty state
  if (!filteredCourses || filteredCourses.length === 0) {
    return (
      <div className="course-list-container">
        <h2>Курсы</h2>
        {searchQuery ? (
          <EmptyState message={`Курсы по запросу "${searchQuery}" не найдены`} />
        ) : (
          <EmptyState
            message="Курсы пока не созданы"
            actionLabel={showCreateButton ? 'Создать первый курс' : undefined}
            onAction={showCreateButton ? handleCreateCourse : undefined}
          />
        )}
      </div>
    );
  }

  // 5. Main render
  return (
    <div className="course-list-container">
      <header className="course-list-header">
        <h2>Курсы</h2>
        {showCreateButton && (
          <button
            onClick={handleCreateCourse}
            className="create-button"
            aria-label="Create new course"
          >
            + Создать курс
          </button>
        )}
      </header>

      {/* Search input */}
      <div className="search-container">
        <input
          type="search"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Поиск курсов..."
          className="search-input"
          aria-label="Search courses"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="clear-search"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results info */}
      <div className="results-info">
        Найдено курсов: {filteredCourses.length}
      </div>

      {/* Course grid */}
      <div className="course-grid" role="list">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onClick={handleCourseClick}
          />
        ))}
      </div>
    </div>
  );
});

// PropTypes для type checking
CourseList.propTypes = {
  /**
   * Callback вызываемый при выборе курса
   */
  onCourseSelect: PropTypes.func,
  /**
   * Показывать ли кнопку создания курса
   */
  showCreateButton: PropTypes.bool,
};

// Default props
CourseList.defaultProps = {
  showCreateButton: false,
};

// Display name для debugging
CourseList.displayName = 'CourseList';

export default CourseList;
