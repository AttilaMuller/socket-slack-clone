function joinNs(endPoint) {
    if (nsSocket) {
        nsSocket.close();
        const oldElement = document.querySelector('.message-form');
        const newElement = oldElement.cloneNode(true);
        oldElement.parentNode.replaceChild(newElement, oldElement);
    }

    nsSocket = io(`http://localhost:9000${endPoint}`);

    nsSocket.on('nsRoomLoad', nsRooms => {
        let roomList = document.querySelector('.room-list');
        roomList.innerHTML = '';
        nsRooms.forEach(room => {
            let glyph = room.privateRoom ? 'lock' : 'globe';
            roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`
        });
        let roomNodes = document.getElementsByClassName('room');
        Array.from(roomNodes).forEach(node => {
            node.addEventListener('click', e => {
                nsSocket.emit('leaveRoom', document.querySelector('.curr-room-text').innerText);
                joinRoom(node.innerText);
            });
        });

        // Joining first room as default
        joinRoom(document.querySelector('.room').innerText);
    });

    document.querySelector('.message-form').addEventListener('submit', formSubmission);

    nsSocket.on('messageToClients', msg => {
        addMsgToDiv(msg);
    });

    function formSubmission(event) {
        event.preventDefault();
        const msg = document.querySelector('#user-message').value;
        nsSocket.emit('newMessageToServer', { text: msg });
        document.querySelector('#user-message').value = '';
    };

    addMsgToDiv = msg => {
        const convertedTime = new Date(msg.time).toLocaleString();
        msgsElement = document.querySelector('#messages');
        if (msgsElement.innerHTML === 'There are no messages in this room') {
            msgsElement.innerHTML = '';
        };
        msgsElement.innerHTML +=
            `<li>
            <div class="user-image">
                <img src="${msg.avatar}" />
            </div>
            <div class="user-message">
                <div class="user-name-time">${msg.username} <span>${convertedTime}</span></div>
                <div class="message-text">${msg.text}</div>
            </div>
            </li>`
    }
}
