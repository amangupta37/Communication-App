const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { connected } = require('process');
const Filter = require('bad-words');
const {generateMessage} = require('./utils/message');
const {generateLocation} = require('./utils/location');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

// let count =0;

io.on('connection' , (socket) =>{

    console.log('new websocket connection !!!')

        
        // 1. socket.emit --> emits data to a single connected client

        // 2. socket.broadcast.emit --> emits data to every client connected 
        //                         except the client which is joined

        // 3. io.emit ---> eits data to every single client connected 
   
        socket.emit("sendMessage",  generateMessage('welcome !'))

        socket.broadcast.emit("sendMessage", generateMessage("A new user has joined the chat room !!!"))

        socket.on("upMessage" , (message , dilivered) =>{


                const filter = new Filter();

                if(filter.isProfane(message)){

                    return dilivered('sensorship !!!')
                }

                io.emit('sendMessage', generateMessage(message))

                dilivered()

        })

        socket.on("Location" , (position , infoRecived) =>{

            io.emit('userLocation',generateLocation(`https://google.com/maps?q=${position.latitude},${position.longitude}`))
        
            infoRecived();
        
        })

        // when user left
        socket.on('disconnect' , () =>{

            io.emit('sendMessage', generateMessage('user has left the room !!!'))
        })




    
    // -------------------------------------------------------------------
    
    // socket.on("updateValue" , () =>{
       
    //     count++;
    //     // socket.emit('updateCounter',count)  //only update value for a single client

    //     io.emit('updateCounter',count) //upadted value for all the connected client
    // })



})

server.listen(port,() =>{
    console.log(`server is up on port ${port}`)
})