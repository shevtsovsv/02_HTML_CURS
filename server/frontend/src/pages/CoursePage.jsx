import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const CoursePage = () => {
  const [courses, setCoures] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/courses")
      .then((response) => {
        setCoures(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the tasks:", error);
      });
  }, []);
  useEffect(() => console.log(courses), [courses]);
  return (
    <div>
      <h1>Course Tasks</h1>
      <ul>
        {courses.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default CoursePage;
