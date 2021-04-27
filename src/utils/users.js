const users = []

// 1. adding user
const addUser = ({id,username,room}) =>{

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room){
        return{
            error:'Username and room are required'
        }
    }


    const existingUser = users.find((user) => {

        return user.room === room && user.username === username

    })

    if(existingUser) {

        return {
            error : 'username already exist'
        }
    }

    const user = {id,username,room}

    users.push(user)

    return {user}

}




// 2. removing user
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

// 3. get user deatils
const getUser = (id) => {

    return users.find((user) => user.id === id)
}


//4 . get room deatils
const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}



module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}