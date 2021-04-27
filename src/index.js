const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { connected } = require('process');
const Filter = require('bad-words');
const {generateMessage} = require('./utils/message');
const {generateLocation} = require('./utils/location');
const { addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users');




const app = express();
const server = http.createServer(app);
const io = socketio(server);


const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection' , (socket) =>{

    console.log('new websocket connection !!!')

        socket.on('join',({ username, room}, callback) =>{

           const {error, user} =  addUser({id:socket.id, username ,room})

           if(error){

               return callback(error);

           }

        socket.join(user.room)
        socket.emit("sendMessage",  generateMessage('Chatify Bot 🤖','Welcome to this chat room ! say hi 👋'))

        socket.broadcast.to(user.room).emit("sendMessage", generateMessage('Chatify Bot 🤖',`${user.username} has just joined the chat room !!!`))
        io.to(user.room).emit('roomData',{
            room : user.room,
            users: getUsersInRoom(user.room)
        })
            callback()
        })


        socket.on("upMessage" , (message , dilivered) =>{

                const user  = getUser(socket.id)
                const filter = new Filter()

                if(filter.isProfane(message)){

                    return dilivered('sensorship !!!')
                }

                io.to(user.room).emit('sendMessage', generateMessage(user.username,message))

                dilivered()

        })

        socket.on("Location" , (position , infoRecived) =>{

            const user  = getUser(socket.id)

            io.to(user.room).emit('userLocation',generateLocation(user.username, `https://google.com/maps?q=${position.latitude},${position.longitude}`))
        
            infoRecived()
        
        })

        // when user left
        socket.on('disconnect' , () =>{
            
           const user =  removeUser(socket.id)

           if(user){

            io.to(user.room).emit('sendMessage', generateMessage('Chatify Bot 🤖',`${user.username} has left the chat room !!!`))
            io.to(user.room).emit('roomData' , {

                room:user.room,
                users:getUsersInRoom(user.room)
            })

           }    
        })

})

server.listen(port,() =>{
    console.log(`server is up on port ${port}`)
})