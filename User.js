const uuidv4 = require('uuid/v4');
const uuidv1 = require('uuid/v1');

class User {
    constructor(username, token, date) {
        this.username = username.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        this.token = token;
        this.socket = null;
        this.date = date;
    }

    generateToken() {
        this.token = uuidv4();
    }

    generateUserInformation() {
        return new User(this.username, null, this.date);
    }
}

module.exports = User;