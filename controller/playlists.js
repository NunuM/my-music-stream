const {FeaturedPlaylist} = require('../provider/featured_playlist')
const {RuntimeError} = require("../errors/runtime");
const {PlaylistsDal} = require("../dal/playlists");
const {Validators} = require("../utils/validators");
const {PlaylistItemsDal} = require("../dal/playlist_items");
const {SongsDal} = require("../dal/songs");

class PlaylistsController {

    /**
     * @constructor
     * @param {ServiceRegistry} services
     */
    constructor(services) {
        this.services = services;
    }

    /**
     * Featured Playlists
     * @return {Promise<Array<FeaturedPlaylist>>}
     */
    featuredPlaylistById(id) {
        return FeaturedPlaylist.byId(id)(this.services.httpClient())
            .then((result) => {
                return [result];
            })
            .catch((error) => {
                this.services.logging().error("Error getting featured list " + id, error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }

    /**
     * Featured Playlists
     * @return {Promise<Array<FeaturedPlaylist>>}
     */
    featuredPlaylists() {
        return Promise.all([
            FeaturedPlaylist.brasilPlaylist(this.services.httpClient()),
            FeaturedPlaylist.frenchPlaylist(this.services.httpClient()),
            FeaturedPlaylist.portuguesePlaylist(this.services.httpClient()),
            FeaturedPlaylist.spanishPlaylist(this.services.httpClient())
        ]).catch((error) => {
            this.services.logging().error("Error getting featured lists", error);

            return Promise.reject(new RuntimeError("Unexpected service error"));
        });
    }

    /**
     * Account playlist by their id
     * @param {number} playlistId
     * @param {number} accountId
     * @return {Promise<Array<Playlist>>}
     */
    playlistById(accountId, playlistId) {
        const dal = new PlaylistsDal(this.services.database());

        return dal
            .getPlaylistById(playlistId, accountId)
            .catch((error) => {
                this.services.logging().error("Error getting playlist id " + playlistId, error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }

    /**
     * Account playlists
     * @param {number} accountId
     * @param {number} limit
     * @param {number} page
     * @return {Promise<Array<Playlist>>}
     */
    allPlaylists(accountId, limit, page) {
        const dal = new PlaylistsDal(this.services.database());

        return dal
            .all(accountId, limit, page)
            .catch((error) => {
                this.services.logging().error("Error getting playlist id " + playlistId, error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }

    /**
     * Account playlists by their name
     * @param {number} accountId
     * @param {string} playlistName
     * @param {number} limit
     * @param {number} page
     * @return {Promise<Array<Playlist>>}
     */
    playlistsByName(accountId, playlistName, limit, page) {
        const dal = new PlaylistsDal(this.services.database());

        return dal
            .getPlaylistByName(playlistName, accountId, limit, page)
            .catch((error) => {
                this.services.logging().error("Error getting playlist by name " + playlistName, error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }

    /**
     * New playlist
     * @param {number} accountId
     * @param {string} name
     * @param {string} avatar
     * @return {Promise<Playlist>}
     */
    newPlaylist(accountId, name, avatar) {
        const nameValidator = new Validators(name, 'name');
        nameValidator.minLength(1).maxLength(50);

        Validators.validateAvatar(avatar);

        const dal = new PlaylistsDal(this.services.database());

        return dal
            .insertPlaylist(name, avatar, accountId)
            .catch((error) => {
                this.services.logging().error("Error inserting playlist", error);

                return Promise.reject(new RuntimeError("Unexpected server error"));
            });
    }


    /**
     * New playlist
     * @param {number} accountId
     * @param {number} playlistId
     * @param {string} name
     * @param {string} avatar
     * @return {Promise<boolean>}
     */
    updatePlaylist(accountId, playlistId, name, avatar) {

        const nameValidator = new Validators(name, 'name');
        nameValidator.maxLength(1).maxLength(50);

        Validators.validateAvatar(avatar);

        const dal = new PlaylistsDal(this.services.database());

        return dal
            .updatePlaylist(playlistId, accountId, name, avatar)
            .catch((error) => {
                this.services.logging().error("Error updating playlist", error);

                return Promise.reject(new RuntimeError("Unexpected server error"));
            });
    }

    /**
     * Delete playlist
     * @param {number} accountId
     * @param {number} playlistId
     * @return {Promise<boolean>}
     */
    deletePlaylist(accountId, playlistId) {

        const dal = new PlaylistsDal(this.services.database());

        return dal
            .deletePlaylist(playlistId, accountId)
            .catch((error) => {
                this.services.logging().error("Error deleting playlist", error);

                return Promise.reject(new RuntimeError("Unexpected server error"));
            });
    }

    /**
     * Remove from Playlist
     * @param {number} accountId
     * @param {number} itemId
     * @return {Promise<boolean>}
     */
    removeFromPlaylist(accountId, itemId) {
        const dal = new PlaylistsDal(this.services.database());

        return dal
            .getPlaylistContainingItem(itemId, accountId)
            .then((playlists) => {
                if (Array.isArray(playlists) && playlists.length === 1) {
                    const itemsDal = new PlaylistItemsDal(this.services.database());

                    return itemsDal
                        .removeFromPlaylist(itemId)
                        .catch((error) => {
                            this.services.logging().error("Error removing item from playlist", error);

                            return Promise.reject(new RuntimeError("Unexpected server error"));
                        });
                } else {
                    return Promise.reject(new RuntimeError("Forbidden"));
                }
            });
    }

    /**
     * Insert playlist item
     * @param {number} accountId
     * @param {number} playlistId
     * @param {number} songId
     * @return {Promise<boolean>}
     */
    async insertPlaylistSong(accountId, playlistId, songId) {

        const playlistDal = new PlaylistsDal(this.services.database());
        const songsDal = new SongsDal(this.services.database());

        return Promise.all([
            playlistDal.getPlaylistById(playlistId, accountId),
            songsDal.getSongById(accountId, songId)
        ]).then((results) => {
            for (const result of results) {
                if (!(Array.isArray(result) && result.length === 1)) {
                    return Promise.reject(new RuntimeError("Forbidden"));
                }
            }

            return void 0;
        }).then(() => {
            const dal = new PlaylistItemsDal(this.services.database());

            return dal
                .insertPlaylistSong(playlistId, songId)
                .catch((error) => {
                    this.services.logging().error("Error inserting playlist item", error);

                    return Promise.reject(new RuntimeError("Unexpected server error"));
                });
        });
    }

    /**
     * Get playlist items without checking ownership
     * @param {number} playlistId
     * @param {number} limit
     * @param {number} page
     * @return {Promise<PlaylistItem>}
     */
    safePlaylistItems(playlistId, limit, page) {
        const dal = new PlaylistItemsDal(this.services.database());

        return dal
            .all(playlistId, limit, page)
            .catch((error) => {
                this.services.logging().error("Error obtaining playlist items", error);

                return Promise.reject(new RuntimeError("Unexpected server error"));
            });
    }


}

module.exports = {PlaylistsController};
