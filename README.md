# Chat Factory

## Production
You can view the production release of this web application at:
https://chat-factory.herokuapp.com/

## Git Repository
The purpose of this Git repo is to manage the project, as they change over time. Git stores this information in a data structure called a repository. A git repository contains, among other things, the following: A set of commit objects. A certain points in the development of this solution new branches were created to ensure safe development of different features.

## Data Structures
The users, groups and channels arrays are arrays of objects. Each element of the array was an object that contained specific information for a user, group or channel.

```
var Users = [];
var Groups = [];
var Channels = []; 
```

For each array i created a model that defined what data would be in each object

User Model:
```
var User = function (id,name,email,role) {
    this._id = id;
    this._username = name;
    this._email = email;
    this._inChannel = [];
    this._role = role;
    this._socket;
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
    this._haschannels = [];
}

module.exports = Group;
```
Channel Model:
```
var Channel = function (id, name,topic,groupID,created_at,created_by) {
    this._id = id;
    this._name = name;
    this._topic = topic;
    this._groupID = groupID;
    this._createdAt = created_at;
    this._createdBy = created_by;
};


module.exports = Channel;

```

## Client & Server Responsibilites

## Angular Architecture
