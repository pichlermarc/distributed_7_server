const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const User = require('./User.js');

server.listen(80);

global.sockets = [];
global.users = [];
global.messageHistory = [];

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

function getUsername(token) {
    for (let socketid in global.users) {
        //console.log(global.users[socketid]);
        if (global.users[socketid].token === token)
            return global.users[socketid].username;
    }
    return null;
}

function disconnectUser(socket) {
    let user = global.users[socket];
    distributeMessage({
        username: user.username,
        content: user.username + " has left.",
        date: (new Date()).toTimeString()
    })
    delete global.users[socket];
    reportOnlineUsers();

}

function reportOnlineUsers() {
    let userList = [];
    // console.log(global.users);
    for (let key in global.users) {
        userList.push(global.users[key].generateUserInformation())
    }
    for (let key in global.users) {
        global.users[key].socket.emit("online_users", userList);
    }
}

function distributeMessage(message) {
    global.messageHistory.push(message);
    for (let key in global.users) {
        global.users[key].socket.emit("new_message", message)
    }
}

io.on('connection', function (socket) {
    socket.emit('request_registration', {});
    socket.on('register', function (user) {
        let serverUser = new User(user.username, null, (new Date()).toTimeString());
        serverUser.generateToken();
        let currentDate = new Date();
        socket.emit('registration_response', serverUser);
        socket.emit('message_history', global.messageHistory);
        serverUser.socket = socket;
        global.users[socket.id] = serverUser;
        reportOnlineUsers();
        distributeMessage({
            username: serverUser.username,
            content: serverUser.username + " joined the chat.",
            date: (new Date()).toTimeString()
        })
    });

    socket.on('disconnect', function () {
        disconnectUser(socket.id);
    });

    socket.on('message', function (clientMessage) {
        let username = getUsername(clientMessage.token);
        if (username != null)
            distributeMessage({
                username: username,
                content: clientMessage.content.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                date: (new Date()).toTimeString()
            });
        else
            console.error("user not registered.");
    });
});

console.log("Server up.");