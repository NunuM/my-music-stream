const graphql = require('graphql');
const {RuntimeError} = require('../errors/runtime');

const types = require('./types');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLNonNull
} = graphql;

const {
    ArtistType,
    RadioType,
    SongType,
    PlaylistType,
    DeviceType,
    AuthType,
    AccountType
} = types;

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: () => ({
        addArtist: {
            type: ArtistType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                avatar: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .artists()
                            .newArtist(account.id, args.name, args.avatar);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        updateArtist: {
            type: GraphQLBoolean,
            args: {
                artistId: {type: new GraphQLNonNull(GraphQLInt)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                avatar: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .artists()
                            .updateArtist(account.id, args.artistId, args.name, args.avatar);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        deleteArtist: {
            type: GraphQLBoolean,
            args: {
                artistId: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .artists()
                            .removeArtist(account.id, args.artistId);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        addRadio: {
            type: RadioType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                stream: {type: new GraphQLNonNull(GraphQLString)},
                avatar: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .radios()
                            .newRadio(account.id, args.name, args.stream, args.avatar);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        updateRadio: {
            type: GraphQLBoolean,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                stream: {type: new GraphQLNonNull(GraphQLString)},
                avatar: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .radios()
                            .updateRadio(account.id, args.id, args.name, args.stream, args.avatar);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        deleteRadio: {
            type: GraphQLBoolean,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .radios()
                            .deleteRadio(account.id, args.id);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        addSong: {
            type: SongType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                artistId: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .songs()
                            .newSong(account.id, args.artistId, args.name);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        editSong: {
            type: GraphQLBoolean,
            args: {
                songId: {type: new GraphQLNonNull(GraphQLInt)},
                name: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .songs()
                            .updateSong(account.id, args.songId, args.name);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        deleteSong: {
            type: GraphQLBoolean,
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
                            .deleteSong(account.id, args.songId);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        addSongSource: {
            type: GraphQLBoolean,
            args: {
                providerId: {type: new GraphQLNonNull(GraphQLInt)},
                songId: {type: new GraphQLNonNull(GraphQLInt)},
                sourceId: {type: GraphQLString},
                sourceUri: {type: GraphQLString},
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .songs()
                            .insertSongSource(account.id, args.providerId, args.songId, args.sourceId, args.sourceUri);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        musicPlayed: {
            type: GraphQLBoolean,
            args: {
                songId: {type: new GraphQLNonNull(GraphQLInt)},
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .songs()
                            .incrementPlayedSong(account.id, args.songId);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        addPlaylist: {
            type: PlaylistType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                avatar: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .playlists()
                            .newPlaylist(account.id, args.name, args.avatar);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        editPlaylist: {
            type: GraphQLBoolean,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                avatar: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .playlists()
                            .updatePlaylist(account.id, args.id, args.name, args.avatar);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        deletePlaylist: {
            type: GraphQLBoolean,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .playlists()
                            .deletePlaylist(account.id, args.id);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        removeItemFromPlaylist: {
            type: GraphQLBoolean,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .playlists()
                            .removeFromPlaylist(account.id, args.id);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        savePlaylistSong: {
            type: GraphQLBoolean,
            args: {
                playlistId: {type: GraphQLNonNull(GraphQLInt)},
                songId: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .playlists()
                            .insertPlaylistSong(account.id, args.playlistId, args.songId);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        createOrGetDevice: {
            type: DeviceType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                provider: {type: GraphQLBoolean}
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .devices()
                            .upsertDevice(account.id, args.name, args.provider);
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        updateDeviceState: {
            type: GraphQLBoolean,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
                is_online: {type: new GraphQLNonNull(GraphQLBoolean)},
                is_playing: {type: new GraphQLNonNull(GraphQLBoolean)}
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .devices()
                            .updateDeviceState(account.id, args.id, args.is_online, args.is_playing)
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        acknowledgeCommand: {
            type: GraphQLBoolean,
            args: {
                commandId: {type: GraphQLInt},
            },
            resolve(parent, args, ctx) {
                return ctx
                    .accountInfo()
                    .then((account) => {
                        return ctx
                            .controllers()
                            .devices()
                            .commandAcknowledge(account.id, args.commandId)
                    })
                    .catch((e) => {
                        if (e instanceof RuntimeError) {
                            return Promise.reject(e.toGraphQLError());
                        }
                        return Promise.reject(e);
                    });
            }
        },
        registerAccount: {
            type: AccountType,
            args: {
                email: {type: new GraphQLNonNull(GraphQLString)},
                password: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args, ctx) {
                return ctx
                    .controllers()
                    .account()
                    .registerUser(args.email, args.password)
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


module.exports = Mutation;
