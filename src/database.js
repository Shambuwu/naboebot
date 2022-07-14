const sqlite3 = require("sqlite3");
const playerdb = new sqlite3.Database("./databases/player.db");
const battlecatdb = new sqlite3.Database("./databases/battlecat.db");

playerdb.serialize(() => {
    playerdb.run("CREATE TABLE IF NOT EXISTS player_stats([id] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, [title] VARCHAR(255) NOT NULL, [url] VARCHAR(255) NOT NULL, [requested_by] VARCHAR(255) NOT NULL,[server] VARCHAR(255) NOT NULL, [time] TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
    battlecatdb.run("CREATE TABLE IF NOT EXISTS battlecats([id] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, [name] VARCHAR(255) NOT NULL, [thumbnail] VARCHAR(255) NOT NULL, [stats] VARCHAR(255) NOT NULL, [owner] VARCHAR(255) NOT NULL)");
})

module.exports = {
    insert: async (title, url, requested_by, server) => {
        playerdb.run(`INSERT INTO player_stats(title, url, requested_by, server) VALUES(?, ?, ?, ?)`, [title, url, requested_by, server], (err) => {
            if (err && err.code) return console.log(err);
        })
    },

    insertbc: async (name, thumbnail, stats, owner) => {
        battlecatdb.run(`INSERT INTO battlecats(name, thumbnail, stats, owner) VALUES(?, ?, ?, ?)`, [name, thumbnail, stats, owner], (err) => {
            if (err && err.code) return console.log(err);
        })
    },

    getbc: async (name, owner) => {

    },

    getAll: async (callback) => {
        let data = [];
        playerdb.each(`SELECT * FROM player_stats`, (err, row) => {
            if (err && err.code) return console.log(err);
            data.push(row);
        }, () => {
            callback(data);
        })
    },

    getFromMediaType: async (mediatype, callback) => {
        let data = [];
        playerdb.each(`SELECT * FROM player_stats WHERE media_type = ${mediatype}`, (err, row) => {
            if (err && err.code) return console.log(err);
            data.push(row);
        }, () => {
            callback(data);
        })
    }, //TODO: Change this, mediatype is no longer being used.

    getAllCount: async (servername, callback) => {
        let data = [];
        playerdb.each(`SELECT COUNT(title) as count, title FROM player_stats WHERE server LIKE ? GROUP BY title`, [servername], (err, row) => {
            if (err && err.code) return console.log(err);
            data.push(row);
        }, () => {
            callback(data);
        })
    }
}