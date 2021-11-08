const {RuntimeError} = require("./runtime");
const {locatedError} = require("graphql/error");

class AppTokenExpiredError extends RuntimeError {

    constructor(message) {
        super(message);
    }

    toGraphQLError() {
        return locatedError(this, undefined, ['token_validity']);
    }
}

module.exports = {AppTokenExpiredError};
