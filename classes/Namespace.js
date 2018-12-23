class Namespace {
    constructor(id, nsTitle, img, endpoint) {
        this.id = id;
        this.nsTitle = nsTitle;
        this.img = img;
        this.endpoint = endpoint;
        this.rooms = [];
    }

    addRoom(roomobj) {
        this.rooms.push(roomobj);
    }
}

module.exports = Namespace;