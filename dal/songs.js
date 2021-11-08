class SongsDal {

    constructor(connection) {
        this.connection = connection;
    }

    /**
     * List all songs
     * @param {number} accountId
     * @param {number} [limit=10]
     * @param {number} [page=0]
     * @return {Promise<Array<Song>>}
     */
    all(accountId, limit = 10, page = 0) {
        return this.connection
            .query(
                "SELECT s.* FROM songs s JOIN artists a on a.id = s.artist_id WHERE a.account_id=? ORDER BY s.id DESC LIMIT ? OFFSET ?",
                [accountId, limit, page * limit]
            )
            .then(result => result.rows);
    }

    /**
     * List all songs belonging to a artist
     * @param {number} artistId
     * @param {number} [limit=50]
     * @param {number} [page=0]
     * @return {Promise<Array<Song>>}
     */
    listArtistsSongs(artistId, limit = 50, page = 0) {
        return this.connection
            .query(
                "SELECT * FROM songs WHERE artist_id=? ORDER BY id DESC LIMIT ? OFFSET ?",
                [artistId, limit, page * limit]
            )
            .then(result => result.rows);
    }

    /**
     * List all songs belonging to a artist
     * @param {string} songName
     * @param {number} accountId
     * @param {number} [limit=50]
     * @param {number} [page=0]
     * @return {Promise<Array<Song>>}
     */
    searchSongByName(songName, accountId, limit = 10, page = 0) {
        return this.connection
            .query(
                "SELECT s.* FROM songs s INNER JOIN artists a on s.artist_id = a.id WHERE MATCH(s.name) AGAINST(?) AND a.account_id=? ORDER BY s.id DESC LIMIT ? OFFSET ?",
                [songName, accountId, limit, page * limit]
            )
            .then(result => result.rows);
    }

    /**
     * Get account songs by genre
     * @param {number} genreId
     * @param {number} accountId
     * @param {number} [limit=50]
     * @param {number} [page=0]
     * @return {Promise<Array<Song>>}
     */
    getSongByGenre(genreId, accountId, limit = 10, page = 0) {
        return this.connection
            .namedQuery(
                "SELECT s.* FROM song_genre sr JOIN songs s on s.id = sr.song_id JOIN artists a on a.id = s.artist_id WHERE sr.genre_id=? AND a.account_id=? ORDER BY s.id LIMIT ? OFFSET ?",
                [genreId, accountId, limit, page * limit])
            .then(result => result.rows);
    }

    /**
     * Create new song
     * @param {number} artistId
     * @param {string} name
     * @return {Promise<Song>}
     */
    insertSong(artistId, name) {
        return this.connection
            .query("INSERT INTO songs (name, artist_id) VALUES (?,?)", [name, artistId])
            .then((result) => {
                if (result.lastInsertedId > 0) {
                    return {
                        id: result.lastInsertedId,
                        name,
                        played: 0,
                        duration: 0,
                        created: new Date().toString()
                    }
                } else {
                    return Promise.reject(new Error("Error inserting song"))
                }
            });
    }

    /**
     * Update song
     * @param {number} songId
     * @param {string} name
     * @return {Promise<boolean>}
     */
    updateSong(songId, name) {
        return this.connection
            .query("UPDATE songs SET name=? WHERE id=?", [name, songId])
            .then(result => result.affectedRows > 0);
    }

    /**
     * Update song
     * @param {number} songId
     * @return {Promise<boolean>}
     */
    deleteSong(songId) {
        return this.connection
            .query("DELETE FROM songs WHERE id=?", [songId])
            .then(result => result.affectedRows > 0);
    }

    /**
     * Increment n played
     * @param {number} songId
     * @return {Promise<boolean>}
     */
    incrementPlayedSong(songId) {
        return this.connection
            .query("UPDATE songs SET played = played + 1 WHERE id=?", [songId])
            .then(result => result.affectedRows > 0);
    }

    /**
     * Set song duration
     * @param {number} songId
     * @param {number} duration is seconds
     * @return {Promise<boolean>}
     */
    setSongDuration(songId, duration) {
        return this.connection
            .query("UPDATE songs SET duration = ? WHERE id=?", [duration, songId])
            .then(result => result.affectedRows > 0);
    }

    /**
     * Get song by id
     * @param songId
     * @param accountId
     * @return {Promise<Array<Song>>}
     */
    getSongById(songId, accountId) {
        return this.connection
            .query("SELECT * FROM songs s JOIN artists a on a.id = s.artist_id WHERE s.id=? AND a.account_id=?", [songId, accountId])
            .then(result => result.rows);
    }

}

module.exports = {SongsDal};
