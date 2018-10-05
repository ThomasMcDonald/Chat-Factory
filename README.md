# MEAN Stack Chat Room

## Production
You can view the production release of this web application at:
https://chat-factory.herokuapp.com/

This heroku app doesnt have permission to save files, so after a while the server will shut down and the only available user will be `Super`

## Git Repository
The purpose of this Git repo is to manage the project, as they change over time. Git stores this information in a data structure called a repository. A git repository contains, among other things, the following: A set of commit objects. At certain points in the development of this solution new branches were created to ensure safe development of different features.
### Branches
<ul>
    <li>Master - The Master branch is the main development branch, this at times will have sub branches depending on different issues or new content.</li>
    <li>Production - The Production branch is being used as the 'Release' branch every new push to this branch is a new release. This branch is being accessed by the Heroku app.</li>
</ul>

The .gitignore will ignore:
<ul>
    <li>dist folder -  This folder is created everytime ` npm start ` is called so it is not neccessary to include in the git repo.</li>
</ul>

## Testing
Unit testing was created using mocha and chai
Unit Testing can be run using:
 `npm test`

Intergration Testing can be run using:
`npm intTest`

## Data Structures
Previously the data was stored directly on the server in arrays. They have since been updated to mongoDB schemas.
```
Users
channels
Groups
Messages
```

User Model: Has a pre insertion hook that will hash the password before inserting.
```


module.exports = function(mongoose, bcrypt) {

var userSchema =  mongoose.Schema({
  _email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  _username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  _password: {
    type: String,
    required: true,
  },
  _role:{
    type: String,
    required: true,
  },
  _profileImage:{
    type: String,
    required: true
  },
  _inChannel:{
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
  },
  _inGroup:{
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  }
});

//hashing a password before saving it to the database
userSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user._password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user._password = hash;
    next();
  })
});

var User = mongoose.model('User', userSchema);
return User;
};

```

Group Model:
```

module.exports = function(mongoose) {
  var groupSchema =  mongoose.Schema({
    _name: {
      type: String,
      required: true,
      trim: true
    },
    _topic: {
      type: String,
      required: true,
      trim: true
    },
    _channels:{
      type: Array
    },
    _activeChannel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
    }
  });


  var Group = mongoose.model('Group', groupSchema);
  return Group;
};


```
Channel Model:
```

module.exports = function(mongoose, bcrypt) {

var channelSchema =  mongoose.Schema({
  _name: {
    type: String,
    required: true,
    trim: true
  },
  _topic: {
    type: String,
    required: true,
  },
  _groupID:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  }
});

var Channel = mongoose.model('Channel', channelSchema);
return Channel;
};


```
Message Model:
```

module.exports = function(mongoose) {

var messageSchema =  mongoose.Schema({
    _channelID: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Channel',
    required:true
  },
    _content: {
    type: String,
    required: true,
    trim: true
  },
  _time: {
      type: String,
  },
  _from: {
    type: Array,
  }
});


var Message = mongoose.model('Message', messageSchema);
return Message;
};


```

## Client & Server Responsibilites

### Initial Startup

Depending on the development environment the entire project can be built and launched using ``` npm start ```, this command has been modified to use ``` ng build && node server.js ``` sequentially.

Once built the server will serve the dist folder which contains the built angular project.


### User API
#### loginVerify
` app.post('/loginVerify', function (req, res){}); `  
This request takes in the username and password provided by the login form, it will then check the mongo database to make sure the user exists.
If the use exists it will check the password provided with the hashed password saved within the DB.

#### Create User
` app.post('/createUser', function (req, res){}); `  
This route takes in an email, password, role and profile picture and runs the createUser function in the user Controller

#### Delete User
` app.post('/deleteUser', function (req, res){}); `  
This request takes in the userID of the user to be removed, and runs the deleteUser function in the user Controller
Returns a message if the User has been deleted.  
It also prompts the clients to request an updated data set.

### Group API
#### Create Group
` app.post('/createGroup', function (req, res){}); `
This request takes in title, topic of the new group to be created, and runs the createGroup function in the Group Controller
Returns a message if the Group has been created.  
It also prompts the clients to request an updated data set.

#### Get Group
` app.post('/getGroup', function (req, res){}); `  
This function returns all details for the requested group.

#### Remove Group
` app.post('/removeGroup', function (req, res){}); `    
This request takes in the groupID of the user to be removed, and runs the removeGroup function in the user Controller
Returns a message if the Group has been deleted.  
It also prompts the clients to request an updated data set.
### Channel API
#### Create Channel
` app.post('/createChannel', function (req, res){}); `
This request takes in title, topic and the groupID of the new channel to be created, and runs the createChannel function in the Channel Controller
Returns a message if the Group has been created.  
It also prompts the clients to request an updated data set.

#### Remove Channel
` app.post('/removeChannel', function (req, res){}); `  
This request takes in the channelID to be removed, and runs the removechannel function in the user Controller
Returns a message if the Group has been deleted.  
It also prompts the clients to request an updated data set.


### Socket Implementation
Basic socket.io functions have been implementated to cater for real time data access, this prevents user from accessing channels or groups that they have been removed from. As well as having an updated list of all users when it comes to adding to groups/channels.


`  socket.on('loginSetup', function(id){}); `   
After the user has logged in and has connected its socket, the server will recieve a 'loginSetup' request. This will send all the filterd data to the user that requested.
`  socket.on('requestData', function(id){}); `    
When the server recieves the 'requestData' message it will send all filtered data to the user that requested.
`  socket.on('disconnect', function(id){}); `    
This is called when the server detects that a user has disconnected, generally this means the user has logged out.
`  socket.on('subscribe', function(id){}); `    
This function will add the user to the room provided(id), it will also retrieve all the messages within the room.
`  socket.on('unsubscribe', function(id){}); `  
this function removes the user from the given channel.
`  socket.on('roomyMessage', function(content){}); `    
This socket request will send the given message to all clients in the room id provided

## Angular Architecture
This angular project uses app-routing to help navigate between views.  
The two mains views are: Login and Dashboard.  

### Routes
First accessing the webpage the user will be forwarded to the /login route to use the login form, when the form has been successful the user will navigate to the Dashboard child channels/0/0, the dashboard component will then automatically navigate to the appropriate content.
```
{ path: '', redirectTo: '/login', pathMatch: 'full' },
{ path: 'login', component: LoginComponent },
{ path: 'dashboard', component: DashboardComponent,
  children: [
          {
              path:'',
              redirectTo: 'channels/0/0',
              pathMatch: 'full'
          },
          {
              path:'channels/:groupID/:channelID',
              component: RoomComponent,
          }
        ]
}
```


### Main components

#### Login
This view allows the user to log into the webapp. It uses a angular form to submit details to the /loginVerify API.  
This page can be accessed via ` /login ` or `/`

#### Dashboard
This component exposes the user to all remaining functions of the webapp, depending on the users role they can perform CRUD opperations on Groups, channels and Users.  
This page can be accessed via `/dashboard/group/:id/channels/:id `  
The `/group/:id/channels/:id ` is being used to pass data around and to reflect the changes the user is making. In the future it will be spread out into a Child route to allow a default Group page.

### Room
This component exposes the user to all chat functionality, it subscribes to  the socket service to change rooms and receive  the messages for specific rooms.


#### Modals
Several modals are being used that contain forms for the API calls.
<ul>
    <li>add-to-group-channel</li>
    <li>delete-user</li>
    <li>new-channel</li>
    <li>new-group</li>
    <li>new-user</li>
    <li>remove-user-group-channel</li>
</ul>

### Services
In this implementation the data is being stored and served using a Service called Dataservice.
It allows all the components to have access to the same data. This data can be updated and will immediately be shown on other components.
This service also saves the URLs of 3 different environments being used throughout the development of this web app.

With the one currently being used uncommented.

```
 public url = 'http://localhost:8080'; // Local
// public url = 'https://node-garbage-thomasmcdonald1996.c9users.io'; // Cloud9
// public url = 'https://chat-factory.herokuapp.com'; // "Production"

```
These urls are being accessed by the components that need to make HTTP requests to the server.

A socket service has been implemented in this iteration of the project. The socket service is used to keep track of all incoming and outgoing socket traffic from server to client, Specifically it is being used to send messages to and from users in each room.
