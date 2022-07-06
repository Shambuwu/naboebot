const {MessageEmbed, Interaction, MessageAttachment} = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
    name: "gwen",
    description: "Posts a random image of Gwen",
    aliases: ["g"],
    utilization: "!gwen",
    showHelp: false,
    slashCommand: true,
    options: [
        {
            name: "query",
            description: "Secret password",
            type: "STRING",
            required: true,
        }
    ],

    async execute(client, command, args) {
        if (args.length === 0) return command.channel.send(`Pincode vereist om deze functionaliteit te gebruiken.`);
        if (args.join("").toLowerCase() === "00283") {
            function getRandomInt(max) {
                return Math.floor(Math.random() * max);
            }

            const images = readdirSync("./assets/commands/gwen/");
            const imageUrl = images[getRandomInt(images.length+1)];
            const image = new MessageAttachment(`./assets/commands/gwen/${imageUrl}`);
            const embed = new MessageEmbed();

            embed.setImage(`attachment://${imageUrl}`);
            embed.setColor("BLURPLE");
            embed.setDescription(`Deze is voor jou, ${command instanceof Interaction ? command.user : command.author}!`);
            embed.setTimestamp();

            return command.channel.send({embeds: [embed], files: [image]});
        }

        return command.channel.send(`Sorry ${command instanceof Interaction ? command.user : command.author}, pincode is verkeerd!`)
    }
}