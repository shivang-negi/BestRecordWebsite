const express = require('express');
const {connect,checkUserExistsElseAddToDatabase} = require('./script.js');
const app = express();
const http = require('http');
const server = http.createServer(app); 

const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname));

var bodyParser = require('body-parser');
const { send } = require('process');
const { write } = require('fs');
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
    const check = await connect(username,password);
    if(check === "error") res.send("Error connecting to server, please try again");
    else if(check === "not found") {
        res.send('<script>alert("Incorrect username or password"); window.location.href = "/"; </script>');
    }
    else {
        res.redirect('/user/'+username);
    }
});

app.post('/register_user', async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const check = await checkUserExistsElseAddToDatabase(username,password);
    if(check === "error") res.send("Error connecting to server, please try again");
    else if(check === "found") {
        res.send('<script>alert("Username already in use!"); window.location.href = "/register"; </script>');
    }
    else {
        res.redirect('/user/' + username);
    }
});


const fs = require('fs').promises;
async function readScore() {
    const data = await fs.readFile("highscore.txt", "utf8");
    return data;
}

io.on('connection', (socket) => {
    console.log('connected');
    socket.on('score', async (score) => {
        const username = score['un'];
        const highscore = score['sc'];

        let data = await readScore();
        const arr = data.split(" ")

        let pairs = [], c = 0;
        for(let i=0;i<5;i++) {
            pairs.push([arr[c],parseInt(arr[c+1])]);
            c+=2;
        }

        let flag = false;
        for(let i=0;i<5;i++) {
            if(pairs[i][0]==username) {
                if(highscore > pairs[i][1]) pairs[i][1] = highscore;
                flag = true;
            }
        }

        if(flag==false) pairs.push([username,parseInt(highscore)]);
        pairs.sort(function(a,b) {
            return b[1] - a[1];
        });

        let send_data = "";
        if(pairs.length == 6) pairs.pop();
        for(let i=0;i<5;i++) send_data = send_data + `${pairs[i][0]} ${pairs[i][1]} `;

        io.sockets.emit('update', send_data);
        await fs.writeFile('highscore.txt', send_data);
    });
});

app.get('/user/:username', (req,res)=> {
    const username = req.params['username'];
    res.status(200).sendFile(__dirname + '\\user_page.html');
})

server.listen(5000, () => {
    console.log('listening on *:5000');
  });