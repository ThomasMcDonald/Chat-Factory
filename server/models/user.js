var User = function (id,name,email,role) {
    this._id = id;
    this._username = name;
    this._email = email;
    this._inChannel = [];
    this._role = role;
    this._socket;
};

module.exports = User;
