const {MessageEmbed} = require("discord.js");
const axios = require("axios");
const battlecat = {
    name: "",
    thumbnail: "",
    stats: {
        lvl: 1,
        hp: 5 + getRandomInt(10),
        atk: 1 + getRandomInt(10),
        def: 1 + getRandomInt(5),
        spd: 5 + getRandomInt(3),
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
                battlecat.name = `${data.results[0].name.title} ${data.results[0].name.first}`;
                embed.setTitle(`**${battlecat.name}** is verschenen!`);
            });

        embed.setColor("GREEN");
        embed.setDescription(`Gebruik **!battlecat claim** *{naam}* om deze kat te vangen!`);
        embed.setFooter({text: `(Deze functionaliteit is nog work in progress)`});
        embed.setTimestamp();

        client.battlecats.current = battlecat;
        setTimeout(() => {
            if (client.battlecats.current !== null) {
                command.channel.send(`**${battlecat.name}** is verdwenen...`);
                client.battlecats.current = null;
            }
        }, 30000);

        return command.channel.send({embeds: [embed]});
    },
}