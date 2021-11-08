class GenresDal {
    constructor(connection) {
        this.connection = connection;
    }

    /**
     * List all genres
     * @param {number} [limit=10]
     * @param {number} [page=0]
     * @return {Promise<Array<Genre>>}
     */
    all(limit = 10, page = 0) {
        return this.connection
            .query(
                "SELECT * FROM genres ORDER BY id DESC LIMIT ? OFFSET ?",
                [limit, page * limit]
            )
            .then(result => result.rows);
    }

}

module.exports = {GenresDal}
