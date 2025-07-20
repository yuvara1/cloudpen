import React, { useEffect } from 'react';
import Select from 'react-select';
import { FaSun, FaMoon, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { IoDocumentTextOutline } from "react-icons/io5";
import { BiNotepad } from "react-icons/bi";
import './styles/Navbar.css';

const Navbar = ({ userLang, setUserLang, userTheme, setUserTheme, fontSize, setFontSize,fileName }) => {
     const navigate = useNavigate();
     const languages = [
          { value: "c", label: "C" },
          { value: "cpp", label: "C++" },
          { value: "python", label: "Python" },
          { value: "java", label: "Java" },
     ];

     // Update theme in body class for consistent styling
     useEffect(() => {
          // Apply saved theme preference or default to "light"
          const savedTheme = localStorage.getItem('theme') || 'light';

          // Set editor theme based on body theme
          if (setUserTheme) {
               setUserTheme(savedTheme === 'dark' ? 'vs-dark' : 'light');
          }

          // Apply theme class to body
          document.body.className = savedTheme;
     }, [setUserTheme]);

     const handleThemeToggle = () => {
          const newTheme = userTheme === 'light' ? 'vs-dark' : 'light';
          setUserTheme(newTheme);

          // Save theme preference and update body class
          const bodyTheme = newTheme === 'vs-dark' ? 'dark' : 'light';
          document.body.className = bodyTheme;
          localStorage.setItem('theme', bodyTheme);
     };

     // Logout handler
     const handleLogout = () => {
          localStorage.clear();
          navigate('/');
     };

     // Custom styles for react-select to match the theme
     const customStyles = {
          control: (provided) => ({
               ...provided,
               backgroundColor: document.body.className === 'dark' ? '#1f2937' : '#ffffff',
               color: document.body.className === 'dark' ? '#f9fafb' : '#1f2937',
               borderColor: 'rgba(59, 130, 246, 0.3)',
               boxShadow: 'none',
               '&:hover': {
                    borderColor: '#3b82f6',
               }
          }),
          singleValue: (provided) => ({
               ...provided,
               color: document.body.className === 'dark' ? '#f9fafb' : '#1f2937',
          }),
          menu: (provided) => ({
               ...provided,
               backgroundColor: document.body.className === 'dark' ? '#1f2937' : '#ffffff',
          }),
          option: (provided, state) => ({
               ...provided,
               backgroundColor: state.isSelected
                    ? '#3b82f6'
                    : state.isFocused
                         ? document.body.className === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(59, 130, 246, 0.1)'
                         : 'transparent',
               color: state.isSelected
                    ? '#ffffff'
                    : document.body.className === 'dark' ? '#f9fafb' : '#1f2937',
               '&:hover': {
                    backgroundColor: document.body.className === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(59, 130, 246, 0.1)',
               }
          }),
     };

     return (
          <div className="navbar">
               <div className="navbar-items">

                    <Link className='navbar-logo' to="/dash" onClick={() => window.reload()}>
                         <h1>Cloud Pen</h1>
                    </Link>
                    <div className="file-name">
                         {fileName ? <span>{fileName}</span> : <span>Select a file to edit</span>}
                    </div>
                    <div className="navbar-controls">
                         {userLang && (
                              <Select
                                   className='options'
                                   options={languages}
                                   value={languages.find(lang => lang.value === userLang)}
                                   onChange={(e) => setUserLang(e.value)}
                                   styles={customStyles}
                              />
                         )}

                         <div className="theme-icons" onClick={handleThemeToggle}>
                              {userTheme === 'light' ? (
                                   <FaMoon className="icon" />
                              ) : (
                                   <FaSun className="icon" />
                              )}
                         </div>

                         {fontSize && (
                              <div className="font-size-control">
                                   <label>Font Size</label>
                                   <input
                                        type="range"
                                        min="16"
                                        max="28"
                                        value={fontSize}
                                        step="2"
                                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                                   />
                              </div>
                         )}

                         {window.location.pathname.includes('/code') ? (
                              <Link to="/dash">
                                   <BiNotepad className="icon" />
                                   <span>Text Editor</span>
                              </Link>
                         ) : (
                              <Link to="/code">
                                   <IoDocumentTextOutline className="icon" />
                                   <span>Code Editor</span>
                              </Link>
                         )}

                         <button className="logout-btn" onClick={handleLogout} title="Logout">
                              <FaSignOutAlt className="icon" />
                              <span>Logout</span>
                         </button>
                    </div>
               </div>
          </div>
     );
};

export default Navbar;