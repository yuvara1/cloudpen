import { useState, useEffect } from 'react';
import './styles/code.css';
import Editor from "@monaco-editor/react";
import Navbar from './Navbar.jsx';
import axios from 'axios';
import { FaPlay, FaTrash, FaSpinner, FaCode, FaKeyboard } from 'react-icons/fa';

function Code() {
     const [userCode, setUserCode] = useState(``);
     const [userLang, setUserLang] = useState("python");
     const [userTheme, setUserTheme] = useState("vs-dark");
     const [fontSize, setFontSize] = useState(20);
     const [userInput, setUserInput] = useState("");
     const [userOutput, setUserOutput] = useState("");
     const [loading, setLoading] = useState(false);

     const options = {
          fontSize: fontSize,
          fontFamily: "'Fira Code', monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          renderLineHighlight: 'all',
          lineHeight: 1.5,
     };

     // Keyboard shortcut for compile
     useEffect(() => {
          const handleKeyDown = (e) => {
               if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    compile();
               }
          };

          window.addEventListener('keydown', handleKeyDown);
          return () => window.removeEventListener('keydown', handleKeyDown);
     }, [userCode, userLang, userInput]);

     function compile() {
          setLoading(true);
          if (userCode === ``) {
               setLoading(false);
               return;
          }

          axios.post(`${import.meta.env.VITE_API_URL || 'https://cloudbackend-vscf.onrender.com'}/compile`, {
               code: userCode,
               language: userLang,
               input: userInput
          }).then((res) => {
               setUserOutput(res.data.stdout || res.data.stderr);
          }).then(() => {
               setLoading(false);
          }).catch((err) => {
               console.error(err);
               setUserOutput("Error: " + (err.response ? err.response.data.error : err.message));
               setLoading(false);
          });
     }

     function clearOutput() {
          setUserOutput("");
     }

     return (
          <div className="App">
               <Navbar
                    userLang={userLang}
                    setUserLang={setUserLang}
                    userTheme={userTheme}
                    setUserTheme={setUserTheme}
                    fontSize={fontSize}
                    setFontSize={setFontSize}
               />
               <div className="main">
                    <div className="left-container">
                         <Editor
                              options={options}
                              height="100%"
                              width="100%"
                              theme={userTheme}
                              language={userLang}
                              defaultLanguage="python"
                              defaultValue="# Enter your code here"
                              onChange={(value) => { setUserCode(value) }}
                              className='editor'
                         />
                         <button
                              className="run-btn"
                              onClick={() => compile()}
                              disabled={loading || !userCode.trim()}
                              title="Run code (Ctrl+Enter)"
                         >
                              {loading ? <FaSpinner className="spinner" /> : <FaPlay />} Run
                         </button>
                    </div>
                    <div className="right-container">
                         <h4><FaKeyboard style={{ marginRight: '8px' }} /> Input</h4>
                         <div className="input-box">
                              <textarea
                                   id="code-inp"
                                   onChange={(e) => setUserInput(e.target.value)}
                                   placeholder="Enter input here..."
                              ></textarea>
                         </div>
                         <h4><FaCode style={{ marginRight: '8px' }} /> Output</h4>
                         <div className="output-box">
                              {loading ? (
                                   <div className="spinner-box">
                                        <FaSpinner className="spinner" />
                                   </div>
                              ) : (
                                   <pre>{userOutput}</pre>
                              )}
                              {userOutput && (
                                   <button
                                        onClick={() => clearOutput()}
                                        className="clear-btn"
                                        title="Clear output"
                                   >
                                        <FaTrash /> Clear
                                   </button>
                              )}
                         </div>
                    </div>
               </div>
          </div>
     );
}

export default Code;