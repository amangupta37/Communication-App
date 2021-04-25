


const generateLocation = (locationurl) =>{

    return  {
 
             locationurl,
             createdAt : new Date().getTime()
 
     }
 
 }
 
 module.exports = {
    generateLocation 
 }