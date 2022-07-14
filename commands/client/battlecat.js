const {MessageEmbed} = require("discord.js");
const axios = require("axios");

const rarities = {
    common: {
        name: "Common",
        modifier: 3,
        color: "WHITE",
    },
    uncommon: {
        name: "Uncommon",
        modifier: 5,
        color: "GRAY",
    },
    rare: {
        name: "Rare",
        modifier: 10,
        color: "GREEN",
    },
    ultra_rare: {
        name: "Ultra Rare",
        modifier: 15,
        color: "PURPLE",
    },
    legendary: {
        name: "Legendary",
        modifier: 20,
        color: "LUMINOUS_VIVID_PINK"
    },
}

const battlecat = {
    name: "",
    thumbnail: "",
    stats: {
        lvl: null,
        hp: null,
        atk: null,
        def: null,
        spd: null,
        rarity: null,
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

module.exports = {
    name: "battlecat",
    description: "Main battlecat command",
    aliases: ["bc"],
    utilization: `${client.config.settings.prefix}battlecat [battlecat command]`,
    slashCommand: true,
    options: [
        {
            name: "query",
            description: "Which battlecat command you want to use",
            type: "STRING",
            required: false,
        }
    ],

    execute(client, command, args) {
        if (args.length !== 0){
            const cmdName = args[0].toLowerCase();
            const cmd = client.battlecats.get(cmdName) || client.battlecats.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
            if(cmd) return cmd.execute(client, command, args.splice(1));
        } else {
            const cmd = client.battlecats.get("help");
            return cmd.execute(client, command, ["1"]);
        }
    },

    async spawncat(client, command) {
        let rarity;
        let i = getRandomInt(100);
        if (i < 60){
            rarity = rarities.common;
        } else if (i >= 50 && i < 75) {
            rarity = rarities.uncommon;
        } else if (i >= 75 && i < 90) {
            rarity = rarities.rare;
        } else if (i >= 90 && i < 99) {
            rarity = rarities.ultra_rare;
        } else {
            rarity = rarities.legendary;
        }

        const embed = new MessageEmbed();

        await axios.request(client.config.apis.thecatapi)
            .then((response) => response.data)
            .then((data) => {
                battlecat.thumbnail = data[0].url;
                embed.setImage(data[0].url);
            });

        await axios.request(client.config.apis.randomuser)
            .then((response) => response.data)
            .then((data) => {
                battlecat.name = data.results[0].name.first;
                embed.setTitle(`**${battlecat.name}** is verschenen!`);
            });

        battlecat.stats = {
            lvl: 1,
            hp: 5 + getRandomInt(rarity.modifier),
            atk: 1 + getRandomInt(rarity.modifier),
            def: 1 + getRandomInt(rarity.modifier),
            spd: 1 + getRandomInt(rarity.modifier),
            rarity: rarity.name,
        }

        embed.setColor(rarity.color);
        embed.setDescription(`Gebruik **!battlecat claim** *{naam}* om deze kat te vangen!`);
        embed.setFooter({text: `(Deze functionaliteit is nog work in progress)`});
        embed.setTimestamp();

        client.battlecats.current = battlecat;
        setTimeout(() => {
            if (client.battlecats.current !== null) {
                command.channel.send(`**${battlecat.name}** is verdwenen...`);
                client.battlecats.current = null;
            }
        }, 45000);

        return command.channel.send({embeds: [embed]});
    },
}