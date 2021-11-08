/**
 * User type definition
 * @typedef {Object} User
 * @property {number} id
 * @property {string} email
 * @property {string} password
 * @property {Date} created
 */

/**
 * Artist type definition
 * @typedef {Object} Artist
 * @property {number} id
 * @property {string} name
 * @property {string} avatar
 * @property {Date} created
 */

/**
 * Song type definition
 * @typedef {Object} Song
 * @property {number} id
 * @property {string} name
 * @property {number} played
 * @property {number} duration
 * @property {Date} created
 */

/**
 * SongSource type definition
 * @typedef {Object} SongSource
 * @property {number} song_id
 * @property {number} source_id
 * @property {string} source_uri
 * @property {number} provider_id
 * @property {Date} created
 */

/**
 * Genre type definition
 * @typedef {Object} Genre
 * @property {number} id
 * @property {string} name
 */

/**
 * Playlist type definition
 * @typedef {Object} Playlist
 * @property {number} id
 * @property {string} name
 * @property {string} avatar
 * @property {number} played
 * @property {Date} created
 */

/**
 * Playlist Item type definition
 * @typedef {Object} PlaylistItem
 * @property {number} id
 * @property {number} radio_id
 * @property {number} song_id
 * @property {number} played
 * @property {number} playlist_id
 * @property {Date} created
 */


/**
 * Featured Playlist type definition
 * @typedef {Object} FeaturedPlaylist
 * @property {number} id
 * @property {string} name
 * @property {string} avatar
 * @property {Array<>} songs
 */


/**
 * Radio type definition
 * @typedef {Object} Radio
 * @property {number} id
 * @property {string} name
 * @property {string} avatar
 * @property {string} stream_url
 * @property {Date} created
 */

/**
 * Device type definition
 * @typedef {Object} Device
 * @property {number} id
 * @property {string} name
 * @property {boolean} is_online
 * @property {Date} created
 */

/**
 * DeviceCommands type definition
 * @typedef {Object} DeviceCommand
 * @property {number} id
 * @property {string} command
 * @property {boolean} acknowledged
 * @property {Date} created
 */

/**
 * Song provider type definition
 * @typedef {Object} SongProvider
 * @property {number} id
 * @property {string} name
 * @property {number} type
 * @property {Date} created
 */

/**
 * JWT Token type definition
 * @typedef {Object} AuthToken
 * @property {string} scheme
 * @property {string} token
 * @property {number} expires
 */

/**
 * App Configs type definition
 * @typedef {Object} AppConfig
 * @property {string} jwtSecrete
 * @property {string} defaultAccountId
 * @property {string} deviceProviderURL
 * @property {string} apiKey
 */


/**
 * TokenData type definition
 * @typedef {Object} TokenData
 * @property {number} id
 * @property {string} region
 */


/**
 * SearchSongsProviderResult type definition
 * @typedef {Object} SearchSongsProviderResult
 * @property {number} id
 * @property {string} name
 * @property {string} artist
 */

/**
 * SearchSongsProviderArtistResult type definition
 * @typedef {Object} SearchSongsProviderArtistResult
 * @property {string} name
 * @property { SearchSongsProviderSongsResult} songs
 */

/**
 * SearchSongsProviderSongsResult type definition
 * @typedef {Object} SearchSongsProviderSongsResult
 * @property {string} name
 * @property {string} id
 * @property {string} avatar
 */
