const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");

module.exports = {
    name: "trade",
    description: "Battlecat trade command, use to trade battlecats with another player",
    aliases: ["tr"],
    utilization: `${client.config.settings.prefix}battlecat trade [Plyr]`,

    async execute(client, message, args) {
        console.log(args[0])
        var embed = new MessageEmbed();
        embed.setColor("BLUE");
        embed.setTitle(`Trade request`);

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("1")
                .setLabel("<<")
                .setStyle("PRIMARY"),

            new MessageButton()
                .setCustomId("2")
                .setLabel("accept")
                .setStyle("PRIMARY"),

            new MessageButton()
                .setCustomId("3")
                .setLabel("decline")
                .setStyle("PRIMARY"),

            new MessageButton()
                .setCustomId("4")
                .setLabel(">>")
                .setStyle("PRIMARY")
        );

        var tradeUI = await message.channel.send({
            embeds: [embed], 
            components: [row]
        });


        const filter = i => i.customId === '1';
        const collector = message.channel.createMessageComponentCollector({ filter });

        collector.on('collect', async i => {
            console.log("button clicked");
            var newEmbed = new MessageEmbed();
            newEmbed.setColor("BLUE");
            newEmbed.setTitle(`testing`)
            tradeUI.edit({
                embeds: [newEmbed], 
                components: [row]
            })
        });
    }
}