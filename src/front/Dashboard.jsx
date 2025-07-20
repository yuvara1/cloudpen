import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import '../front/styles/styleDash.css'
import { BiHomeSmile, BiFolderOpen, BiSave, BiDownload, BiNotepad, BiFile, BiFontFamily, BiUpArrowAlt, BiDownArrowAlt } from "react-icons/bi"
import { SiFusionauth } from "react-icons/si";
import { FaCode } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineDarkMode } from "react-icons/md";
import { Link } from 'react-router-dom'
import Access from './Access'
import axios from 'axios'
import Navbar from './Navbar.jsx';

function Dashboard() {
     const [filepath, setFilePath] = useState(localStorage.getItem('filepath') || '')
     const name = localStorage.getItem('username') || ''
     const navigate = useNavigate()

     const [theme, setTheme] = useState('light')
     const [fileContent, setFileContent] = useState('')
     const [count, setCount] = useState(0)
     const [fontSize, setFontSize] = useState(20)
     const [showLogout, setShowLogout] = useState(false)
     const [userTheme, setUserTheme] = useState(theme === 'dark' ? 'vs-dark' : 'light');
     const [saveNotification, setSaveNotification] = useState({
          show: false,
          message: '',
          type: ''  // 'success' or 'error'
     });

     const toggleDropdown = () => {
          setShowLogout((prev) => !prev);
     };

     const fontStyles = [
          "Arial",
          "Verdana",
          "Georgia",
          "Palatino",
          "Andale Mono",
          "Comic Sans MS, Comic Sans, cursive",
          "Helvetica, sans-serif"
     ]

     // console.log('Filepath:', filepath)

     function changeFontStyle() {
          setCount(count + 1)
          console.log('Count:', count)
          let num = count / fontStyles.length - 1
          if (count === fontStyles.length - 1) {
               setCount(0)
          }
          document.getElementById('text').style.fontFamily = `${fontStyles.at(num)}`
     }

     // Update the handleTheme function
     function handleTheme() {
          const newTheme = theme === 'light' ? 'dark' : 'light';
          setTheme(newTheme);
          document.body.className = newTheme;
          localStorage.setItem('theme', newTheme); // Save theme preference
     }

     // Add this useEffect for theme persistence
     useEffect(() => {
          const savedTheme = localStorage.getItem('theme') || 'light';
          setTheme(savedTheme);
          document.body.className = savedTheme;
     }, []);

     useEffect(() => {
          const fetchData = async () => {
               try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/read?fileName=${filepath}`)
                    if (!response.ok) {
                         throw new Error('Network response was not ok')
                    }
                    const data = await response.json()
                    console.log('Fetched data:', data)
                    setFileContent(data[0].content)
               } catch (error) {
                    console.error('Error fetching data:', error)
               }
          }

          fetchData()
     }, [filepath])

     function handleFontSizeIncrease() {
          setFontSize(fontSize + 1)
     }

     function handleFontSizeDecrease() {
          setFontSize(fontSize - 1)
     }

     const handleAppend = useCallback(async (event) => {
          event.preventDefault()
          const newData = fileContent
          console.log('Saving file with content:', newData)

          try {
               setSaveNotification({
                    show: true,
                    message: 'Saving...',
                    type: 'info'
               });

               const res = await fetch(`${import.meta.env.VITE_API_URL}/updatefile`, {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                         content: newData,
                         fileName: filepath
                    })
               });

               if (res.status === 200 || res.status === 500) {
                    setSaveNotification({
                         show: true,
                         message: 'File saved successfully!',
                         type: 'success'
                    });
               } else {
                    setSaveNotification({
                         show: true,
                         message: 'Error saving file.',
                         type: 'error'
                    });
               }
          } catch (error) {
               setSaveNotification({
                    show: true,
                    message: 'Error saving file: ' + error.message,
                    type: 'error'
               });
          }
     }, [fileContent, filepath])

     const handleDownload = () => {
          const element = document.createElement('a')
          const fileURL = URL.createObjectURL(new Blob([fileContent], { type: 'text/plain' }))
          element.href = fileURL
          element.download = `${filepath}`
          document.body.appendChild(element)
          element.click()
          document.body.removeChild(element)
     }

     const handleFileDiplay = () => {
          const dropDown = document.querySelector('.dropdown');
          // Get computed style instead of checking inline style
          const currentDisplay = window.getComputedStyle(dropDown).display;

          if (currentDisplay === 'none') {
               dropDown.style.display = 'block';
          } else {
               dropDown.style.display = 'none';
          }
     }

     const handleLogout = () => {
          localStorage.clear()
          navigate('/')
     }

     const handleCreateNewFile = async (e) => {
          e.preventDefault()
          const fileName = window.prompt('Enter the file name', 'newfile')
          if (fileName) {
               try {
                    const response = await axios.post(`${import.meta.env.VITE_API_URL}/createnew`, {
                         content: '',
                         fileName: fileName
                    })
                    if (response.status === 200) {
                         alert('File created successfully!')
                         localStorage.setItem('filepath', fileName)
                         setFileContent('')
                    } else {
                         throw new Error('Network response was not ok')
                    }
               } catch (error) {
                    console.error('There has been a problem with your fetch operation:', error)
                    alert('Error creating file.')
               }
          }
     }

     async function handleAccess(e) {
          e.preventDefault()
          try {
               const response = await axios.get(`${import.meta.env.VITE_API_URL}/access`)
               console.log('Fetched data:', response.data)
               const users = response.data.map(user => ({
                    username: user.Name,
                    access: user.access
               }))
               const name = window.prompt('Enter the username to change access:', 'username')
               const newAccess = window.prompt('zero for dennied, one for granted:', 0, 1)
               const user = users.find(user => user.username === name)
               console.log('User found:', user)
               if (user) {
                    const res = await axios.post(`${import.meta.env.VITE_API_URL}/updateaccess`, {
                         name: name,
                         access: newAccess
                    })
                    console.log('Update access response:', res)
                    if (res.status === 200) {
                         alert('Access updated successfully!')
                    } else {
                         throw new Error('Network response was not ok')
                    }
               } else {
                    alert('User not found.')
               }
          } catch (error) {
               console.error('Error fetching data:', error)
               alert('Error fetching data.')
          }
     }

     async function handleDelete(e) {
          e.preventDefault();
          const filename = prompt('Enter the file name to delete:');
          if (!filename) {
               alert('Please enter a valid file name.');
               return;
          }

          try {
               const res = await axios.post(`${import.meta.env.VITE_API_URL}/deletefile`, {
                    fileName: filename
               });

               if (res.status === 200) {
                    alert('File deleted successfully!');
                    localStorage.removeItem('filepath');
                    setFileContent('');
               } else {
                    alert('Error deleting file.');
               }
          } catch (error) {
               console.error('Error deleting file:', error);
               alert('Error deleting file.');
          }
     }

     const fileDisplay = (
          <div className="dropdown">
               <Access setFilePath={setFilePath} />
          </div>
     );

     useEffect(() => {
          if (saveNotification.show) {
               const timer = setTimeout(() => {
                    setSaveNotification({
                         show: false,
                         message: '',
                         type: ''
                    });
               }, 3000); // Hide after 3 seconds

               return () => clearTimeout(timer);
          }
     }, [saveNotification.show]);

     return (
          <div>
               <Navbar
                    userTheme={userTheme}
                    setUserTheme={(newTheme) => {
                         setUserTheme(newTheme);
                         const bodyTheme = newTheme === 'vs-dark' ? 'dark' : 'light';
                         setTheme(bodyTheme);
                         document.body.className = bodyTheme;
                         localStorage.setItem('theme', bodyTheme);
                    }}
                    fontSize={fontSize}
                    setFontSize={setFontSize}
                    fileName={filepath}
               />

               <aside className='sidebar'>
                    <div>
                         <ul>
                              <div className='components'>
                                   <BiHomeSmile className='icons' />
                                   <li>Home</li>
                              </div>

                              <div id='newfile' className='components' onClick={handleCreateNewFile}>
                                   <BiFile className='icons' />
                                   <li>Create New File</li>
                              </div>

                              <div className='components'>
                                   <BiSave className='icons' />
                                   <li onClick={handleAppend}>Save</li>
                              </div>
                              <div className='components'>
                                   <BiFolderOpen className='icons' />
                                   <li onClick={handleFileDiplay}>Files</li>
                              </div>
                              {fileDisplay}

                              <div className='components'>
                                   <AiOutlineDelete className='icons' />
                                   <li onClick={handleDelete}>Delete File</li>
                              </div>

                              <div className='components'>
                                   <BiDownload className='icons' />
                                   <li onClick={handleDownload}>Download</li>
                              </div>
                              <div className='components'>
                                   <BiFontFamily className='icons' />
                                   <li onClick={changeFontStyle}>change font</li>
                              </div>
                              <div className='components'>
                                   <BiUpArrowAlt className='icons' onClick={handleFontSizeIncrease} />
                                   <li>Font Size {fontSize}</li>
                                   <BiDownArrowAlt className='icons' onClick={handleFontSizeDecrease} />
                              </div>

                              {localStorage.getItem('admin') === 'True' && (
                                   <div className='components' onClick={handleAccess}>
                                        <SiFusionauth className='icons' />
                                        <li>Admin</li>
                                   </div>
                              )}
                         </ul>
                    </div>
               </aside>
               <main className="workspace">
                    <textarea
                         style={{ fontSize: `${fontSize}px`, fontFamily: `${fontStyles.at(count)}` }}
                         name="text"
                         id="text"
                         value={fileContent}
                         onChange={(e) => setFileContent(e.target.value)}
                         spellCheck={false}
                         disabled={!filepath}
                         placeholder={!filepath ? "Select or create a file to start editing..." : ""}
                    />
                    {saveNotification.show && (
                         <div className={`toast-notification ${saveNotification.type}`}>
                              <span>{saveNotification.message}</span>
                         </div>
                    )}
               </main>
          </div>
     )
}

export default Dashboard
