const {MessageEmbed} = require("discord.js");
const axios = require("axios");

client.battlecats.rarities = {
    common: {
        name: "Common",
        modifier: 5,
        color: "WHITE",
    },
    uncommon: {
        name: "Uncommon",
        modifier: 10,
        color: "GREEN",
    },
    rare: {
        name: "Rare",
        modifier: 20,
        color: "BLUE",
    },
    super_rare: {
        name: "Super Rare",
        modifier: 30,
        color: "PURPLE",
    },
    legendary: {
        name: "Legendary",
        modifier: 40,
        color: "GOLD"
    },
    mythic: {
        name: "Mythic",
        modifier: 60,
        color: "LUMINOUS_VIVID_PINK",
    }
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

        if (args.length !== 0) {
            const cmdName = args[0].toLowerCase();
            const cmd = client.battlecats.get(cmdName) || client.battlecats.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

            function printResult(result) {
                console.log(`Executing command by ${command.author.username}#${command.author.discriminator} in ${command.guild.name}\n-> Command: ${cmd.name}\n-> Args: ${args.splice(1).join(" ")}\n-> Result: ${result ? "success" : "error"}`);
            }

            function sendError(err) {
                const embed = new MessageEmbed();
                embed.setTitle(`Error in ${command.guild.name}`);
                embed.addField(`Error`, err.toString());
                embed.addField(`Tijd`, (new Date()).toString())
                client.users.cache.get("236899263513231362").send({embeds: [embed]});
            }

            if (cmd) {
                try {
                    cmd.execute(client, command, args.splice(1));
                    printResult(true);
                } catch (err) {
                    printResult(false);
                    console.log(`-> Error: ${err}`);
                    sendError(err);
                }
            }
        } else {
            const cmd = client.battlecats.get("help");
            return cmd.execute(client, command, ["1"]);
        }
    },

    async spawncat(client, command) {
        clearTimeout(command.guild.currentTimeout);

        let rarity;
        let i = getRandomInt(1000);
        if (i < 500) {
            rarity = client.battlecats.rarities.common;
        } else if (i >= 500 && i < 800) {
            rarity = client.battlecats.rarities.uncommon;
        } else if (i >= 800 && i < 950) {
            rarity = client.battlecats.rarities.rare;
        } else if (i >= 950 && i < 990) {
            rarity = client.battlecats.rarities.super_rare;
        } else if ((i >= 990 && i < 999)) {
            rarity = client.battlecats.rarities.legendary;
        } else {
            rarity = client.battlecats.rarities.mythic;
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
                battlecat.name = Math.random() > 0.5 ? battlecat.name = data.results[0].name.first : `${data.results[0].name.first} ${data.results[1].name.last}`;
                embed.setTitle(`**${battlecat.name}** (${rarity.name.toLowerCase()}) is verschenen!`);
            });

        battlecat.stats = {
            lvl: 1,
            hp: 5 + getRandomInt(rarity.modifier),
            atk: 1 + getRandomInt(rarity.modifier),
            def: 1 + getRandomInt(rarity.modifier),
            spd: 1 + Math.floor(getRandomInt(rarity.modifier) / 2),
            rarity: rarity.name,
        }

        embed.setColor(rarity.color);
        embed.setDescription(`Gebruik **!battlecat claim** *naam* om deze kat te vangen!`);
        embed.setFooter({text: `(Deze functionaliteit is nog work in progress)`});
        embed.setTimestamp();

        command.guild.currentBattlecat = battlecat; //TODO: This changes all current battlecats, even in other guilds. Don't know why yet
        command.guild.currentTimeout = setTimeout(() => {
            if (command.guild.currentBattlecat !== null) {
                command.channel.send(`**${command.guild.currentBattlecat.name}** is verdwenen...`);
                command.guild.currentBattlecat = null;
            }
        }, 45000);

        return command.channel.send({embeds: [embed]});
    },
}