const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);


const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count =0;


io.on('connection' , (socket) =>{
    console.log('new websocket connection !!!')
   
    socket.emit('updateCounter',count) // transfer event  and data

    socket.on("updateValue" , () =>{
       
        count++;
        // socket.emit('updateCounter',count)  //only update value for a single client

        io.emit('updateCounter',count) //upadted value for all the connected client
    })
})

server.listen(port,() =>{
    console.log(`server is up on port ${port}`)
})