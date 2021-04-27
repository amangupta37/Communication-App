


const generateLocation = (username ,locationurl) =>{

    return  {
             username,
             locationurl,
             createdAt : new Date().getTime()
 
     }
 
 }
 
 module.exports = {
    generateLocation 
 }