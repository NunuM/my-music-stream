const {AccountUtils} = require('../utils/account')
const {UsersDal} = require('../dal/users')
const {Validators} = require('../utils/validators');

const {RuntimeError} = require('../errors/runtime');
const {UserAlreadyExistsError} = require('../errors/user_already_exists');

class AccountController {
    /**
     * @constructor
     * @param {ServiceRegistry} services
     */
    constructor(services) {
        this.services = services;
    }

    /**
     * Login
     * @param {string} email
     * @param {string} password
     * @return {Promise<AuthToken>}
     * @throws InvalidArgumentError on invalid arguments
     * @throws RuntimeError on some unexpected error
     */
    async loginUser(email, password) {
        let user;

        Validators.validateEmailAndPassword(email, password);

        const dal = new UsersDal(this.services.database());

        try {
            user = await dal.getUserByEmail(email);
        } catch (e) {
            this.services.logging().error("Error getting authorization by email", e);

            throw new RuntimeError("Database service error");
        }

        if (user) {
            let same = false;
            try {
                same = await AccountUtils.comparePassword(user.password, password);
            } catch (e) {
                this.services.logging().error("Error comparing authorization password", e);

                throw new RuntimeError("Unexpected service error");
            }

            if (same) {
                try {
                    return await AccountUtils.createToken(this.services.config(), {id: user.id});
                } catch (e) {
                    this.services.logging().error("Error signing token", e);

                    throw new RuntimeError("Unexpected service error");
                }
            }
        }

        throw new RuntimeError("Email or password do not match");
    }

    /**
     * Create account
     * @param {string} email
     * @param {string} password
     * @return {Promise<User>}
     * @throws InvalidArgumentError on invalid arguments
     * @throws UserAlreadyExistsError when emails are duplicated
     * @throws RuntimeError on some unexpected error
     */
    async registerUser(email, password) {
        let hashedPassword;

        Validators.validateEmailAndPassword(email, password);

        const dal = new UsersDal(this.services.database());

        try {
            hashedPassword = await AccountUtils.hashPassword(password);
        } catch (e) {
            this.services.logging().error("Error creating hashed password", e);
            throw new RuntimeError("Unexpected service error");
        }

        try {
            return await dal.insertNewAccount(email, hashedPassword)
        } catch (e) {
            if (e.message && e.message.includes("Duplicate")) {
                throw new UserAlreadyExistsError("Account already exists");
            } else {
                this.services.logging().error("Error saving authorization", e);

                throw new RuntimeError("Unexpected database service error");
            }
        }
    }

    /**
     * Anon login
     * @return {Promise<AuthToken>}
     */
    anonLogin() {
        const configs = this.services.config();
        return AccountUtils.createToken(configs, {id: configs.defaultAccountId, region: 'se_pt'});
    }

}

module.exports = {AccountController};
