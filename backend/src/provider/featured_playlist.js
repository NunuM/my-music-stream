const iconv = require('iconv');
const HTMLParser = require('node-html-parser');

const cache = require('../utils/cache');

const ONE_DAY = 86400000;

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36";

/**
 * @enum
 * @readonly
 */
const PLAYLISTS = {
    BRASIL: 'topbrasil',
    PORTUGUESE: 'topportuguese',
    SPANISH: 'topspanish',
    FRENCH: 'topfrench'
}

class FeaturedPlaylist {

    /**
     *
     * @param id
     * @return {(function(*): Promise<FeaturedPlaylist>)|*}
     */
    static byId(id) {
        switch (id) {
            case PLAYLISTS.FRENCH:
                return FeaturedPlaylist.frenchPlaylist;
            case PLAYLISTS.SPANISH:
                return FeaturedPlaylist.spanishPlaylist;
            case PLAYLISTS.BRASIL:
                return FeaturedPlaylist.brasilPlaylist;
            case PLAYLISTS.PORTUGUESE:
                return FeaturedPlaylist.portuguesePlaylist;
        }

        return FeaturedPlaylist.portuguesePlaylist;
    }


    /**
     *
     * @param httpClient
     * @return {Promise<FeaturedPlaylist>}
     */
    static brasilPlaylist(httpClient) {

        const entry = cache.getEntry(PLAYLISTS.BRASIL);

        if (entry) {
            return Promise.resolve(entry);
        }

        return httpClient
            .get('https://maistocadas.mus.br/musicas-mais-tocadas/', {
                headers: {
                    'User-Agent': USER_AGENT
                }
            })
            .then((response) => {

                const root = HTMLParser.parse(response.body);

                const items = [];
                const songs = root.querySelectorAll('.musicas');
                const artists = root.querySelectorAll('.artista');

                for (let i = 0; i < songs.length; i++) {
                    items.push({
                        songName: songs[i].textContent.replace('\n', '').trim(),
                        artistName: artists[i].textContent.replace('\n', '').trim()
                    })
                }

                return {
                    id: PLAYLISTS.BRASIL,
                    name: 'Top Brasil',
                    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/275px-Flag_of_Brazil.svg.png',
                    songs: items
                }
            })
            .then((result) => {

                cache.setEntry(PLAYLISTS.BRASIL, result, ONE_DAY);

                return result;
            });
    }

    /**
     *
     * @param httpClient
     * @return {Promise<FeaturedPlaylist>}
     */
    static portuguesePlaylist(httpClient) {
        const entry = cache.getEntry(PLAYLISTS.PORTUGUESE);

        if (entry) {
            return Promise.resolve(entry);
        }

        return httpClient
            .get('https://radiocomercial.iol.pt/programas/tnt-todos-no-top',
                {
                    encoding: null,
                    headers: {
                        'User-Agent': USER_AGENT
                    }
                }
            )
            .then((response) => {

                const ic = new iconv.Iconv('iso-8859-1', 'UTF-8');
                const buf = ic.convert(new Buffer(response.body, 'binary'));

                const body = buf.toString('utf-8');

                const root = HTMLParser.parse(body);

                const cards = root.querySelectorAll(".inside");

                const songs = cards.map((c) => {
                    const songName = c.querySelector(".songTitle").textContent.replace('\n', '').trim();
                    const artistName = c.querySelector(".songArtist").textContent.replace('\n', '').trim();

                    return {
                        songName,
                        artistName
                    }
                });


                return {
                    id: PLAYLISTS.PORTUGUESE,
                    name: 'Top Portuguese',
                    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Portugal.svg/260px-Flag_of_Portugal.svg.png',
                    songs: songs
                }
            })
            .then((result) => {
                cache.setEntry(PLAYLISTS.PORTUGUESE, result, ONE_DAY);
                return result;
            });
    }

    /**
     *
     * @param httpClient
     * @return {Promise<FeaturedPlaylist>}
     */
    static spanishPlaylist(httpClient) {
        const entry = cache.getEntry(PLAYLISTS.SPANISH);

        if (entry) {
            return Promise.resolve(entry);
        }

        return httpClient
            .get('https://www.hitfm.es/hit-30/', {
                headers: {
                    'User-Agent': USER_AGENT
                }
            })
            .then((response) => {

                const root = HTMLParser.parse(response.body);

                const cards = root.querySelectorAll(".cancion");

                const songs = cards.map((card) => {
                    const title = card.querySelector(".entry-title").textContent.replace("\n", '').trim();
                    const content = card.querySelector(".entry-content h3").textContent.replace('\n', '').trim();

                    return {
                        artistName: content,
                        songName: title
                    }
                });

                return {
                    id: PLAYLISTS.SPANISH,
                    name: 'Top Spanish',
                    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Bandera_de_Espa%C3%B1a.svg/200px-Bandera_de_Espa%C3%B1a.svg.png',
                    songs: songs
                };
            })
            .then((result) => {
                cache.setEntry(PLAYLISTS.SPANISH, result, ONE_DAY);
                return result;
            });
    }

    /**
     *
     * @param httpClient
     * @return {Promise<FeaturedPlaylist>}
     */
    static frenchPlaylist(httpClient) {

        const entry = cache.getEntry(PLAYLISTS.FRENCH);

        if (entry) {
            return Promise.resolve(entry);
        }

        return httpClient
            .get('https://www.nrj.fr/playlists/vos-hits-nrj', {
                headers: {
                    'User-Agent': USER_AGENT
                }
            })
            .then((response) => {

                const root = HTMLParser.parse(response.body);

                const meta = root.querySelector("script[type=\"application/ld+json\"]");

                const playlist = JSON.parse(meta.textContent);

                return {
                    id: 'topfrench',
                    name: 'Top French',
                    avatar: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/250px-Flag_of_France.svg.png',
                    songs: playlist[1].track.map((s) => {
                        return {
                            id: PLAYLISTS.FRENCH,
                            songName: s.name,
                            artistName: s.byArtist
                        }
                    })
                };
            })
            .then((result) => {
                cache.setEntry(PLAYLISTS.FRENCH, result, ONE_DAY);
                return result;
            });
    }
}

module.exports = {FeaturedPlaylist};
