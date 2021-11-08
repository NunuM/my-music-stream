class PlaylistsDal {

    constructor(connection) {
        this.connection = connection;
    }

    /**
     * List all playlists
     * @param {number} accountId
     * @param {number} [limit=10]
     * @param {number} [page=0]
     * @return {Promise<Array<Playlist>>}
     */
    all(accountId, limit = 10, page = 0) {
        return this.connection
            .query(
                "SELECT * FROM playlists WHERE account_id=? ORDER BY id DESC LIMIT ? OFFSET ?",
                [accountId, limit, page * limit]
            )
            .then(result => result.rows);
    }

    /**
     * Get playlist by their id
     * @param {number} playlistId
     * @param {number} accountId
     * @return {Promise<Array<Playlist>>}
     */
    getPlaylistById(playlistId, accountId) {
        return this.connection
            .query("SELECT * FROM playlists WHERE id=? AND account_id=? LIMIT 1", [playlistId, accountId])
            .then(result => result.rows);
    }

    /**
     * Playlist with item
     * @param {number} itemId
     * @param {number} accountId
     * @return {Promise<Array<Playlist>>}
     */
    getPlaylistContainingItem(itemId, accountId) {
        return this.connection
            .query("SELECT p.* FROM playlists p JOIN playlist_items pi on p.id = pi.playlist_id WHERE pi.id=? AND p.account_id=? LIMIT 1", [itemId, accountId])
            .then(result => result.rows);
    }


    /**
     * Paginate lists by name
     * @param {string} name
     * @param {number} accountId
     * @param {number} [limit=10]
     * @param {number} [page=0]
     * @return {Promise<Array<Playlist>>}
     */
    getPlaylistByName(name, accountId, limit = 10, page = 0) {
        return this.connection
            .query(
                "SELECT * FROM playlists WHERE MATCH(name) AGAINST(?) AND account_id=? ORDER BY id DESC LIMIT ? OFFSET ?",
                [name, accountId, limit, page * limit]
            )
            .then(result => result.rows);
    }

    /**
     * Insert new playlist
     * @param {string} name
     * @param {string} avatar
     * @param {number} accountId
     * @return {Promise<Playlist>}
     */
    insertPlaylist(name, avatar, accountId) {
        return this.connection
            .query("INSERT INTO playlists (name,avatar,account_id) VALUES (?,?,?)", [name, avatar, accountId])
            .then((result) => {
                if (result.lastInsertedId > 0) {
                    return {
                        id: result.lastInsertedId,
                        name,
                        played: 0,
                        created: new Date().toString()
                    }
                } else {
                    return Promise.reject(new Error("Error inserting new playlist"))
                }
            });
    }

    /**
     * Update playlist
     * @param {number} playlistId
     * @param {number} accountId
     * @param {string} name
     * @param {string} avatar
     * @return {Promise<boolean>}
     */
    updatePlaylist(playlistId, accountId, name, avatar) {
        return this.connection
            .query("UPDATE playlists SET name=?, avatar=? WHERE id=? AND account_id=?", [name, avatar, playlistId, accountId])
            .then(result => result.affectedRows > 0);
    }

    /**
     * Delete playlist
     * @param {number} playlistId
     * @param {number} accountId
     * @return {PromiseLike<boolean> | Promise<boolean>}
     */
    deletePlaylist(playlistId, accountId) {
        return this.connection
            .query("DELETE FROM playlists WHERE id=? AND account_id=?", [playlistId, accountId])
            .then(result => result.affectedRows > 0);
    }
}

module.exports = {PlaylistsDal}
