const sqlite3 = require("sqlite3");
const playerdb = new sqlite3.Database('./databases/player.db');
function callback(row){
    return row;
}

module.exports = {
    insert: async (url, mediatype) => {
        playerdb.run(`INSERT INTO player_stats(url, media_type) VALUES(?, ?)`, [url, mediatype], (err) => {
            if (err) console.log(err);
        })
    },

    select: async () => {
        let test;
        await playerdb.all(`SELECT * FROM player_stats`, (err, row) => {
            if (err && err.code) {
                // console.log(err);
            }
            console.log(row);
        })
    }
}