const {GenresDal} = require("../dal/genres");
const {RuntimeError} = require("../errors/runtime");

class GenresController {
    /**
     * @constructor
     * @param {ServiceRegistry} services
     */
    constructor(services) {
        this.services = services;
    }

    /**
     * All genres
     * @param {number} limit
     * @param {number} page
     * @return {Promise<Array<Genre>>}
     */
    allGenre(limit, page) {

        const dal = new GenresDal(this.services.database());

        return dal
            .all(limit, page)
            .catch((error) => {
                this.services.logging().error("Error getting musical genres", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }

}

module.exports = {GenresController};
