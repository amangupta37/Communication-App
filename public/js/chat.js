const socket = io();


socket.on('updateCounter', (count) => {    // accept event and data from server
    console.log("this is client message");
    console.log(`this is count value ${count}`)
})

const btn = document.getElementById("inc");
btn.addEventListener('click', () =>{

    console.log("1");

    socket.emit("updateValue");

});