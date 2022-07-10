const sqlite3 = require("sqlite3");
const playerdb = new sqlite3.Database('./databases/player.db');

module.exports = {
    insert: async (title, url, requested_by, server) => {
        playerdb.run(`INSERT INTO player_stats(title, url, requested_by, server) VALUES(?, ?, ?, ?)`, [title, url, requested_by, server], (err) => {
            if (err && err.code) return console.log(err);
        })
    },

    getAll: async (callback) => {
        let data = [];
        playerdb.each(`SELECT * FROM player_stats`, (err, row) => {
            if (err && err.code) return console.log(err);
            data.push(row);
        }, function () {
            callback(data);
        })
    },

    getFromMediaType: async (mediatype, callback) => {
        let data = [];
        playerdb.each(`SELECT * FROM player_stats WHERE media_type = ${mediatype}`, (err, row) => {
            if (err && err.code) return console.log(err);
            data.push(row);
        }, function () {
            callback(data);
        })
    }, //TODO: Change this, mediatype is no longer being used.

    getAllCount: async (servername, callback) => {
        let data = [];
        playerdb.each(`SELECT COUNT(title) as count, title FROM player_stats WHERE server LIKE ? GROUP BY title`, [servername], (err, row) => {
            if (err && err.code) return console.log(err);
            data.push(row);
        }, function () {
            callback(data);
        })
    }
}