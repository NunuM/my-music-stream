const {InvalidArgumentError} = require('../errors/invalid_argument');

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


class Validators {

    constructor(value, key) {
        this.value = value;
        this.key = key;
    }

    isString() {
        if (typeof this.value === 'string') {
            return this;
        }
        throw new InvalidArgumentError(this.key + " is not a string", this.key);
    }

    isEmail() {
        if (EMAIL_REGEX.test(this.value.toLowerCase())) {
            return this;
        }

        throw new InvalidArgumentError("Invalid email address", "email");
    }

    maxLength(max) {
        if (this.value.length < max) {
            return this;
        }
        throw new InvalidArgumentError(this.key + " exceeds " + max + ' maximum length', this.key);
    }

    minLength(min) {
        if (this.value.length >= min) {
            return this;
        }
        throw new InvalidArgumentError(this.key + " must have " + min + ' characters', this.key);
    }

    and(value, key) {
        return new Validators(value, key)
    }


    isValidURL() {
        try {
            new URL(this.value);
            return this;
        } catch (e) {
            throw new InvalidArgumentError(this.key + " is not a valid url");
        }
    }


    static validateEmailAndPassword(email, password) {
        return new Validators(email, 'email')
            .isString()
            .maxLength(100)
            .isEmail()
            .and(password, 'password')
            .isString()
            .minLength(5)
            .maxLength(100);
    }


    static validateAvatar(avatar) {
        return new Validators(avatar, 'avatar')
            .minLength(1)
            .maxLength(300)
            .isValidURL();
    }
}

module.exports = {Validators};
