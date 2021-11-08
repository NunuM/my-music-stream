const {DevicesDal} = require('../dal/devices')
const {RuntimeError} = require('../errors/runtime');
const {Validators} = require("../utils/validators");
const {DeviceCommandsDal} = require("../dal/device_commands");
const {SongProvidersDal} = require("../dal/song_providers");

class DevicesController {

    /**
     * @constructor
     * @param {ServiceRegistry} services
     */
    constructor(services) {
        this.services = services;
    }

    /**
     * Get account devices
     * @param {number} accountId
     * @param {number} limit
     * @param {number} page
     * @return {Promise<Array<Device>>}
     */
    allDevices(accountId, limit, page) {
        const dal = new DevicesDal(this.services.database());

        return dal.all(accountId, limit, page)
            .catch((error) => {
                this.services.logging().error("Error getting account artists", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }

    /**
     * Upsert device
     * @param {number} accountId
     * @param {string} deviceName
     * @param {boolean} isProvider
     * @return {Promise<Device>}
     */
    upsertDevice(accountId, deviceName, isProvider) {
        const deviceValidator = new Validators(deviceName, 'name');
        deviceValidator.minLength(1).maxLength(100);

        const devicesDal = new DevicesDal(this.services.database());

        return devicesDal
            .getOrInsertDevice(deviceName, accountId)
            .then((device) => {
                if (isProvider) {
                    const songProvidersDal = new SongProvidersDal(this.services.database());
                    songProvidersDal
                        .insertDeviceAsProvider(accountId, device)
                        .catch((error) => {
                            this.services.logging().error("Error inserting provider", error);
                        });
                }
                return device;
            })
            .catch((error) => {
                this.services.logging().error("Error inserting device", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }

    /**
     * Update device
     * @param {number} deviceId
     * @param {boolean} isPlaying
     * @param {boolean} isOnline
     * @param {number} accountId
     * @return {Promise<boolean>}
     */
    updateDeviceState(accountId, deviceId, isOnline, isPlaying) {

        const dal = new DevicesDal(this.services.database());

        return dal
            .updateDevice(deviceId, isOnline, isPlaying, accountId)
            .catch((error) => {
                this.services.logging().error("Error inserting device", error);

                return Promise.reject(new RuntimeError("Unexpected service error"));
            });
    }

    /**
     * Update Acknowledge
     * @param {number} accountId
     * @param {number} commandId
     * @return {Promise<boolean>}
     */
    commandAcknowledge(accountId, commandId) {

        const devicesDal = new DevicesDal(this.services.database());

        return devicesDal
            .getDeviceContainingCommand(commandId, accountId)
            .then((devices) => {
                if (Array.isArray(devices) && devices.length === 1) {
                    const dal = new DeviceCommandsDal(this.services.database());
                    return dal
                        .markCommandAsAcknowledged(commandId)
                        .catch((error) => {
                            this.services.logging().error("Error updating command acknowledged", error);

                            return Promise.reject(new RuntimeError("Unexpected service error"));
                        });
                } else {
                    return Promise.reject(new RuntimeError("Forbidden"));
                }
            });
    }


}

module.exports = {DevicesController};
