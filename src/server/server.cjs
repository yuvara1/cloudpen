const mysql = require('mysql2/promise');
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
     host: 'bpfld0tfrcagxzcb4jpd-mysql.services.clever-cloud.com',
     user: 'uizdnjuzktb1cm0h',
     password: 'KsN09zWT1SIKz4SJH4Q4',
     database: 'bpfld0tfrcagxzcb4jpd'
});

app.get('/users', async (req, res) => {
     try {
          const name = req.query.name;
          const [rows] = await db.query(`SELECT * FROM userinfo WHERE Name = "${name}" OR Email="${name}"`); // Await the query
          res.json(rows);
          console.log('Data fetched successfully');
     } catch (error) {
          console.error('Error fetching users:', error);
          res.status(500).send('Error fetching users');
     }
});

app.post('/insertUser', async (req, res) => {
     try {
          await db.query(`INSERT INTO userinfo (Name, Password, Email) VALUES ('${req.body.name}', '${req.body.password}', '${req.body.email}')`);
          console.log('Data inserted successfully');
          res.status(201).send('User created successfully');
     } catch (err) {
          if (err.code === 'ER_DUP_ENTRY') {
               console.error('Duplicate entry:', err);
               res.status(400).send('User already exists');
          } else {
               console.error('Error inserting data:', err);
               res.status(500).send('Error inserting data');
          }
     }
});

app.get('/files', async (req, res) => {
     try {
          const [rows] = await db.query('SELECT filename FROM fileinfo');
          res.json(rows);
          console.log('Data fetched successfully');
          // console.log(rows)
     } catch (error) {
          console.error('Error fetching files:', error);
          res.status(500).send('Error fetching files');
     }
});

app.get('/read', async (req, res) => {
     try {
          const filename = req.query.fileName;
          db.query(`SELECT content FROM fileinfo WHERE FileName = "${filename}"`)
               .then(([rows]) => {
                    res.json(rows);
                    console.log('Data fetched successfully');
               })
               .catch((error) => {
                    console.error('Error fetching data:', error);
                    res.status(500).send('Error fetching data');
               });
     } catch (error) {
          console.error('Error fetching data:', error);
          res.status(500).send('Error fetching data');
     }
});

app.post('/updateFile', async (req, res) => {
     try {
          const dataToAppend = req.body.content;
          const filePath = req.body.fileName;
          db.query(`UPDATE fileinfo SET Content = '${dataToAppend}' WHERE filename = '${filePath}'`);
          console.log('Data updated successfully');
          res.status(200).send('File updated successfully');
     } catch (error) {
          console.error('Error updating data:', error);
          res.status(500).send('Error updating data');
     }
});

app.post('/deletefile', async (req, res) => {
     console.log(req.body)
     try {
          const filePath = req.body.fileName;
          console.log('Deleting file:', filePath);
          await db.query(`DELETE FROM fileinfo WHERE filename = '${filePath}'`);
          console.log('Data deleted successfully');
          res.status(200).send('File deleted successfully');
     } catch (error) {
          console.error('Error deleting data:', error);
          res.status(500).send('Error deleting data');
     }
})

app.post('/createnew', async (req, res) => {
     try {
          const dataToAppend = req.body.content;
          const filePath = req.body.fileName;
          db.query(`INSERT INTO fileinfo (filename, content) VALUES ('${filePath}', '${dataToAppend}')`);
          // console.log('File created:', filePath);
          res.status(200).send('File created successfully');
     } catch (error) {
          console.error('Error creating file:', error);
          res.status(500).send('Error creating file');
     }
});

app.get('/access', async (req, res) => {
     try {
          const [rows] = await db.query('SELECT Name,access FROM userinfo');
          res.json(rows);
          console.log('Data');
          console.log('Data fetched successfully');
     } catch (error) {
          console.error('Error fetching data:', error);
          res.status(500).send('Error fetching data');
     }
})

app.post('/updateaccess', async (req, res) => {
     try {
          console.log(req.body)
          await db.query(`UPDATE editor.userinfo SET access = ${req.body.access} WHERE Name = '${req.body.name}'`);
          console.log('Data updated successfully');
          res.status(200).send('Access updated successfully');
     } catch (error) {
          console.error('Error updating data:', error);
          res.status(500).send('Error updating data');
     }
})

app.post("/compile", (req, res) => {

     let code = req.body.code;
     let language = req.body.language;
     let input = req.body.input;

     let languageMap = {
          "c": { language: "c", version: "10.2.0" },
          "cpp": { language: "c++", version: "10.2.0" },
          "python": { language: "python", version: "3.10.0" },
          "java": { language: "java", version: "15.0.2" }
     };

     if (!languageMap[language]) {
          return res.status(400).send({ error: "Unsupported language" });
     }

     let data = {
          "language": languageMap[language].language,
          "version": languageMap[language].version,
          "files": [
               {
                    "name": "main",
                    "content": code
               }
          ],
          "stdin": input
     };

     let config = {
          method: 'post',
          url: 'https://emkc.org/api/v2/piston/execute',
          headers: {
               'Content-Type': 'application/json'
          },
          data: data
     };

     axios(config)
          .then((response) => {
               res.json(response.data.run);
               console.log(response.data);
          }).catch((error) => {
               console.log(error);
               res.status(500).send({ error: "Something went wrong" });
          });
});

app.listen(process.env.PORT || port, () => {
     console.log(`Server listening on port ${port}`);
});


