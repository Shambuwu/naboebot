const {MessageEmbed} = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "joke",
    description: "Posts a random joke",
    aliases: ["j"],
    utilization: `${client.config.settings.prefix}joke`,
    slashCommand: true,

    async execute(client, command){
        let embed = new MessageEmbed();

        await axios.get("https://moppenbot.nl/api/random/", {
            headers: {
                "nsfw": true,
            }
        })
            .then((response) => response.data)
            .then((data) => {
                embed.setDescription(data.joke.joke);
            });

        embed.setThumbnail("https://www.pngmart.com/files/12/Laughing-Emoji-PNG-Photo.png")
        embed.setColor("BLURPLE");
        embed.setTimestamp();
        return command.channel.send({embeds: [embed]});
    }

}