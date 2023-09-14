const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql2');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

const db = mysql.createConnection(
  {
    host:"localhost",
    user :"root",
    password: "password",
    database : "nodejs"
  }
)

db.connect((err)=>{
  if(err){
    console.log("Error connecting to database"+err);
    return;
  }
  console.log("connected to databse");

})

const query = 'insert into form_data ( name , email, message) values (?,?,?)';

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
})


app.post('/submit',(req,res)=>{
    const { name , email, message} = req.body;

    db.query(query, [name, email, message], (err, results) => {
      if (err) {
        console.error('Error inserting data into MySQL:', err);
        res.status(500).send('Error inserting data');
        return;
      }
  
      res.send(`
        <h2>Data Submitted:</h2>
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Message: ${message}</p>
        <a href="/">Back to Home</a>
      `);
    });
  })
app.listen(3000);