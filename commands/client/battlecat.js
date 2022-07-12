const {MessageEmbed} = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "battlecat",
    description: "Main battlecat command",
    aliases: ["bc"],
    utilization: `${client.config.settings.prefix}battlecat [battlecat command]`,
    slashCommand: true,

    execute(client, command, args) {
        return command.channel.send(`Deze functionaliteit is nog niet klaar.`);
    },

    async spawncat(client, command) {
        const embed = new MessageEmbed();
        const battlecat = {
            name: "",
            lvl: 0,
            hp: 0,
            atk: 0,
            def: 0,
            spd: 0,
            thumbnail: "",
        }

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
        return command.channel.send({embeds: [embed]});
    },

    async battle() {

    }
}