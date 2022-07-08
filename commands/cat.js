const {MessageEmbed, Message, Interaction} = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "cat",
    description: "Posts a random image of a cat",
    aliases: [],
    utilization: `${client.config.settings.prefix}cat`,
    slashCommand: true,

    async execute(client, command) {
        let embed = new MessageEmbed();

        await axios.get("https://api.thecatapi.com/v1/images/search")
            .then((response) => response.data)
            .then((data) => {
                embed.setImage(data[0].url);
            });

        embed.setColor("BLURPLE");
        embed.setDescription(`Deze is voor jou, ${command instanceof Interaction ? command.user : command.author}!`);
        embed.setTimestamp();
        return command.channel.send({embeds: [embed]});
    }
}