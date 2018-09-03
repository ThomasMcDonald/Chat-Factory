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

#### Create User
``` app.post('/createUser', function (req, res){}); ```

#### Delete User
``` app.post('/deleteUser', function (req, res){}); ```



### Group API
``` app.post('/createGroup', function (req, res){}); ```
``` app.post('/getGroup', function (req, res){}); ```
``` app.post('/removeGroup', function (req, res){}); ```

### Channel API

``` app.post('/createChannel', function (req, res){}); ```
``` app.post('/removeChannel', function (req, res){}); ```


### Hybrid Group and Channel API

``` app.post('/removeUserFromGroupChannel', function (req, res){}); ```
``` app.post('/addUsertoGroupChannel', function (req, res){}); ```



### Basic Socket Implementation
Basic socket.io functions have been implementated to cater for real time data access, this prevents user from accessing channels or groups that they have been removed from. As well as having an updated list of all users when it comes to adding to groups/channels.


```  socket.on('loginSetup', function(id){}); ```
```  socket.on('requestData', function(id){}); ```
```  socket.on('disconnect', function(id){}); ```

## Angular Architecture
This angular project uses app-routing to help navigate between views.
The two mains views are: Login and Dashboard;


### Main components

#### Login 
This view allows the user to log into the webapp. It uses a angular form to submit details to the /loginVerify API.

This page can be accessed via ``` /login ``` or ```/```

#### Dashboard
This component exposes the user to all remaining functions of the webapp, depending on the users role they can perform CRUD opperations on Groups, channels and Users.

This page can be accessed via ```/dashboard/group/:id/channels/:id ```

The ```/group/:id/channels/:id ``` is being used to pass data around and to reflect the changes the user is making. In the future it will be spread out into a Child route to allow a default Group page.

### Modals


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