var Channel = function (id, name,topic,groupID,owner) {
    this._id = id;
    this._name = name;
    this._topic = topic;
    this._groupID = groupID;
    this._owner = owner;
    //this._createdAt = created_at;
    //this._createdBy = created_by;
};


module.exports = Channel;
