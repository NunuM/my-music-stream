const {ArtistsDal} = require('../dal/artists')
const {RuntimeError} = require('../errors/runtime');
const {Validators} = require("../utils/validators");

class ArtistsController {
    /**
     * @constructor
     * @param {ServiceRegistry} services
     */
    constructor(services) {
        this.services = services;
    }

    /**
     * Account artists
     * @param {number} accountId
     * @param {number} limit
     * @param {number} page
     * @return {Promise<Array<Artist>>}
     */
    allArtists(accountId, limit, page) {
        const dal = new ArtistsDal(this.services.database());
        return dal.all(accountId, limit, page)
            .catch((error) => {
                this.services.logging().error("Error getting account artists", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }

    /**
     * Account artists by name
     * @param {string} name
     * @param {number} accountId
     * @param {number} limit
     * @param {number} page
     * @return {Promise<Array<Artist>>}
     */
    allArtistsByName(accountId, name, limit, page) {
        const dal = new ArtistsDal(this.services.database());
        return dal.searchArtistByName(name, accountId, limit, page)
            .catch((error) => {
                this.services.logging().error("Error getting artists by name", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }

    /**
     * Account artists by id
     * @param {number} accountId
     * @param {number} artistId
     * @return {Promise<Array<Artist>>}
     */
    artistsById(accountId, artistId) {
        const dal = new ArtistsDal(this.services.database());
        return dal.searchArtistById(artistId, accountId)
            .catch((error) => {
                this.services.logging().error("Error getting artist by id", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }

    /**
     * New artist
     * @param {number} accountId
     * @param {string} name
     * @param {string} avatar
     * @return {Promise<Artist>}
     */
    newArtist(accountId, name, avatar) {
        const nameValidator = new Validators(name, 'name');
        nameValidator.minLength(1).maxLength(100);

        Validators.validateAvatar(avatar);

        const dal = new ArtistsDal(this.services.database());

        return dal
            .insertArtist(name, avatar, accountId)
            .catch((error) => {
                this.services.logging().error("Error inserting artist", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }

    /**
     * Update account artist
     * @param {number} accountId
     * @param {number} artistId
     * @param {string} name
     * @param {string} avatar
     * @return {Promise<boolean>}
     */
    updateArtist(accountId, artistId, name, avatar) {
        const nameValidator = new Validators(name, 'name');
        nameValidator.minLength(1).maxLength(100);

        Validators.validateAvatar(avatar);

        const dal = new ArtistsDal(this.services.database());

        return dal
            .updateArtist(artistId, name, avatar, accountId)
            .catch((error) => {
                this.services.logging().error("Error updating artist", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }


    /**
     * Remove account artist
     * @param {number} accountId
     * @param {number} artistId
     * @param {string} name
     * @param {string} avatar
     * @return {Promise<boolean>}
     */
    removeArtist(accountId, artistId) {
        const dal = new ArtistsDal(this.services.database());

        return dal
            .deleteArtist(artistId, accountId)
            .catch((error) => {
                this.services.logging().error("Error deleting artist", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }

    /**
     * Get artist without checking song ownership
     * @param {number} songId
     * @return {Promise<Artist>}
     */
    safeArtistBySongId(songId) {
        const dal = new ArtistsDal(this.services.database());

        return dal
            .safeArtistBySongId(songId)
            .catch((error) => {
                this.services.logging().error("Error obtaining artist songs", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }

}

module.exports = {ArtistsController};
