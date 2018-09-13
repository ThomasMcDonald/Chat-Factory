module.exports = class ActiveData {
    constructor(){
    this.onlineUsers = [] ;
    }
    
    
    addOnlineUser(user){
        this.onlineUsers.push(user);
    }
    
    
 }