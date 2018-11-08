console.log('this is loaded');

exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};
exports.bandsInTown = {
    id: process.env.BIT_ID
};
exports.omdb = {
    id: process.env.OMDB_ID
};