
const socket = io();
const formdata = document.querySelector("#form-box"); 
const formInput = document.getElementById("input-box");
const formBtn = document.getElementById("btn");
const locationBtn = document.getElementById("share-location-btn");
const Message = document.getElementById('message');
const MessageTemplate = document.getElementById('message-template').innerHTML;
const LocationTemplate = document.getElementById('location-message-template').innerHTML;


socket.on('sendMessage', (message) => {    // accept event and data from server
   
    console.log(` ${message}`)
    const html = Mustache.render(MessageTemplate,{
        message:message.text, 
        createdAt : moment(message.createdAt).format('h:mm a')
    
    });
    Message.insertAdjacentHTML('beforeend',html)
})

socket.on('userLocation',(url) =>{

    console.log(`${url}`)

    const html = Mustache.render(LocationTemplate,{
        Location:url.locationurl,
        createdAt: moment(url.createdAt).format('h:mm a')

    });
    Message.insertAdjacentHTML('beforeend',html)
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


//-------------------------------------------------------------------
// const btn = document.getElementById("inc");
// btn.addEventListener('click', () =>{

//     console.log("1");

//     socket.emit("updateValue");

// });



