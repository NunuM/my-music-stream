class DevicesDal {

    constructor(connection) {
        this.connection = connection;
    }

    /**
     * List all devices
     * @param {number} accountId
     * @param {number} [limit=10]
     * @param {number} [page=0]
     * @return {Promise<Array<Device>>}
     */
    all(accountId, limit = 10, page = 0) {
        return this.connection
            .query(
                "SELECT * FROM devices WHERE account_id=? ORDER BY id DESC LIMIT ? OFFSET ?",
                [accountId, limit, page * limit]
            )
            .then(result => result.rows);
    }

    /**
     * Get device by name
     * @param {string} name
     * @param {number} accountId
     * @return {Promise<Device>}
     */
    getDeviceByName(name, accountId) {
        return this.connection
            .query("SELECT * FROM devices WHERE name=? AND account_id=?", [name, accountId])
            .then((result) => result.rows[0]);
    }

    /**
     * Upsert device
     * @param {string} name
     * @param {number} accountId
     * @return {Promise<Device>}
     */
    getOrInsertDevice(name, accountId) {
        return this.connection
            .query("INSERT IGNORE INTO devices (name,account_id) VALUES (?,?)", [name, accountId])
            .then(() => this.getDeviceByName(name, accountId));
    }

    /**
     * Update device
     * @param {number} deviceId
     * @param {boolean} isPlaying
     * @param {boolean} isOnline
     * @param {number} accountId
     * @return {Promise<boolean>}
     */
    updateDevice(deviceId, isPlaying, isOnline, accountId) {
        return this.connection
            .query("UPDATE devices SET is_online=?, is_playing=? WHERE id=? AND account_id=?",
                [isOnline, isPlaying, deviceId, accountId]
            )
            .then(result => result.affectedRows > 0);
    }

    /**
     * Get device by command
     * @param {number} commandId
     * @param {number} accountId
     * @return {Promise<Array<Device>>}
     */
    getDeviceContainingCommand(commandId, accountId) {
        return this.connection
            .query("SELECT d.* FROM devices d JOIN device_commands dc on d.id = dc.target_id WHERE dc.id=? AND d.account_id=? LIMIT 1",
                [commandId, accountId]
            )
            .then(result => result.rows);
    }
}

module.exports = {DevicesDal}
