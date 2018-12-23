const express = require('express');
const app = express();
const socketio = require('socket.io');

let namespaces = require('./data/namespaces');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.on('connect', socket => {
    // build an array to send back with the img and endpoint for each ns
    let nsData = namespaces.map(ns => {
        return {
            img: ns.img,
            endpoint: ns.endpoint
        }
    });
    // send the nsData back -> we have to use socket NOT io because we want to send back data only for this client
    socket.emit('nsList', nsData);
});

// loop namespaces and listen for connection
namespaces.forEach(namespace => {
    io.of(namespace.endpoint).on('connect', nsSocket => {
        const username = nsSocket.handshake.query.username;

        nsSocket.emit('nsRoomLoad', namespaces.find(ns => ns.endpoint === nsSocket.nsp.name).rooms);

        nsSocket.on('joinRoom', (roomToJoin, setNumberOfUsers) => {
            nsSocket.join(roomToJoin);
            io.of(namespace.endpoint).in(roomToJoin).clients((e, clients) => {
                setNumberOfUsers(clients.length);
            });
            const nsRoom = namespaces.find(ns => ns.nsTitle === namespace.nsTitle).rooms.find(room => room.roomTitle === roomToJoin);
            nsSocket.emit('roomHistory', nsRoom.history);
            io.of(namespace.endpoint).in(roomToJoin).clients((e, clients) => {
                io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length);
            });
        });

        nsSocket.on('leaveRoom', roomToLeave => {
            nsSocket.leave(roomToLeave);
            io.of(namespace.endpoint).in(roomToLeave).clients((e, clients) => {
                io.of(namespace.endpoint).in(roomToLeave).emit('updateMembers', clients.length);
            });
        });

        nsSocket.on('newMessageToServer', msg => {
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username: username,
                avatar: 'https://p1-ssl.vatera.hu/photos/1e/df/raktar-vendetta-anonymous-anonymus-guy-fawkes-maszk-jelmez-alarc-fdf9_1_40.jpg?v3'
            }

            // We need the item in the 1st index, since user always joins its own room first
            const roomTitle = Object.keys(nsSocket.rooms)[1];
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg);

            const nsRoom = namespaces.find(ns => ns.nsTitle === namespace.nsTitle).rooms.find(room => room.roomTitle === roomTitle);
            nsRoom.addMessage(fullMsg);
        });
    });
});
