// Desc: Main entry point for the application
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import './styles/variables.css';
import ProtectedRoute from './front/ProtectedRoute.jsx';
import Dashboard from './front/Dashboard.jsx';
import Login from './front/Login.jsx';
import Register from './front/Register.jsx';
import NotFoundPage from './front/NotFoundPage.jsx';
import Code from './front/Code.jsx';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="mobile">
        <h1>Mobile version is not supported</h1>
        <p>Please use a desktop browser to access this application.</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route
          path='/dash'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/code'
          element={
            <ProtectedRoute>
              <Code />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
