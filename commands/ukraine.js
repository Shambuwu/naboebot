const {MessageEmbed, Message, Interaction} = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "ukraine",
    description: "Posts an article of the current Ukraine war",
    aliases: [],
    utilization: `${client.config.settings.prefix}ukraine`,
    slashCommand: true,

    async execute(client, command) {
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }

        const embed = new MessageEmbed();

        await axios.request(client.config.apis.rapidapi.ukraine)
            .then((response) => response.data)
            .then((data) => {
                const article = [...data][getRandomInt([...data].length)];
                embed.setTitle(article.title);
                embed.setDescription(`${article.url}`);
            })
            .catch((error) => {
                console.error(error);
                return command.channel.send(`Er is iets fout gegaan...`);
            });

        embed.setColor("BLURPLE");
        embed.setTimestamp();
        return command.channel.send({embeds: [embed]});
    }
}