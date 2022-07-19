const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const bcFunctions = require("../../src/bc-functions");

module.exports = {
    name: "trade",
    description: "Battlecat trade command, use to trade battlecats with another player",
    aliases: ["tr"],
    utilization: `${client.config.settings.prefix}battlecat trade`,

    async execute(client, message, args) {
        // getting info on offering trader
        const playerOffering = message.author

        // getting info on offered trader
        const playerOffered = message.mentions.users.first();
        if (!playerOffered){ return message.reply("sorry, maar die persoon ken ik niet")}
        if (playerOffered === playerOffering) {return message.reply("je wilt katten met jezelf ruilen? daar ga ik mijn kostbare energie niet in stoppen")}

        // getting list of cats from both players
        const playerOfferingCats = await db.getAllBattlecatsByUser(playerOffering.id, message.guild.id)
        if(!playerOfferingCats[0]) { return message.reply('sorry maar jij hebt geen poejes')}
        const playerOfferedCats = await db.getAllBattlecatsByUser(playerOffered.id, message.guild.id)
        if(!playerOfferedCats[0]) { return message.reply('sorry maar deze persoon heeft geen poejes')}
        
        // initialising initial starter values for the offers
        let offeringIndex = 0
        let offeredIndex = 0
        let offeringAccepted = false
        let offeredAccepted = false

        // title embed
        const titleEmbed = tileEmbed = new MessageEmbed();
        tileEmbed.setColor("BLURPLE");
        tileEmbed.setTitle(`${playerOffering.username} wilt katjes met je ruilen`);

        // defining offers
        let offeringCat = playerOfferingCats[offeringIndex]
        let offeredCat = playerOfferedCats[offeredIndex]

        // initialising trade ui buttons
        const buttonsContainer = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`LEFT`)
                .setLabel("<<")
                .setStyle("PRIMARY"),

            new MessageButton()
                .setCustomId(`ACCEPT`)
                .setLabel("accept")
                .setStyle("PRIMARY"),

            new MessageButton()
                .setCustomId(`DECLINE`)
                .setLabel("decline")
                .setStyle("PRIMARY"),

            new MessageButton()
                .setCustomId(`RIGHT`)
                .setLabel(">>")
                .setStyle("PRIMARY")
        );

        //function to create offering player embed
        function getOfferingEmbed(){
            const offeringEmbed = new MessageEmbed();
            offeringCat = playerOfferingCats[offeringIndex]
            const offeringstats = JSON.parse(offeringCat.stats)
            offeringEmbed.setTitle(`**${playerOffering.username}** is offering ${bcFunctions.capitalizeFirstLetter(offeringCat.name)} `);
            offeringEmbed.addFields(Object.keys(offeringstats).map(stat => ({name: stat.toUpperCase(), value: offeringstats[stat].toString(), inline: true})));
            offeringEmbed.setThumbnail(offeringCat.thumbnail);

            if (offeringAccepted) { offeringEmbed.setColor("GREEN")}
            else {offeringEmbed.setColor("BLURPLE");}

            return offeringEmbed
        }

        //function to create offered player embed
        function getOfferedEmbed(){
            const offeredEmbed = new MessageEmbed();
            offeredCat = playerOfferedCats[offeredIndex]
            const offeredstats = JSON.parse(offeredCat.stats)
            offeredEmbed.setTitle(`**${playerOffered.username}** is offering ${bcFunctions.capitalizeFirstLetter(offeredCat.name)} `);
            offeredEmbed.addFields(Object.keys(offeredstats).map(stat => ({name: stat.toUpperCase(), value: offeredstats[stat].toString(), inline: true})));
            offeredEmbed.setThumbnail(offeredCat.thumbnail);

            if (offeredAccepted) { offeredEmbed.setColor("GREEN")}
            else {offeredEmbed.setColor("BLURPLE");}

            return offeredEmbed
        }

        // sending trade ui to server
        const tradeUI = await message.channel.send({
            embeds: [titleEmbed, getOfferingEmbed(), getOfferedEmbed()], 
            components: [buttonsContainer]
        });

        // filtering the users so only the traders trigger the buttons
        let filter = i => ((i.user === playerOffered) || (i.user === playerOffering));
        
        // setup up collector to listen to the buttons
        const collector = tradeUI.createMessageComponentCollector({ filter });

        // listening to buttons being pressed
        collector.on('collect', async i => {
            
            //player pressed right
            if (i.customId === `RIGHT`) {
                offeredAccepted = false
                offeringAccepted = false

                if (i.user === playerOffering){
                    offeringIndex += 1 
                    if (offeringIndex >= playerOfferingCats.length){
                        offeringIndex = 0
                   }
                }
                if (i.user === playerOffered){
                    offeredIndex += 1 
                    if (offeredIndex >= playerOfferedCats.length){
                        offeredIndex = 0
                    }
                }
            }

            // player pressed left
            if (i.customId === `LEFT`) {
                offeredAccepted = false
                offeringAccepted = false

                if (i.user === playerOffering){
                    offeringIndex -= 1 
                    if (offeringIndex < 0 ){
                        offeringIndex = playerOfferingCats.length - 1
                    }
                }
                if (i.user === playerOffered){
                     offeredIndex -= 1 
                     if (offeredIndex < 0){
                         offeredIndex = playerOfferedCats.length - 1
                     }
                }
            }

            // player pressed accept
            if (i.customId === `ACCEPT`){
                
                if (i.user === playerOffering){
                    offeringAccepted = true
                }

                if (i.user === playerOffered){
                    offeredAccepted = true
                }

                if (offeringAccepted === true && offeredAccepted === true){
                    await tradeUI.delete()
                    db.setBattlecatOwner(offeringCat.id, playerOffered.id)
                    db.setBattlecatOwner(offeredCat.id, playerOffering.id)

                    const confimationEmbed = new MessageEmbed()
                    confimationEmbed.setTitle(`${playerOffering.username}'s ${offeringCat.name} is geruild voor ${playerOffered.username}'s ${offeredCat.name}`)

                    return await message.channel.send({embeds: [confimationEmbed]})
                }
            }

            // player pressed decline 
            if (i.customId === `DECLINE`){
                await tradeUI.delete()
                return await message.channel.send("het aanbod is afgewezen")
            }
            
            await tradeUI.edit({embeds: [titleEmbed, getOfferingEmbed(), getOfferedEmbed()]});
            await i.deferUpdate();
        });
    }
}