
const socket = io();
const formdata = document.querySelector("#form-box"); 
const formInput = document.getElementById("input-box");
const formBtn = document.getElementById("btn");
const locationBtn = document.getElementById("share-location-btn");
const Message = document.getElementById('message');
const RoomList = document.getElementById('room-deatils-list');
const HeaderRoom = document.getElementById('rooms-list-data');
const MessageTemplate = document.getElementById('message-template').innerHTML;
const LocationTemplate = document.getElementById('location-message-template').innerHTML;
const sidebarTemplate = document.getElementById('sidebar-room-template').innerHTML;
const headerTemplate = document.getElementById('header-template-new-user').innerHTML;

const { username , room } = Qs.parse(location.search, { ignoreQueryPrefix: true })



console.log(Qs.parse(location.search, { ignoreQureyPrefix: true }));
console.log(username)
console.log(room)
socket.on('sendMessage', (message) => {    // accept event and data from server
   
    console.log(` ${message}`)
    const html = Mustache.render(MessageTemplate,{
        username : message.username,
        message:message.text, 
        createdAt : moment(message.createdAt).format('h:mm a')
    
    });
    Message.insertAdjacentHTML('beforeend',html)
})

socket.on('userLocation',(url) =>{

    console.log(`${url}`)

    const html = Mustache.render(LocationTemplate,{
        username : url.username,
        Location:url.locationurl,
        createdAt: moment(url.createdAt).format('h:mm a')

    });
    Message.insertAdjacentHTML('beforeend',html)
})

socket.on('roomData', ({room,users}) =>{


      const html = Mustache.render(sidebarTemplate,{
       room,
       users

    });
    RoomList.innerHTML=html

    const newhtml = Mustache.render(headerTemplate,{
        room,
    })

    HeaderRoom.innerHTML=newhtml


    console.log(room);
    console.log(users);
})


formdata.addEventListener('submit' , (e) =>{

    
   
    formBtn.disabled = true;
    e.preventDefault();

    let message =document.getElementById('input-box').value;
       if(message == "")
       {
           formBtn.disabled = false;
           return alert("Empty Message !!!")
           
       }
    socket.emit('upMessage',message, (error) =>{

        formBtn.disabled = false;

        if(error){

            return console.log(error)
        }

        console.log("This message is Dilivered")
       
    });

    formInput.value = "";
    formInput.focus();
})



locationBtn.addEventListener('click' , () =>{

    locationBtn.disabled=true;

        if(! navigator.geolocation){

            return alert("Not supported")
        }

        navigator.geolocation.getCurrentPosition((position) => {

            locationBtn.disabled=false;

            // console.log(position)
            socket.emit('Location',{
                latitude : position.coords.latitude,
                longitude : position.coords.longitude
            }, (locationInfo) => {

                console.log("location shared successfully")

            });

        })


})

socket.emit('join' , { username, room},(error) =>{

    if(error){
        alert(error)
        location.href =  '/'
    }

})

