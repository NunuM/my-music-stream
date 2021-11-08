const {locatedError} = require('graphql/error');

const {RuntimeError} = require('./runtime');

class InvalidArgumentError extends RuntimeError {

    constructor(message, argument) {
        super(message);
        this.argumentName = argument;
    }

    toGraphQLError() {
        return locatedError(this, undefined, [this.argumentName]);
    }
}

module.exports = {InvalidArgumentError};
