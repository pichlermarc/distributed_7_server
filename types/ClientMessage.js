const message = require("Message")

class ClientMessage {
    constructor(username, token, content) {
        this.username = username;
        this.token = token;
        this.content = content;
    }

    generateServerMessage() {
        return new Message(this.username, this.content)
    }
}