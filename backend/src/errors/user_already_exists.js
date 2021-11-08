const {locatedError} = require('graphql/error');

const {RuntimeError} = require('./runtime');

class UserAlreadyExistsError extends RuntimeError {
    toGraphQLError() {
        return locatedError(this, undefined, ['email']);
    }
}

module.exports = {UserAlreadyExistsError};
