const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {AppTokenExpiredError} = require("../errors/app_token_expired");
const {RuntimeError} = require("../errors/runtime");

const SALT_ROUNDS = 10;

class AccountUtils {

    /**
     * Issue a token
     * @param {AppConfig} config
     * @param {TokenData} data
     * @param {number} [expires=1day] in seconds
     * @return {Promise<AuthToken>}
     */
    static createToken(config, data, expires) {
        expires = expires || Math.floor(Date.now() / 1000) + 86400;

        return new Promise((resolve, reject) => {
            jwt.sign({
                exp: expires,
                data
            }, config.jwtSecrete, (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        scheme: 'bearer',
                        token,
                        expires
                    });
                }
            });
        });
    }

    /**
     * Decode Token
     * @param {AppConfig} config
     * @param {string} bearer
     * @return {Promise<TokenData>}
     */
    static decodeToken(config, bearer) {
        return new Promise((resolve, reject) => {
            const groups = bearer.match(/^Bearer\s+(\S+)/);

            if (!groups || groups.length !== 2) {
                reject(new Error("Authorization header not provided"));
                return;
            }

            jwt.verify(groups[1], config.jwtSecrete, (err, decoded) => {
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        reject(new AppTokenExpiredError("Login required"));
                    } else {
                        reject(new RuntimeError(err.message));
                    }
                } else {
                    resolve(decoded.data);
                }
            });
        });
    }

    /**
     * Hash password using sal auto generated
     * @param {string} plainTextPassword
     * @return {Promise<string>}
     */
    static hashPassword(plainTextPassword = '') {
        return new Promise((resolve, reject) => {
            bcrypt.hash(plainTextPassword, SALT_ROUNDS, function (err, result) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
            });
        });
    }

    /**
     * Compare stored hash with plain text
     * @param {string} hashedPassword
     * @param {string} plainTextPassword
     * @return {Promise<boolean>}
     */
    static comparePassword(hashedPassword = '', plainTextPassword = '') {
        return new Promise((resolve, reject) => {
            bcrypt.compare(plainTextPassword, hashedPassword, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }
}

module.exports = {AccountUtils}
