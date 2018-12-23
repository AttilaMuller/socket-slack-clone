const username = prompt('Enter your username');

const socket = io('http://localhost:9000', {
    query: {
        username
    }
});
let nsSocket = '';

socket.on('nsList', namespaces => {
    document.querySelector('.namespaces').innerHTML = '';
    namespaces.forEach(ns => {
        document.querySelector('.namespaces').innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.img}"></div>\n`
    });

    Array.from(document.getElementsByClassName('namespace')).forEach(element => {
        element.addEventListener('click', e => {
            const nsEndpoint = element.getAttribute('ns');
            joinNs(nsEndpoint);
        });
    });

    // Joining wiki channel as default
    joinNs('/wiki');
});