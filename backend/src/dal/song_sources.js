class SongSourcesDal {

    constructor(connection) {
        this.connection = connection;
    }


    /**
     * Insert new source
     * @param {number} providerId
     * @param {number} songId
     * @param {number} sourceId
     * @param {string} sourceUri
     * @return {Promise<boolean>}
     */
    insertSongSource(providerId, songId, sourceId, sourceUri) {
        return this.connection
            .query("INSERT INTO song_source (song_id, source_uri, provider_id, source_id) VALUES (?,?,?,?)",
                [songId, sourceUri, providerId, sourceId])
            .then(result => result.affectedRows > 0);
    }

    /**
     * Song Sources
     * @param {number} songId
     * @param {number} accountId
     * @return {Promise<Array<SongSource>>}
     */
    songSources(songId, accountId) {
        return this
            .connection
            .query('SELECT ss.* FROM song_source ss JOIN songs s on ss.song_id = s.id JOIN artists a on a.id = s.artist_id WHERE ss.song_id=? AND a.account_id=?',
                [songId, accountId]
            )
            .then((result) => result.rows);
    }

    /**
     * Song Sources
     * @param {number} songId
     * @return {Promise<Array<SongSource>>}
     */
    safeSongSources(songId) {
        return this.connection
            .query("SELECT * FROM song_source WHERE song_id=?", [songId])
            .then((result) => result.rows);
    }

    /**
     * Songs with genre
     * @param {number} genreId
     * @param {number} accountId
     * @param {number} limit
     * @param {number} page
     * @return {Promise<Array<Song>>}
     */
    songsByGenre(genreId, accountId, limit = 10, page = 0) {
        return this.connection
            .query("SELECT * FROM songs s JOIN artists a on a.id = s.artist_id JOIN song_genre sg on s.id = sg.song_id WHERE  sg.genre_id=? AND a.account_id=? ORDER BY s.id DESC LIMIT ? OFFSET ?",
                [genreId, accountId, limit, limit * page])
            .then((result) => result.rows);
    }

}

module.exports = {SongSourcesDal};
