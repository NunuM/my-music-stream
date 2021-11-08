const {YoutubeSearch} = require('../service/youtube');
const {SongProvidersDal} = require("../dal/song_providers");

class MusicProvider {

    /**
     *
     * @param database
     * @param configs
     */
    constructor(database, configs) {
        this.providers = new Map([
            ['youtube', {
                id: 1,
                playlist: YoutubeSearch.playlistSearchResults,
                search: YoutubeSearch.videoSearchResults
            }]
        ]);
        this.database = database;
        this.configs = configs;
    }

    /**
     *
     * @param {number} id
     * @return {boolean}
     */
    isWellKnown(id) {
        return id === 1;
    }

    /**
     *
     * @param {SongSource} source
     * @param {number} accountId
     * @return {Promise<string>}
     */
    resolve(source, accountId) {
        if (source.provider_id === 1) {
            return YoutubeSearch.audioInfo(source.source_id);
        } else {
            const dal = new SongProvidersDal(this.database);

            return dal
                .getProviderById(accountId, source.provider_id)
                .then((someProvider) => {
                    const appConf = this.configs;
                    if (someProvider) {
                        return `${appConf.deviceProviderURL}${someProvider.name}?q=${source.source_id}&k=${appConf.apiKey}`;
                    }
                    return "";
                });
        }
    }

    /**
     * Get provider suggested playlist for a given artist
     * @param {string} artistName
     * @return {Promise<Array<SearchSongsProviderResult>>}
     */
    async searchPlaylist(artistName) {

        if (!(typeof artistName === 'string' && artistName.length > 0)) {
            return Promise.resolve([]);
        }

        const results = [];

        for (const [key, provider] of this.providers) {

            const result = await provider
                .playlist(artistName)
                .then((result) => {
                    return result.map((artist) => {
                        return {
                            id: provider.id,
                            name: key,
                            artist
                        }
                    });
                });

            results.push(...result)
        }

        return results;
    }

    /**
     * Get provider search results for a given artists
     * @param {string} artistName
     * @return {Promise<Array<SearchSongsProviderResult>>}
     */
    async organicSearch(artistName) {

        if (!(typeof artistName === 'string' && artistName.length > 0)) {
            return Promise.resolve([]);
        }

        const results = [];

        for (const [key, provider] of this.providers) {

            const result = await (provider
                .search(artistName)
                .then((result) => {
                    return result.map((artist) => {
                        return {
                            id: provider.id,
                            name: key,
                            artist
                        }
                    });
                }));

            results.push(...result);
        }

        return results;
    }
}

module.exports = {MusicProvider};
