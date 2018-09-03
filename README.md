# Chat Factory

## Production
You can view the production release of this web application at:
https://chat-factory.herokuapp.com/

This heroku app doesnt have permission to save files, so after a while the server will shut down and the only available user will be ```Super```

## Git Repository
The purpose of this Git repo is to manage the project, as they change over time. Git stores this information in a data structure called a repository. A git repository contains, among other things, the following: A set of commit objects. At certain points in the development of this solution new branches were created to ensure safe development of different features.
### Branches
<ul>
    <li>Master - The Master branch is the main development branch, this at times will have sub branches depending on different issues or new content.</li>
    <li>Production - The Production branch is being used as the 'Release' branch every new push to this branch is a new release. This branch is being accessed by the Heroku app.</li>
</ul>

The .gitignore will ignore:
<ul>
    <li>serverCache.txt - For security purposes, this will ensure that when this repo is pulled none of the main data is pulled with it.</li>
    <li>dist folder -  This folder is created everytime ``` npm start ``` is called so it is not neccessary to include in the git repo.</li>
</ul>


## Data Structures
The users, groups and channels arrays are arrays of objects. Each element of the array was an object that contained specific information for a user, group or channel.
These can be accessed by the client with the DataService(explained below)
```
var Users = [];
var Groups = [];
var Channels = []; 
```

For each array I have created a model that defined what data would be in each object.

User Model:
```
var User = function (id,name,email,role,channels,groups) {
    this._id = id;
    this._username = name;
    this._email = email;
    this._inChannel = channels;
    this._inGroup = groups;
    this._role = role;
    this._socket = "";
};
module.exports = User;
```

Group Model:
```
var Group = function (id,name,topic,owner) {
    this._id = id;
    this._name = name;
    this._topic = topic;
    this._owner = owner;
}

module.exports = Group;

```
Channel Model:
```
var Channel = function (id, name,topic,groupID,owner) {
    this._id = id;
    this._name = name;
    this._topic = topic;
    this._groupID = groupID;
    this._owner = owner;
};

module.exports = Channel;

```

## Client & Server Responsibilites

### Initial Startup
when the server is being started for the first time it will create a text file for the serverCache, this file is later used to store data and retrieve that data when the server is reset, similiar to how a database works.
Depending on the development environment the entire project can be built and launched using ``` npm start ```, this command has been modified to use ``` ng build && node server.js ``` sequentially.

Once built the server will serve the dist folder which contains the built angular project.


### User API
#### loginVerify
``` app.post('/loginVerify', function (req, res){}); ```  
This request takes in the username provided by the login form, it then checks if the user exists in the current Users[] array.   
If the user does not exist it will throw an error, if the user does exist it will prompt the client to navigate to dashboard.

#### Create User
``` app.post('/createUser', function (req, res){}); ```  
This request takes in the email, username and role from the new user form, it then checks if the user already exists in the current Users[] array.  
If the User Already exists it will throw an error.
If the User doesnt exist it will create and push the new User to the Users[] array.
it will then use basic socket.io functionality to emit the new Users[] array to all sockets.

#### Delete User
``` app.post('/deleteUser', function (req, res){}); ```  
This request takes in the userID of the user to be removed, it loops through the Users[] array until it finds a matching user then deletes it.  
Returns a message if the User has been deleted.  
It also prompts the clients to request an updated data set.

### Group API
#### Create Group
``` app.post('/createGroup', function (req, res){}); ```  
This request takes in the name and topic from the new Group form.  
It will create and push the new Group to the Groups[] array.
It will push the Group ID, to the _inGroup array of the User that created it.
It will also push the Group ID, to the _inGroup array of the Super User
It also prompts the clients to request an updated data set.

#### Get Group
``` app.post('/getGroup', function (req, res){}); ```  
This function returns all details for the requested group.

#### Remove Group
``` app.post('/removeGroup', function (req, res){}); ```    
This function takes in the the GroupID that is going to be removed. 
It loops through Users[].inChannel[], Users[]._ingroup[], Channels[] removing elements from each that reflect the group being removed.
finally it loops through the Groups[] removing the request Group.

It also prompts the clients to request an updated data set.
### Channel API
#### Create Channel
``` app.post('/createChannel', function (req, res){}); ```  
This request takes in the name and topic from the new Channel form.  
It will create and push the new Channel to the Channels[] array.
It will push the Channel ID, to the _inChannel array of the User that created it.
It will also push the Channel ID, to the _inChannel array of the Super User
It also prompts the clients to request an updated data set.

#### Remove Channel
``` app.post('/removeChannel', function (req, res){}); ```  
This function takes in the the channelID that is going to be removed. 
It loops through Users[].inChannel[] removing elements from each that reflect the channel being removed.
finally it loops through the Channels[] removing the request Group.
As well as removing any Users._inChannel[] elements that equal to the channelID being removed. 

### Hybrid Group and Channel API
The below functions cater for 2 options each, this has been done to prevent redundancy.  
#### Remove User form Group or Channel
``` app.post('/removeUserFromGroupChannel', function (req, res){}); ```  
Depending on the option given is what is removed.  
``` option == channel ```  
removing any Users._inChannel[] elements that equal to the channelID being removed.  
``` option == Group ```   
removing any Users.inGroup[] elements that equal to the groupID being removed. 
The Channels that belong to the group will be removed from the User[]._inChannel array, removing any Channels that _owner equals the groupID being removed.  
It also prompts the clients to request an updated data set.
#### Add User to Group or Channel
``` app.post('/addUsertoGroupChannel', function (req, res){}); ```    
Depending on the option given is what is added to.  
``` option == channel ```  
This checks if the user is already in the channel  before adding to the channel, nothing will happen if the user already is in the channel.  
If a user is not already in the channel then the _inChannel[] of the given user If the user isnt in the group that the channel belongs to then the User will also be added to that group, updating the Users[]._inGroup array with the GroupID.  
``` option == Group ```  
If the user is not already in the group, then they will simply be added to the group  
It also prompts the clients to request an updated data set.
### Basic Socket Implementation
Basic socket.io functions have been implementated to cater for real time data access, this prevents user from accessing channels or groups that they have been removed from. As well as having an updated list of all users when it comes to adding to groups/channels.


```  socket.on('loginSetup', function(id){}); ```    
After the user has logged in and has connected its socket, the server will recieve a 'loginSetup' request. This will send all the filterd data to the user that requested.
```  socket.on('requestData', function(id){}); ```    
When the server recieves the 'requestData' message it will send all filtered data to the user that requested.
```  socket.on('disconnect', function(id){}); ```    
This is called when the server detects that a user has disconnected, generally this means the user has logged out.

    
### Custom Functions
The below functions help with the functionality explained above.  
``` function usersChannels(currentUser){} ```  
This function takes in the CurrentUsers ID, filters and returns the Channels[] array to only contain the Channels the User is currently in.  

``` function usersGroups(currentUser){} ```  
This function takes in the CurrentUsers ID, filters and returns the Groups[] array to only contain the Groups the User is currently in.  
## Angular Architecture
This angular project uses app-routing to help navigate between views.  
The two mains views are: Login and Dashboard.  

### Routes
First accessing the webpage the user will be forwarded to the /login route to use the login form, when the form has been successful the user will navigate to the Dashboard path which will redirect to the first group and the first channel URL. This will be used to its full capacity when a database is implemented.
```
 { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent,
    children: [
            {
                path:'',
                redirectTo: 'group/0/channel/0',
                pathMatch: 'full'
            },
            {
                path:'group/:id/channel/:channelID',
                component: RoomComponent
            }
          ]
  }
```


### Main components

#### Login 
This view allows the user to log into the webapp. It uses a angular form to submit details to the /loginVerify API.  
This page can be accessed via ``` /login ``` or ```/```

#### Dashboard
This component exposes the user to all remaining functions of the webapp, depending on the users role they can perform CRUD opperations on Groups, channels and Users.  
This page can be accessed via ```/dashboard/group/:id/channels/:id ```  
The ```/group/:id/channels/:id ``` is being used to pass data around and to reflect the changes the user is making. In the future it will be spread out into a Child route to allow a default Group page.

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
This service also saves the URLs of 3 different environements being used throughout the development of this web app.

With the one currently being used uncommented.

```
 public url = 'http://localhost:8080'; // Local
// public url = 'https://node-garbage-thomasmcdonald1996.c9users.io'; // Cloud9
// public url = 'https://chat-factory.herokuapp.com'; // "Production"


```
These urls are being accessed by the components that need to make HTTP requests to the server.
