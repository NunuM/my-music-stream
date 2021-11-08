const graphql = require('graphql');
const {RuntimeError} = require("../errors/runtime");

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull
} = graphql;


const AuthType = new GraphQLObjectType({
    name: "Auth",
    fields: () => ({
        scheme: {type: GraphQLString},
        token: {type: GraphQLString},
        expires: {type: GraphQLString}
    })
});

const AccountType = new GraphQLObjectType({
    name: "Account",
    fields: () => ({
        id: {type: GraphQLID},
        email: {type: GraphQLString},
        created: {type: GraphQLString}
    })
});

const DeviceType = new GraphQLObjectType({
    name: "Device",
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        is_online: {type: GraphQLBoolean},
        is_playing: {type: GraphQLBoolean},
        created: {type: GraphQLString}
    })
});

const DeviceCommands = new GraphQLObjectType({
    name: "DeviceCommands",
    fields: () => ({
        id: {type: GraphQLID},
        command: {type: GraphQLString},
        target_id: {type: GraphQLInt},
        acknowledged: {type: GraphQLBoolean},
        created: {type: GraphQLString}
    })
});

const RadioType = new GraphQLObjectType({
    name: "Radio",
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        avatar: {type: GraphQLString},
        stream_url: {type: GraphQLString},
        created: {type: GraphQLString}
    })
});


const FeaturedPlaylistType = new GraphQLObjectType({
    name: "FeaturedPlaylist",
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        avatar: {type: GraphQLString},
        songs: {type: new GraphQLList(FeaturedPlaylistItemType)}
    })
});

const FeaturedPlaylistItemType = new GraphQLObjectType({
    name: "FeaturedPlaylistItem",
    fields: () => ({
        songName: {type: GraphQLString},
        artistName: {type: GraphQLString},
    })
});

const PlaylistItem = new GraphQLObjectType({
    name: "PlaylistItem",
    fields: () => ({
        id: {type: GraphQLID},
        song_id: {type: GraphQLInt},
        radio_id: {type: GraphQLInt},
        created: {type: GraphQLString},
        song: {type: SongType},
        radio: {type: RadioType},
    })
});


const PlaylistType = new GraphQLObjectType({
    name: "Playlist",
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        played: {type: GraphQLInt},
        avatar: {type: GraphQLString},
        created: {type: GraphQLString},
        items: {
            type: new GraphQLList(PlaylistItem),
            args: {
                limit: {type: GraphQLInt},
                page: {type: GraphQLInt}
            },
            resolve(parent, args, ctx) {
                return ctx
                    .controllers()
                    .playlists()
                    .safePlaylistItems(parent.id, args.limit, args.page)
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        }
    })
});


const ArtistType = new GraphQLObjectType({
    name: "Artist",
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        avatar: {type: GraphQLString},
        created: {type: GraphQLString},
        songs: {
            type: new GraphQLList(SongType),
            args: {
                limit: {type: GraphQLInt},
                page: {type: GraphQLInt}
            },
            resolve(parent, args, cxt) {
                return cxt
                    .controllers()
                    .songs()
                    .artistSongs(parent.id, args.limit, args.page)
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        }
    })
});

const SongSourceType = new GraphQLObjectType({
    name: 'SongSource',
    fields: () => ({
        song_id: {type: GraphQLID},
        source_id: {type: GraphQLID},
        source_uri: {type: GraphQLString},
        provider_id: {type: GraphQLID}
    })
});

const SongType = new GraphQLObjectType({
    name: "Song",
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        duration: {type: GraphQLInt},
        played: {type: GraphQLInt},
        created: {type: GraphQLString},
        sources: {
            type: new GraphQLList(SongSourceType),
            resolve(parent, args, ctx) {
                return ctx
                    .controllers()
                    .songs()
                    .safeSongSources(parent.id)
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        artist: {
            type: ArtistType,
            resolve(parent, args, ctx) {
                if (parent.id) {
                    return ctx
                        .controllers()
                        .artists()
                        .safeArtistBySongId(parent.id)
                        .catch((e) => {
                            if (e instanceof RuntimeError) {
                                return Promise.reject(e.toGraphQLError());
                            }
                            return Promise.reject(e);
                        });
                } else {
                    return Promise.resolve(null);
                }
            }
        }
    })
});


const GenreType = new GraphQLObjectType({
    name: "genre",
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        songs: {
            type: new GraphQLList(SongType),
            args: {
                limit: {type: GraphQLInt},
                page: {type: GraphQLInt},
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .songs()
                            .songsByGenre(account.id, parent.id, args.limit, args.page)
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        }
    })
});


const SongSearchType = new GraphQLObjectType({
    name: "SongSearch",
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        avatar: {type: GraphQLString},
    })
});

const ArtistSearchType = new GraphQLObjectType({
    name: "ArtistSearch",
    fields: () => ({
        name: {type: GraphQLString},
        avatar: {type: GraphQLString},
        songs: {type: new GraphQLList(SongSearchType)}
    })
});

const ProviderSearchResultType = new GraphQLObjectType({
    name: "ProviderSearchResult",
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        artist: {type: ArtistSearchType}
    })
});

const ProviderType = new GraphQLObjectType({
    name: "Provider",
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        type: {type: GraphQLInt},
        created: {type: GraphQLString}
    })
});

module.exports = {
    AuthType,
    AccountType,
    DeviceType,
    DeviceCommands,
    PlaylistType,
    PlaylistItem,
    ArtistType,
    ArtistSearchType,
    SongType,
    SongSearchType,
    SongSourceType,
    GenreType,
    RadioType,
    ProviderSearchResultType,
    ProviderType,
    FeaturedPlaylistItemType,
    FeaturedPlaylistType
}
