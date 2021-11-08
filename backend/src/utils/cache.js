const MAX_ENTRIES = 1000;

class Cache {

    constructor() {
        this.data = new Map();
    }

    /**
     * Set entry
     * @param {string} key
     * @param {any} value
     * @param {number|null} ttl
     */
    setEntry(key, value, ttl = null) {
        this.data.set(key, new CacheEntry(value, ttl));

        if (this.data.size > MAX_ENTRIES) {
            process.nextTick(() => {
                const it = this.data.keys();

                for (let j = 0; j < 100; j++) {
                    const k = it.next().value;
                    this.data.delete(k);
                }
            });
        }
    }

    /**
     * Retrieve entry
     * @param {string} key
     * @return {null|any}
     */
    getEntry(key) {
        if (this.data.has(key)) {
            const value = this.data.get(key).value();

            if (!value) {
                return this.data.delete(key);
            }
            return value;
        }
        return null;
    }

}

class CacheEntry {
    constructor(value, ttl) {
        this._value = value;
        if (ttl) {
            this._ttl = new Date().getTime() + ttl;
        } else {
            this._ttl = null;
        }
        this._access = 0;
    }

    value() {
        if (this.inTimeToLive()) {
            this._access += 1;
            return this._value
        } else {
            return null;
        }
    }

    inTimeToLive() {
        if (this._ttl === null) {
            return true;
        }
        const now = new Date().getTime();
        return this._ttl >= now;
    }
}

const appCache = new Cache();

module.exports = appCache;
