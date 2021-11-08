class RadiosDal {

    constructor(connection) {
        this.connection = connection;
    }

    /**
     * List all radios
     * @param {number} accountId
     * @param {number} [limit=10]
     * @param {number} [page=0]
     * @return {Promise<Array<Radio>>}
     */
    all(accountId, limit = 10, page = 0) {
        return this.connection
            .query(
                "SELECT * FROM radios WHERE account_id=? ORDER BY id DESC LIMIT ? OFFSET ?",
                [accountId, limit, page * limit]
            )
            .then(result => result.rows);
    }

    /**
     * Create new radio
     * @param {string} name
     * @param {string} stream
     * @param {string} avatar
     * @param {number} accountId
     * @return {Promise<Radio>}
     */
    insertRadio(accountId, name, stream, avatar) {
        return this.connection
            .query(
                "INSERT INTO radios (name, stream_url, avatar, account_id) VALUES (?,?,?,?)",
                [name, stream, avatar, accountId]
            )
            .then((result) => {
                return {
                    id: result.lastInsertedId,
                    name,
                    stream_url: stream,
                    avatar,
                    created: new Date().toString()
                }
            })
    }

    /**
     * Create new radio
     * @param {number} radioId
     * @param {number} accountId
     * @param {string} name
     * @param {string} stream
     * @param {string} avatar
     * @return {Promise<boolean>}
     */
    updateRadio(radioId, accountId, name, stream, avatar) {
        return this.connection
            .query(
                "UPDATE radios SET name=?,stream_url=?,avatar=? WHERE id=? AND account_id=?",
                [name, stream, avatar, radioId, accountId])
            .then(result => result.affectedRows > 0);
    }

    /**
     * Delete radio
     * @param {number} radioId
     * @param {number} accountId
     * @return {Promise<boolean>}
     */
    deleteRadio(radioId, accountId) {
        return this.connection
            .query("DELETE FROM radios WHERE id=? AND account_id=?", [radioId, accountId])
            .then(result => result.affectedRows > 0);
    }
}

module.exports = {RadiosDal}
