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
