const axios = require("axios");

module.exports = {
    capitalizeFirstLetter: (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    getRandomInt: (max) => {
        return Math.floor(Math.random() * max);
    },

    getRandomBattlecat: async (rarity) => {
        const getRandomInt = max => {
            return Math.floor(Math.random() * max);
        }

        const battlecat = {
            name: "",
            thumbnail: "",
            stats: {
            }
        }

        await axios.request(client.config.apis.thecatapi)
            .then((response) => response.data)
            .then((data) => {
                battlecat.thumbnail = data[0].url;
            });

        await axios.request(client.config.apis.randomuser)
            .then((response) => response.data)
            .then((data) => {
                battlecat.name = Math.random() > 0.5 ? battlecat.name = data.results[0].name.first : `${data.results[0].name.first} ${data.results[1].name.last}`;
            });

        battlecat.stats = {
            lvl: 1,
            hp: 5 + getRandomInt(rarity.modifier),
            atk: 1 + getRandomInt(rarity.modifier),
            def: 1 + getRandomInt(rarity.modifier),
            spd: 1 + Math.floor(getRandomInt(rarity.modifier) / 2),
            rarity: rarity.name,
        }

        return battlecat;
    },
}