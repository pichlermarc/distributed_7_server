const uuidv4 = require('uuid/v4');

class User {
    constructor(username, token = null) {
        this.username = username;
        this.token = token;
    }

    generateToken() {
        this.token = uuidv4();
    }

    generateUserInformation()
    {
        return User(this.username);
    }
}