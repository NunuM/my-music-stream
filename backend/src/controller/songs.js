const {SongsDal} = require("../dal/songs");
const {SongSourcesDal} = require("../dal/song_sources");
const {RuntimeError} = require("../errors/runtime");
const {SongProvidersDal} = require("../dal/song_providers");
const {Validators} = require("../utils/validators");
const {ArtistsDal} = require("../dal/artists");

class SongsController {

    /**
     * @constructor
     * @param {ServiceRegistry} services
     */
    constructor(services) {
        this.services = services;
    }

    /**
     * All account songs
     * @param {number} accountId
     * @param {number} limit
     * @param {number} page
     * @return {Promise<Array<Song>>}
     */
    allSongs(accountId, limit, page) {

        const dal = new SongsDal(this.services.database());

        return dal
            .all(accountId, limit, page)
            .catch((error) => {
                this.services.logging().error("Error getting songs", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }

    /**
     * Get account songs by name search
     * @param {number} accountId
     * @param {string} songName
     * @param {number} limit
     * @param {number} page
     * @return {Promise<Array<Song>>}
     */
    searchSongsByName(accountId, songName, limit, page) {
        const dal = new SongsDal(this.services.database());

        return dal
            .searchSongByName(songName, accountId, limit, page)
            .catch((error) => {
                this.services.logging().error("Error getting songs by name", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }

    /**
     * Get song sources
     * @param {number} accountId
     * @param {number} songId
     * @return {Promise<Array<SongSource>>}
     */
    allSongSources(accountId, songId) {
        const dal = new SongSourcesDal(this.services.database());
        return dal
            .songSources(songId, accountId)
            .then((results) => {

                const promises = [];

                for (const source of results) {
                    promises.push(this.services
                        .songProvider()
                        .resolve(source, accountId)
                        .then((streamUrl) => {
                            source.source_uri = streamUrl;
                            return source;
                        }));
                }

                return Promise.all(promises);
            })
            .catch((error) => {
                this.services.logging().error("Error getting songs sources", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }

    /**
     * Providers
     * @param {number} accountId
     * @param {number} limit
     * @param {number} page
     * @return {Promise<Array<SongProvider>>}
     */
    songProviders(accountId, limit, page) {
        const dal = new SongProvidersDal(this.services.database());

        return dal
            .all(accountId, limit, page)
            .catch((error) => {
                this.services.logging().error("Error getting songs providers", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }

    /**
     * Create new song
     * @param {number} accountId
     * @param {number} artistId
     * @param {string} name
     * @return {Promise<Song>}
     */
    newSong(accountId, artistId, name) {
        const nameValidator = new Validators(name, 'name');
        nameValidator.minLength(1).maxLength(200);

        const artistDal = new ArtistsDal(this.services.database());

        return artistDal
            .searchArtistById(artistId, accountId)
            .then((artist) => {
                if (Array.isArray(artist) && artist.length === 1) {
                    const songsDal = new SongsDal(this.services.database());
                    return songsDal
                        .insertSong(artistId, name)
                        .catch((error) => {
                            this.services.logging().error("Error inserting new song", error);

                            return Promise.reject(new RuntimeError("Unexpected service error"));
                        });
                } else {
                    return Promise.reject(new RuntimeError("Forbidden"));
                }
            });
    }

    /**
     * Update song
     * @param {number} accountId
     * @param {number} songId
     * @param {string} name
     * @return {Promise<boolean>}
     */
    updateSong(accountId, songId, name) {
        const nameValidator = new Validators(name, 'name');
        nameValidator.minLength(1).maxLength(200);

        const artistDal = new ArtistsDal(this.services.database());

        return artistDal
            .getArtistBySongId(songId, accountId)
            .then((artist) => {
                if (artist) {
                    const songsDal = new SongsDal(this.services.database());
                    return songsDal
                        .updateSong(songId, name)
                        .catch((error) => {
                            this.services.logging().error("Error updating song", error);

                            return Promise.reject(new RuntimeError("Unexpected service error"));
                        });
                } else {
                    return Promise.reject(new RuntimeError("Forbidden"));
                }
            });
    }

    /**
     * Delete song song
     * @param {number} accountId
     * @param {number} songId
     * @return {Promise<boolean>}
     */
    deleteSong(accountId, songId) {
        const artistDal = new ArtistsDal(this.services.database());

        return artistDal
            .getArtistBySongId(songId, accountId)
            .then((artist) => {
                if (artist) {
                    const songsDal = new SongsDal(this.services.database());
                    return songsDal
                        .deleteSong(songId)
                        .catch((error) => {
                            this.services.logging().error("Error deleting song", error);

                            return Promise.reject(new RuntimeError("Unexpected service error"));
                        });
                } else {
                    return Promise.reject(new RuntimeError("Forbidden"));
                }
            });
    }

    /**
     * New song source
     * @param {number} accountId
     * @param {number} providerId
     * @param {number} songId
     * @param {number} sourceId
     * @param {number} sourceUri
     * @return {Promise<boolean>}
     */
    insertSongSource(accountId, providerId, songId, sourceId, sourceUri) {
        const artistDal = new ArtistsDal(this.services.database());

        return artistDal
            .getArtistBySongId(songId, accountId)
            .then((artist) => {
                if (artist) {
                    const songSourcesDal = new SongSourcesDal(this.services.database());
                    return songSourcesDal
                        .insertSongSource(providerId, songId, sourceId, sourceUri)
                        .catch((error) => {
                            this.services.logging().error("Error inserting song source", error);

                            return Promise.reject(new RuntimeError("Unexpected service error"));
                        });
                } else {
                    return Promise.reject(new RuntimeError("Forbidden"));
                }
            });
    }

    /**
     * Increment number of time that song was played
     * @param {number} accountId
     * @param {number} songId
     * @return {Promise<boolean>}
     */
    incrementPlayedSong(accountId, songId) {
        const artistDal = new ArtistsDal(this.services.database());

        return artistDal
            .getArtistBySongId(songId, accountId)
            .then((artist) => {
                if (artist) {
                    const songsDal = new SongsDal(this.services.database());
                    return songsDal
                        .incrementPlayedSong(songId)
                        .catch((error) => {
                            this.services.logging().error("Error incrementing song n of played times", error);

                            return Promise.reject(new RuntimeError("Unexpected service error"));
                        });
                } else {
                    return Promise.reject(new RuntimeError("Forbidden"));
                }
            });
    }

    /**
     * Artist songs
     * @param {number} artistId
     * @param {number} limit
     * @param {number} page
     * @return {Promise<Array<Song>>}
     */
    artistSongs(artistId, limit, page) {
        const songsDal = new SongsDal(this.services.database());

        return songsDal
            .listArtistsSongs(artistId, limit, page)
            .catch((error) => {
                this.services.logging().error("Error obtaining artist songs", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }

    /**
     * Get song sources without checking song ownership
     * @param {number} songId
     * @return {Promise<Array<SongSource>>}
     */
    safeSongSources(songId) {
        const dal = new SongSourcesDal(this.services.database());

        return dal
            .safeSongSources(songId)
            .catch((error) => {
                this.services.logging().error("Error obtaining song sources", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }

    /**
     * Songs with genre
     * @param {number} genreId
     * @param {number} accountId
     * @param {number} limit
     * @param {number} page
     * @return {Promise<Array<Song>>}
     */
    songsByGenre(accountId, genreId, limit, page) {
        const dal = new SongSourcesDal(this.services.database());

        return dal
            .songsByGenre(genreId, accountId, limit, page)
            .catch((error) => {
                this.services.logging().error("Error obtaining songs by genre", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }

    /**
     *
     * @param {number} accountId
     * @param {number} providerId
     * @param {number} sourceId
     * @return {Promise<SongSource>}
     */
    resolveSourceById(accountId, providerId, sourceId) {
        const source = {
            song_id: sourceId,
            source_id: sourceId,
            source_uri: '',
            provider_id: providerId
        };

        return this.services
            .songProvider()
            .resolve(source, accountId)
            .then((streamUrl) => {

                source.source_uri = streamUrl;

                return source;
            })
            .catch((error) => {
                this.services.logging().error("Error obtaining source for songs", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }
}

module.exports = {SongsController};
