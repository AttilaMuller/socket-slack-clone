joinRoom = roomName => {
    nsSocket.emit('joinRoom', roomName, (newNumerOfMembers) => {
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumerOfMembers} Users <span class="glyphicon glyphicon-user"></span>`
    });

    nsSocket.on('roomHistory', history => {
        msgsElement = document.querySelector('#messages');
        msgsElement.innerHTML = '';
        if (!history.length) { msgsElement.innerHTML = 'There are no messages in this room' };

        history.forEach(msg => addMsgToDiv(msg));
        msgsElement.scrollTo(0, msgsElement.scrollHeight);
    });

    nsSocket.on('updateMembers', numMembers => {
        document.querySelector('.curr-room-num-users').innerHTML = `${numMembers} Users <span class="glyphicon glyphicon-user"></span>`
        document.querySelector('.curr-room-text').innerText = `${roomName}`;
    });
}