var Group = function (id,name,topic,owner) {
    this._id = id;
    this._name = name;
    this._topic = topic;
    this._owner = owner;
    this._haschannels = [];
}

module.exports = Group;
