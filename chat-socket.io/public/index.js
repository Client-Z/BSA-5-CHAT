(() => {
    var socket = io();

    const modalWindow = document.getElementById('modal-window');
    const name = document.getElementById('nameInput');
    const nickName = document.getElementById('nickNameInput');
    let addUserBtn = document.querySelector('.addUserBtn')
    let messageField = document.getElementById('messageInput');
    let sendBtn = document.querySelector('#send');
    let typingField = document.querySelector('.type-status');

    let user = {};
    let socketID = '';

    addUserBtn.onclick = () => {
        user = {
            userName: name.value,
            userNickName: nickName.value,
            status: "just appeared",
            isTyping: false
        };
        socket.emit('new user', user);
        name.value = '';
        nickName.value = '';
        modalWindow.style.display = "none";
        socket.emit('requestHistory');
    };


    socket.on('responseHistory', function(messages, users) {
        for (var i = 0; i < messages.length; i++) {
            renderMessage(messages[i]);
        }

        for (var j = 0; j < users.length; j++) {
            renderUser(users[j]);
        }
    });

    socket.on('update users', function(users) {
        let usersBox = document.getElementById('users');
        while (usersBox.hasChildNodes()) {
            usersBox.removeChild(usersBox.firstChild);
        }
        for (var j = 0; j < users.length; j++) {
            renderUser(users[j]);
        }
    });


    socket.on('typing', (data, deleteNode) => {
        if (!deleteNode) {
            var textnode = document.createTextNode(data.userNickName + ' is typing... ');
            let typingElement = document.createElement('span');
            typingElement.id = data.userNickName;
            typingElement.appendChild(textnode);
            typingField.appendChild(typingElement);
        } else {
            for (let i = 0; i < typingField.childNodes.length; i++) {
                if (typingField.childNodes[i].id == data.userNickName) {
                    typingField.childNodes[i].remove();
                }
            }
        }
    });

    socket.on('send ID', function(id) {
        socketID = id;
    });

    sendBtn.onclick = (ev) => {
        ev.preventDefault();
        let msg = messageField.value;
        socket.emit('chat message', msg);
        renderMessage(msg);
        messageField.value = '';
    };

    socket.on('chat message', function(msg, userNickName){
        if (userNickName && (userNickName == user.userNickName)) {
            renderMessage(msg, true);
        } else { renderMessage(msg); }
    });

    window.onbeforeunload = () => {
        socket.emit('get offline', user);
        socket.emit('chat message', '(' + user.userNickName + ' has left this chat.)');
        renderMessage('(' + user.userNickName + ' has left this chat.)');
    };

    messageField.addEventListener('focus', () => {
        let typing = Object.assign({}, user, {isTyping:true});
        socket.emit('is typing', typing);
    });

    messageField.addEventListener('blur', () => {
        let typing = Object.assign({}, user, {isTyping:false});
        socket.emit('is typing', typing);
    });

    function renderMessage(msg, msgForUser) {
        let messageOutput = document.createElement('li');
        if(msg) {
            messageField.className = '';
            let textNode = document.createTextNode(msg);
            messageOutput.appendChild(textNode);
            document.getElementById('messages').appendChild(messageOutput);
            if (document.getElementById('messages').childNodes.length > 100) {
                document.getElementById('messages').childNodes[0].remove();
            }
            window.scrollTo(0, document.body.scrollHeight);

            if (msgForUser) {
                messageOutput.className += ' msgForUser';
            }
        } else {
            messageField.placeholder = 'You should be entered at least one character!';
            messageField.className += ' emptyMessage';
        }
    }

    function renderUser(usr) {
        let userField = document.createElement('li');
        let textnode;
        if (socketID == usr.sockedID) {
            textnode = document.createTextNode(usr.userName + ' ' + '(' + usr.userNickName + ')' + ' - It`s you | ' + usr.status);
            userField.className += "currentUser"
        } else {
            textnode = document.createTextNode(usr.userName + ' ' + '(' + usr.userNickName + ')' + ' - ' + usr.status);
        }
        userField.appendChild(textnode);
        document.getElementById('users').appendChild(userField);
    }
})();