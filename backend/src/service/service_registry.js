const configs = require('../config/app_configs.json');
const {MusicProvider} = require('../provider/music_provider');

class ServiceRegistry {

    constructor(databaseConnection, httpClient) {
        this.db = databaseConnection;
        this._songProvider = new MusicProvider(databaseConnection, configs);
        this._httpClient = httpClient;
    }

    logging() {
        return console;
    }

    httpClient() {
        return this._httpClient;
    }


    songProvider() {
        return this._songProvider;
    }

    /**
     *
     * @return {AppConfig}
     */
    config() {
        return configs
    }

    database() {
        return this.db;
    }
}

module.exports = {ServiceRegistry};
