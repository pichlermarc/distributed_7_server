const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
server.listen(80);
console.log("hello, bitches.");

var sockets = [];
var users = [];
var messageHistory = [];

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

function getUsername(token) {
    users.forEach(user => {
        if (user.token === token) return user.username;
    });
    return null;
}

function disconnectUser(socket) {

    delete users[socket];
    //TODO: synchronize.
    reportOnlineUsers();

}

function reportOnlineUsers() {
    let userList = [];
    users.forEach(user => userList.push(user.generateUserInformation()));
    users.forEach(user => user.socket.emit('online_users', userList));
}

function distributeMessage(message) {
    messageHistory.push(message);
    users.forEach(user => user.socket.emit("new_message", message));
}

io.on('connection', function (socket) {
    socket.emit('request_registration', {});
    socket.on('register', function (user) {
        let serverUser = new User(user.username);
        serverUser.generateToken();
        socket.emit('registration_response', serverUser);
        socket.emit('message_history', messageHistory);
        serverUser.socket = socket;
        users[socket](serverUser);
        reportOnlineUsers();
    });

    socket.on('disconnect', function () {
        disconnectUser(socket);
    });

    socket.on('message', function (clientMessage) {
        let username = getUsername(clientMessage.token);
        distributeMessage({username: username, content: message.content});
    });
});