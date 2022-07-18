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
                .setCustomId("left")
                .setLabel("<<")
                .setStyle("PRIMARY"),

            new MessageButton()
                .setCustomId("accept")
                .setLabel("accept")
                .setStyle("PRIMARY"),

            new MessageButton()
                .setCustomId("decline")
                .setLabel("decline")
                .setStyle("PRIMARY"),

            new MessageButton()
                .setCustomId("right")
                .setLabel(">>")
                .setStyle("PRIMARY")
        );

        var tradeUI = await message.channel.send({
            embeds: [embed], 
            components: [row]
        });


        const filter = i => true;
        const collector = message.channel.createMessageComponentCollector({ filter });

        collector.on('collect', async i => {
            console.log("button clicked");
            i.deferUpdate();

            var newEmbed = embed;

            if (i.customId === 'right') {
                newEmbed.setTitle(`right`);

                tradeUI.edit({
                    embeds: [newEmbed], 
                    components: [row]
                });
            }

            if (i.customId === 'left') {
                newEmbed.setTitle(`left`);

                tradeUI.edit({
                    embeds: [newEmbed], 
                    components: [row]
                });
            }

            if (i.customId === 'accept'){
                newEmbed.setTitle(`accept`);

                tradeUI.edit({
                    embeds: [newEmbed], 
                    components: [row]
                });
            }

            if (i.customId === 'decline'){
                newEmbed.setTitle(`decline`);

                tradeUI.edit({
                    embeds: [newEmbed], 
                    components: [row]
                });
            }
        });
    }
}