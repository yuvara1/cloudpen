import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/Access.css'; // Make sure to create this file

function Access({ setFilePath }) {
     const [files, setFiles] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     useEffect(() => {
          const fetchData = async () => {
               try {
                    setLoading(true);
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/files`);
                    console.log('Fetched files:', response.data);
                    setFiles(response.data);
                    setError(null);
               } catch (error) {
                    console.error('Error fetching files:', error);
                    setError('Failed to load files');
               } finally {
                    setLoading(false);
               }
          };

          fetchData();
     }, []);

     const handleFileClick = (filename) => {
          localStorage.setItem('filepath', filename);
          setFilePath(filename); // Update state in Dashboard, triggers re-render
     };

     return (
          <div className='file-list'>
               {loading && <div>Loading files...</div>}
               {error && <div className="error">{error}</div>}
               {!loading && !error && files.length === 0 && <div>No files found</div>}

               {!loading && !error && files.length > 0 && (
                    <ul>
                         {files.map((file, index) => (
                              <li
                                   key={index}
                                   className="file-item"
                                   onClick={() => handleFileClick(file.filename)}
                              >
                                   {file.filename}
                              </li>
                         ))}
                    </ul>
               )}
          </div>
     );
}

export default Access;