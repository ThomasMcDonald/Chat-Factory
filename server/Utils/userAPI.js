module.exports = function(app,Users) {  //receiving "app" instance
    app.route('/login')
        .post(loginUser(Users));
}


function loginUser(request, response, Users) {
    var realUser = { status: false, id:0 };
    for(var i=0;i<Users.length;i++){
        if(Users[i]._username == request.body.username){
            realUser.status = true;
            realUser.id = i;
        }
    }
    if(!realUser.status){
        return response.send({statusCode: "UserError", msg: "User doesnt Exist" })
     //Users.push(new User(Ucount,req.body.username,"Peasant"));
     //Ucount++;
    // return res.send({ user: Users[Users.length-1], statusCode: "initiateSocket" })
    }
    else{
      return response.send({ user: Users[realUser.id], statusCode: "initiateSocket" })
    }
}
