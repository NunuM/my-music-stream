class DeviceCommandsDal {

    constructor(connection) {
        this.connection = connection;
    }

    /**
     * All commands since
     * @param {number} commandId
     * @param {number} accountId
     * @return {Promise<Array<DeviceCommand>>}
     */
    listCommandsSinceId(commandId, accountId) {
        return this.connection
            .query('SELECT dc.* FROM device_commands dc JOIN devices d on dc.target_id = d.id WHERE dc.id > ? AND d.account_id=?', [commandId, accountId])
            .then((result) => {
                return result.rows;
            })
    }

    /**
     * Mark command
     * @param {number} commandId
     * @return {Promise<boolean>}
     */
    markCommandAsAcknowledged(commandId) {
        return this
            .connection
            .query("UPDATE device_commands SET acknowledged=true WHERE id=?", [commandId])
            .then(result => result.affectedRows > 0);

    }
}

module.exports = {DeviceCommandsDal};
