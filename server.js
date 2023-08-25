const express = require('express');
const {connect} = require('./script.js');
const app = express();

app.use(express.static(__dirname));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req,res)=>{
    res.status(200).sendFile(__dirname + '\\login.html');
});

app.get('/register', (req,res)=>{
    res.status(200).sendFile(__dirname+'\\register.html');
})

app.post('/user', async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    const check = await connect(username,password);
    if(check === "error") res.send("Error connecting to server, please try again");
    else if(check === "not found") {
        res.send('<script>alert("Incorrect username or password"); window.location.href = "/"; </script>');
    }
    else {
        res.send(check);
    }
});

app.listen(5000,()=> {console.log("server running at PORT 5000")});