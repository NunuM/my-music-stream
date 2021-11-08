const {locatedError} = require('graphql/error');

class RuntimeError extends Error {

    constructor(message) {
        super(message);
    }

    toGraphQLError() {
        return locatedError(this, undefined, ['server']);
    }

}

module.exports = {RuntimeError};

