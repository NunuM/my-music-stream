class ArtistsDal {

    constructor(connection) {
        this.connection = connection;
    }

    /**
     * List all artists
     *
     * @param {number} accountId
     * @param {number} [limit=10]
     * @param {number} [page=0]
     * @return {Promise<Array<Artist>>}
     */
    all(accountId, limit = 10, page = 0) {
        return this.connection
            .query("SELECT * FROM artists WHERE account_id=? ORDER BY id DESC LIMIT ? OFFSET ?", [accountId, limit, page * limit])
            .then((result) => {
                return result.rows;
            });
    }

    /**
     * Search artist by id
     *
     * @param {number} artistId
     * @param {number} accountId
     * @return {Promise<Array<Artist>>}
     */
    searchArtistById(artistId, accountId) {
        return this.connection
            .query("SELECT * FROM artists WHERE id=? AND account_id=? LIMIT 1", [artistId, accountId])
            .then(result => result.rows);
    }

    /**
     * Paginate artists by name
     * @param {string} artistName
     * @param {number} [limit=10]
     * @param {number} [page=0]
     * @param {number} accountId
     * @return {Promise<Array<Artist>>}
     */
    searchArtistByName(artistName, accountId, limit = 10, page = 0) {
        return this.connection
            .query(
                "select * from artists where MATCH(name) AGAINST(?) AND account_id=? ORDER BY id DESC LIMIT ? OFFSET ?",
                [
                    artistName,
                    accountId,
                    limit,
                    page * limit
                ]
            )
            .then(result => result.rows);
    }

    /**
     * Get artist by their song
     * @param songId
     * @param accountId
     * @return {Promise<Artist>}
     */
    getArtistBySongId(songId, accountId) {
        return this.connection
            .query("SELECT a.* FROM songs s JOIN artists a on s.artist_id = a.id WHERE s.id=? AND a.account_id=?", [songId, accountId])
            .then(result => result.rows[0]);
    }

    /**
     * Get artist by their song
     * @param songId
     * @return {Promise<Artist>}
     */
    safeArtistBySongId(songId) {
        return this.connection
            .query("SELECT a.* FROM songs s JOIN artists a on s.artist_id = a.id WHERE s.id=?", [songId])
            .then(result => result.rows[0]);
    }

    /**
     * Create new artist
     *
     * @param {string} name
     * @param {string} avatar
     * @param {number} accountId
     * @return {Promise<Artist>}
     */
    insertArtist(name, avatar, accountId) {
        return this.connection
            .query("INSERT INTO artists (avatar, name, account_id) VALUES (?,?,?)", [avatar, name, accountId])
            .then((result) => {
                if (result.lastInsertedId > 0) {
                    return {
                        id: result.lastInsertedId,
                        name,
                        avatar,
                        created: new Date().toString()
                    }
                } else {
                    return Promise.reject(new Error("Error inserting artist"))
                }
            });
    }

    /**
     * Update Artist
     * @param {number} artistId
     * @param {string} name
     * @param {string} avatar
     * @param {number} accountId
     * @return {Promise<boolean>}
     */
    updateArtist(artistId, name, avatar, accountId) {
        return this.connection
            .query("UPDATE artists SET name=?, avatar=? WHERE id=? AND account_id=?", [name, avatar, artistId, accountId])
            .then(result => result.affectedRows > 0);
    }

    /**
     * Delete artist
     * @param {number} artistId
     * @param {number} accountId
     * @return {Promise<boolean>}
     */
    deleteArtist(artistId, accountId) {
        return this.connection
            .query("DELETE FROM artists WHERE id=? AND account_id=?", [artistId, accountId])
            .then(result => result.affectedRows > 0);
    }

}

module.exports = {ArtistsDal};
