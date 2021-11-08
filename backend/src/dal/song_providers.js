class SongProvidersDal {

    constructor(connection) {
        this.connection = connection;
    }

    /**
     * All providers
     * @param {number} accountId
     * @param {number} [limit=10]
     * @param {number} [page=0]
     * @return {Promise<Array<SongProvider>>}
     */
    all(accountId, limit = 10, page = 0) {
        return this.connection
            .query("SELECT * FROM song_providers WHERE type=1 OR account_id=? ORDER BY id LIMIT ? OFFSET ?", [accountId, limit, page * limit])
            .then(result => result.rows);
    }

    /**
     * Insert provider
     * @param {number} accountId
     * @param {Device} device
     * @return {Promise<boolean>}
     */
    insertDeviceAsProvider(accountId, device) {
        return this.connection
            .query(
                "INSERT IGNORE INTO song_providers (name, type, account_id, device_id) VALUES (?,?,?,?)",
                [device.name, 2, accountId, device.id]
            )
            .then(result => result.affectedRows > 0);

    }

    /**
     * Get song provider
     * @param {number} accountId
     * @param {number} providerId
     * @return {Promise<SongProvider>}
     */
    getProviderById(accountId, providerId) {
        return this.connection
            .query("SELECT * FROM song_providers WHERE id=? AND account_id=?", [accountId, providerId])
            .then((result) => result.rows[0]);
    }
}

module.exports = {SongProvidersDal};
