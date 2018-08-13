var User = function (id,name,role) {
    this._id = id;
    this._username = name;
    this._inChannel = [];
    this._role = role;
    this._socket;
};

module.exports = User;
