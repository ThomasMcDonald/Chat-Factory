var Channel = function (id, name,topic,groupID,owner) {
    this._id = id;
    this._name = name;
    this._topic = topic;
    this._groupID = groupID;
    this._owner = owner;
};


module.exports = Channel;
