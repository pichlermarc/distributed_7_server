const io = require("socket.io");

const socket = io('http://localhost');
var localUser = null;
socket.on("request_registration", function (data) {
    socket.emit("register", new User("reinhart"));
});

socket.on("message_history", function (messageHistory) {
    console.log(messageHistory);
});

socket.on("registration_response", function (user) {
    console.log(user);
    localUser = user;
    socket.emit("message", new ClientMessage(localUser.username, localUser.token, "hello, bitches."))
});

socket.on("online_users", function (users) {
    console.log(users);
});

socket.on("new_message", function (message) {
    console.log(message);
});
