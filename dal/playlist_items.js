class PlaylistItemsDal {

    constructor(connection) {
        this.connection = connection;
    }

    /**
     * All items from playlist
     * @param {number} playlistId
     * @param {number} [limit=50]
     * @param {number} [page=50]
     * @return {Promise<PlaylistItem>}
     */
    all(playlistId, limit = 50, page = 0) {
        return this.connection
            .query("SELECT i.id as itemId, i.created as item_created, r.id as radio_id, r.name as radio_name, r.created as radio_created,s.id as song_id, s.name as song_name , s.created as song_created FROM playlist_items i LEFT JOIN radios r ON r.id = i.radio_id LEFT JOIN songs s ON s.id = i.song_id WHERE i.playlist_id=? ORDER BY i.id DESC LIMIT ? OFFSET ?", [playlistId, limit, limit * page])
            .then((result) => {
                return result.rows.map((r) => {
                    if (r['song_id']) {
                        return {
                            id: r['itemId'],
                            song_id: r['song_id'],
                            radio_id: r['radio_id'],
                            created: r['item_created'],
                            song: {
                                id: r['song_id'],
                                name: r['song_name'],
                                played: r['played'],
                                duration: r['duration'],
                                created: r['song_created']
                            },
                            radio: null
                        }
                    } else {
                        return {
                            id: r['itemId'],
                            song_id: r['song_id'],
                            radio_id: r['radio_id'],
                            created: r['item_created'],
                            song: null,
                            radio: {
                                id: r['radio_id'],
                                name: r['radio_name'],
                                stream_url: r['stream_url'],
                                created: r['radio_created'],
                                avatar: r['avatar']
                            },
                        }
                    }
                });
            });
    }

    /**
     * Create new item
     * @param {number} playlistId
     * @param {number} songId
     * @return {Promise<boolean>}
     */
    insertPlaylistSong(playlistId, songId) {
        return this.connection
            .query("INSERT INTO playlist_items (playlist_id, song_id) VALUES (?,?)", [playlistId, songId])
            .then((result) => result.affectedRows > 0);
    }

    /**
     * Remove from playlist
     * @param {number} playlistItemId
     * @return {Promise<boolean>}
     */
    removeFromPlaylist(playlistItemId) {
        return this.connection
            .query("DELETE FROM playlist_items pi WHERE id=?", [id])
            .then(result => result.affectedRows > 0);
    }
}

module.exports = {PlaylistItemsDal};
