const graphql = require('graphql');

const {YoutubeSearch} = require("../service/youtube");
const types = require('./types');

const {RuntimeError} = require('../errors/runtime');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const {
    ArtistType,
    RadioType,
    SongType,
    SongSourceType,
    PlaylistType,
    DeviceType,
    DeviceCommands,
    FeaturedPlaylistType,
    ProviderSearchResultType,
    ProviderType,
    GenreType,
    AuthType
} = types;

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: () => ({
        artists: {
            type: new GraphQLList(ArtistType),
            args: {
                limit: {type: GraphQLInt},
                page: {type: GraphQLInt},
                genre: {type: GraphQLInt},
                name: {type: GraphQLString},
                id: {type: GraphQLInt},
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        let promise;

                        if (args.id) {
                            promise = ctx
                                .controllers()
                                .artists()
                                .artistsById(account.id, args.id);
                        } else if (args.name) {
                            promise = ctx
                                .controllers()
                                .artists()
                                .allArtistsByName(account.id, args.name, args.limit, args.page);
                        } else {
                            promise = ctx
                                .controllers()
                                .artists()
                                .allArtists(account.id, args.limit, args.page);
                        }
                        return promise
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        devices: {
            type: new GraphQLList(DeviceType),
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
                            .devices()
                            .allDevices(account.id, args.limit, args.page)
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        commands: {
            type: new GraphQLList(DeviceCommands),
            args: {
                since: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .deviceCommands()
                            .getCommandsSince(args.since, account.id)
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        featuredPlaylists: {
            type: new GraphQLList(FeaturedPlaylistType),
            args: {
                id: {type: GraphQLString}
            },
            resolve(parent, args, ctx) {
                let promise;
                if (args.id) {
                    promise = ctx
                        .controllers()
                        .playlists()
                        .featuredPlaylistById(args.id);
                } else {
                    promise = ctx
                        .controllers()
                        .playlists()
                        .featuredPlaylists();
                }

                return promise
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        playlists: {
            type: new GraphQLList(PlaylistType),
            args: {
                limit: {type: GraphQLInt},
                page: {type: GraphQLInt},
                name: {type: GraphQLString},
                id: {type: GraphQLInt},
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        let promise;

                        if (args.id) {
                            promise = ctx
                                .controllers()
                                .playlists()
                                .playlistById(account.id, args.id);
                        } else if (args.name) {
                            promise = ctx
                                .controllers()
                                .playlists()
                                .playlistsByName(account.id, args.name, args.limit, args.page);
                        } else {
                            promise = ctx
                                .controllers()
                                .playlists()
                                .allPlaylists(account.id, args.limit, args.page);
                        }
                        return promise
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        radios: {
            type: new GraphQLList(RadioType),
            args: {
                limit: {type: GraphQLInt},
                page: {type: GraphQLInt}
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .radios()
                            .allRadios(account.id, args.limit, args.page);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        genres: {
            type: new GraphQLList(GenreType),
            args: {
                limit: {type: GraphQLInt},
                page: {type: GraphQLInt},
                genreId: {type: GraphQLInt}
            }, resolve(parent, args, ctx) {
                return ctx
                    .controllers()
                    .genres()
                    .allGenre(args.limit, args.page)
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        songSources: {
            type: new GraphQLList(SongSourceType),
            args: {
                songId: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .songs()
                            .allSongSources(account.id, args.songId);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        playlistSearch: {
            type: new GraphQLList(ProviderSearchResultType),
            args: {
                artistName: {type: GraphQLString}
            },
            resolve(parent, args, ctx) {
                return ctx
                    .songProviders()
                    .searchPlaylist(args.artistName);
            }
        },
        organicSearch: {
            type: new GraphQLList(ProviderSearchResultType),
            args: {
                q: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args, ctx) {
                return ctx
                    .songProviders()
                    .organicSearch(args.q);
            }
        },
        recentSongs: {
            type: new GraphQLList(SongType),
            args: {
                limit: {type: GraphQLInt},
                page: {type: GraphQLInt}
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {

                        return ctx
                            .controllers()
                            .songs()
                            .allSongs(account.id, args.limit, args.page);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        searchSongs: {
            type: new GraphQLList(SongType),
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                limit: {type: GraphQLInt},
                page: {type: GraphQLInt}
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {

                        return ctx
                            .controllers()
                            .songs()
                            .searchSongsByName(account.id, args.name, args.limit, args.page);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        providers: {
            type: new GraphQLList(ProviderType),
            args: {
                limit: {type: GraphQLInt},
                page: {type: GraphQLInt}
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .songs()
                            .songProviders(account.id, args.limit, args.page);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        songProviderStream: {
            type: SongSourceType,
            args: {
                id: {type: GraphQLInt},
                source_id: {type: GraphQLString},
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .songs()
                            .resolveSourceById(account.id, args.id, args.source_id);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        login: {
            type: AuthType,
            args: {
                email: {type: new GraphQLNonNull(GraphQLString)},
                password: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args, ctx) {
                return ctx
                    .controllers()
                    .account()
                    .loginUser(args.email, args.password)
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        anonLogin: {
            type: AuthType,
            resolve(parent, args, ctx) {
                return ctx
                    .controllers()
                    .account()
                    .anonLogin()
            }
        }
    })
});

module.exports = RootQuery;
