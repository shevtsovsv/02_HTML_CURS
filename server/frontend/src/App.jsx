import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "mobx-react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CoursePage from "./pages/CoursePage";
import userStore from "./stores/userStore";
import CodeEditor from "./components/CodeEditor";

function App() {
  return (
    <Provider userStore={userStore}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/code" element={<CodeEditor />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/courses" element={<CoursePage />} />
          <Route path="/course/:id" element={<CoursePage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
