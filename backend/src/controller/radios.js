const {RadiosDal} = require("../dal/radios");
const {RuntimeError} = require("../errors/runtime");
const {Validators} = require("../utils/validators");

class RadiosController {

    /**
     * @constructor
     * @param {ServiceRegistry} services
     */
    constructor(services) {
        this.services = services;
    }

    /**
     * All Radios
     * @param {number} accountId
     * @param {number} limit
     * @param {number} page
     * @return {Promise<Array<Radio>>}
     */
    allRadios(accountId, limit, page) {
        const dal = new RadiosDal(this.services.database());

        return dal
            .all(accountId, limit, page)
            .catch((error) => {
                this.services.logging().error("Error getting radios", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }

    /**
     * New Radio
     * @param {number} accountId
     * @param {string} name
     * @param {string} stream
     * @param {string} avatar
     * @return {Promise<Radio>}
     */
    newRadio(accountId, name, stream, avatar) {
        const nameValidator = new Validators(name, 'name');
        nameValidator.minLength(1).maxLength(100);

        Validators.validateAvatar(avatar);

        const streamValidator = new Validators(stream, 'stream');
        streamValidator.isValidURL();

        const dal = new RadiosDal(this.services.database());

        return dal
            .insertRadio(accountId, name, stream, avatar)
            .catch((error) => {
                this.services.logging().error("Error inserting radio", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }


    /**
     * Edit Radio
     * @param {number} accountId
     * @param {number} radioId
     * @param {string} name
     * @param {string} stream
     * @param {string} avatar
     * @return {Promise<boolean>}
     */
    updateRadio(accountId, radioId, name, stream, avatar) {

        const nameValidator = new Validators(name, 'name');
        nameValidator.minLength(1).maxLength(100);

        Validators.validateAvatar(avatar);

        const streamValidator = new Validators(stream, 'stream');
        streamValidator.isValidURL();

        const dal = new RadiosDal(this.services.database());

        return dal
            .updateRadio(radioId, accountId, name, stream, avatar)
            .catch((error) => {
                this.services.logging().error("Error updating radio", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }


    /**
     * Delete Radio
     * @param {number} accountId
     * @param {number} radioId
     * @return {Promise<boolean>}
     */
    deleteRadio(accountId, radioId) {
        const dal = new RadiosDal(this.services.database());

        return dal
            .deleteRadio(radioId, accountId)
            .catch((error) => {
                this.services.logging().error("Error deleting radio", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }


}

module.exports = {RadiosController};
