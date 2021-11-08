class UsersDal {

    constructor(connection) {
        this.connection = connection;
    }

    /**
     * Get authorization by email
     * @param {string} email
     * @return {Promise<User|null>}
     */
    getUserByEmail(email) {
        return this.connection
            .query("SELECT * FROM account WHERE email=?", [email])
            .then((result) => {
                return result.rows[0] || null
            });
    }


    /**
     * Get song owner id
     * @param {number} songId
     * @return {Promise<{id:number}>}
     */
    getSongOwnerId(songId) {
        return this.connection
            .query("SELECT s.account_id as id FROM songs s JOIN artists a on a.id = s.artist_id WHERE s.id=? LIMIT 1", [songId])
            .query((result) => {
                if (result.rows.length === 1) {
                    return result.rows[0];
                } else {
                    return Promise.reject(new Error(`Song ${songId} not found`));
                }
            });
    }

    /**
     * Create new account
     * @param {string} email
     * @param {string} password
     * @return {Promise<User>}
     */
    insertNewAccount(email, password) {
        return this
            .connection
            .query("INSERT INTO account (email, password) VALUES (?,?)", [email, password])
            .then((result) => {
                if (result.lastInsertedId > 0) {
                    return {
                        id: result.lastInsertedId,
                        email,
                        created: new Date().getTime()
                    }
                } else {
                    return Promise.reject(new Error("Error inserting authorization"))
                }
            });
    }
}


module.exports = {UsersDal}
