const {DeviceCommandsDal} = require("../dal/device_commands");
const {RuntimeError} = require("../errors/runtime");

class DeviceCommandsController {

    /**
     * @constructor
     * @param {ServiceRegistry} services
     */
    constructor(services) {
        this.services = services;
    }

    /**
     * All commands since
     * @param {number} commandId
     * @param {number} accountId
     * @return {Promise<Array<DeviceCommand>>}
     */
    getCommandsSince(commandId, accountId) {

        const dal = new DeviceCommandsDal(this.services.database());

        return dal
            .listCommandsSinceId(commandId, accountId)
            .catch((error) => {
                this.services.logging().error("Error getting device commands", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }
}

module.exports = {DeviceCommandsController};
