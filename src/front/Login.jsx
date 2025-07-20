import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import './styles/login.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import CryptoJS from 'crypto-js';
import Cookie from 'js-cookie';
// Import images directly
import gif from './styles/icons8-pencil.gif';
import note from './styles/note_50.png';

function App() {
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');
     const Navigate = useNavigate();
     const [isLogin, setIsLogin] = useState(false);

     useEffect(() => {
          const loginToken = Cookie.get('loginToken');
          if (loginToken === 'logged_in') {
               setIsLogin(true);
          }
     }, []);

     useEffect(() => {
          if (isLogin) {
               const username = localStorage.getItem('username');
               if (username) {
                    Navigate('/dash');
               } else {
                    Navigate('/');
               }
          }
     }, [isLogin, Navigate]);

     Cookie.set('loginToken', 'logged_in');

     const handleSubmit = async (event) => {
          event.preventDefault();
          try {
               const response = await axios.get(`${import.meta.env.VITE_API_URL}/users?name=${username}`);
               const users = response.data.map(user => ({
                    username: user.Name,
                    password: user.Password,
                    email: user.Email,
                    access: user.access
               }));

               if (users.length === 0) {
                    alert('Invalid username');
                    return;
               }

               const [saltString, hashedPassword] = users[0].password.split(':');
               const salt = CryptoJS.enc.Hex.parse(saltString);
               const inputHashedPassword = CryptoJS.PBKDF2(password, salt, {
                    keySize: 256 / 32,
                    iterations: 1000,
                    hasher: CryptoJS.algo.SHA256
               }).toString();

               if (users[0].access === 0) {
                    alert('You are blocked by admin');
                    return;
               }

               if ((users[0].username === username || users[0].email === username) && inputHashedPassword === hashedPassword) {
                    if (users[0].username === 'yuvi' || users[0].email === 'yuvarajacb11@gmail.com') {
                         localStorage.setItem('admin', 'True');
                    }
                    localStorage.setItem('username', users[0].username);

                    Navigate('/dash');
               } else {
                    alert('Invalid password');
               }
          } catch (error) {
               console.error('Error during login:', error);
               alert('Error during login');
          }
     };

     function showPassword() {
          document.getElementById('eyeOn').style.display = 'none';
          document.getElementById('password').type = 'text';
          document.getElementById('eyeOff').style.display = 'block';
     }

     function hidePassword() {
          document.getElementById('eyeOn').style.display = 'block';
          document.getElementById('eyeOff').style.display = 'none';
          document.getElementById('password').type = 'password';
     }

     function handleRegister() {
          Navigate('/register');
     }

     return (
          <div className='container'>
               {/* <img src={gif} alt="" className='pencil' />
               <img src={note} alt="" className='note' /> */}
               <div className='body'>
                    <h1 id='logofont'>cloud pen</h1>
                    <form className='form' onSubmit={handleSubmit}>
                         <h1 className='login'>login</h1>
                         <div className="form-group">
                              <input
                                   className='input'
                                   type="text"
                                   id="username"
                                   value={username}
                                   placeholder='Username'
                                   onChange={(e) => setUsername(e.target.value)}
                                   required
                                   spellCheck='false'
                              />
                         </div>
                         <div className="form-group">
                              <input
                                   className='input'
                                   type="password"
                                   id="password"
                                   value={password}
                                   placeholder='Password'
                                   onChange={(e) => setPassword(e.target.value)}
                                   required
                                   spellCheck='false'
                              />
                              <FaEye className='eye' id='eyeOn' onClick={showPassword} />
                              <FaEyeSlash className='eye' id='eyeOff' onClick={hidePassword} />
                         </div>
                         <button className='button' type="submit">Login</button>
                         <div className='register'>
                              <p>I don't have account ?</p>
                              <span onClick={handleRegister}>Register Here</span>
                         </div>
                    </form>
               </div>
               <div className='side'>
                    <h1>Online Text Editor</h1>
                    <h2>Connect Together, Create Together.</h2>
               </div>
          </div>
     );
}

export default App;