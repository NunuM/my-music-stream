const {AccountUtils} = require('../utils/account');

const {AccountController} = require('../controller/account');
const {ArtistsController} = require('../controller/artists');
const {DevicesController} = require('../controller/devices');
const {DeviceCommandsController} = require("../controller/device_commands");
const {PlaylistsController} = require("../controller/playlists");
const {RadiosController} = require("../controller/radios");
const {GenresController} = require("../controller/genres");
const {MusicProvider} = require("../provider/music_provider");
const {SongsController} = require("../controller/songs");

class Context {
    /**
     *
     * @param {ServiceRegistry} serviceRegistry
     * @param token
     */
    constructor(serviceRegistry, token) {
        this.registry = serviceRegistry;
        this.token = token;
    }

    accountInfo() {
        return AccountUtils.decodeToken(this.registry.config(), this.token);
    }

    songProviders() {
        return new MusicProvider();
    }

    controllers() {
        return new Controllers(this.registry);
    }

}

class Controllers {

    constructor(serviceRegistry) {
        this.registry = serviceRegistry;
    }


    account() {
        return new AccountController(this.registry);
    }

    artists() {
        return new ArtistsController(this.registry);
    }

    devices() {
        return new DevicesController(this.registry);
    }

    deviceCommands() {
        return new DeviceCommandsController(this.registry);
    }

    playlists() {
        return new PlaylistsController(this.registry);
    }

    radios() {
        return new RadiosController(this.registry);
    }

    genres() {
        return new GenresController(this.registry);
    }

    songs() {
        return new SongsController(this.registry);
    }

}


module.exports = {Context};
