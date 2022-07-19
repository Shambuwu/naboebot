const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const bcFunctions = require("../../src/bc-functions");

module.exports = {
    name: "battle",
    description: "Battlecat battle command, use to battle with another player",
    aliases: ["btl"],
    utilization: `${client.config.settings.prefix}battlecat battle`,

    async execute(client, message, args) {
        // getting info on challenging player
        const playerChallenging = message.author

        // getting info on challenged player
        const playerchallenged = message.mentions.users.first();
        if (!playerchallenged){ return message.reply("sorry, maar die persoon ken ik niet")}
        if (playerchallenged === playerChallenging) {return message.reply("je kunt niet met jezelf vechten, nerd.")}

        // getting list of cats from both players
        const playerChallengingCats = await db.getAllBattlecatsByUser(playerChallenging.id, message.guild.id)
        if(!playerChallengingCats[0]) { return message.reply('sorry, maar jij hebt geen poejes')}
        const playerchallengedCats = await db.getAllBattlecatsByUser(playerchallenged.id, message.guild.id)
        if(!playerchallengedCats[0]) { return message.reply('sorry, maar deze persoon heeft geen poejes')}
        
        // initialising initial starter values for the battle request
        let challengingIndex = 0
        let challengedIndex = 0
        let challengingAccepted = false
        let challengedAccepted = false

        // intial battle values
        let isBattleing = false
        let offensivePlayer = playerChallenging
        let defensivePlayer = playerchallenged
        let turn = "OFFENSIVE"
        let atk = 0
        let def = 0
        let spd = 0

        // title embed
        const titleEmbed = new MessageEmbed();
        titleEmbed.setColor("BLURPLE");
        titleEmbed.setTitle(`${playerChallenging.username} wilt een kattengevecht houden`);

        // information embed
        const infoEmbed = new MessageEmbed();
        infoEmbed.setColor("GREEN")
        infoEmbed.setTitle(`waiting for user input`)


        // defining the cats that will be fought
        let challengingCat = playerChallengingCats[challengingIndex]
        let challengedCat = playerchallengedCats[challengedIndex]

        // initialising cat choosing buttons
        const choosingButtonContainer = new MessageActionRow().addComponents(
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

        const offensiveButtonContainer = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`FIGHT`)
                .setLabel("fight")
                .setStyle("PRIMARY"),
        );

        const defensiveButtonContainer = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`DODGE`)
                .setLabel("dodge")
                .setStyle("PRIMARY"),

            new MessageButton()
                .setCustomId(`BLOCK`)
                .setLabel("block")
                .setStyle("PRIMARY"),
        );

        //function to create challenging player embed
        function getChallengingEmbed(){
            const challengingEmbed = new MessageEmbed();
            challengingCat = playerChallengingCats[challengingIndex]
            const challengingstats = JSON.parse(challengingCat.stats)

            if (isBattleing){challengingEmbed.setTitle(`${playerChallenging.username}'s ${bcFunctions.capitalizeFirstLetter(challengingCat.name)}`)}
            else{ challengingEmbed.setTitle(`${playerChallenging.username} kiest ${bcFunctions.capitalizeFirstLetter(challengingCat.name)}`);}
            
            challengingEmbed.addFields(Object.keys(challengingstats).map(stat => ({name: stat.toUpperCase(), value: challengingstats[stat].toString(), inline: true})));
            challengingEmbed.setThumbnail(challengingCat.thumbnail);

            if (challengingAccepted) { challengingEmbed.setColor("GREEN")}
            else {challengingEmbed.setColor("BLURPLE");}

            return challengingEmbed
        }

        //function to create challenged player embed
        function getChallengedEmbed(){
            const challengedEmbed = new MessageEmbed();
            challengedCat = playerchallengedCats[challengedIndex]
            const challengedstats = JSON.parse(challengedCat.stats)

            if (isBattleing){ challengedEmbed.setTitle(`${playerchallenged.username}'s ${bcFunctions.capitalizeFirstLetter(challengedCat.name)}`)}
            else{ challengedEmbed.setTitle(`${playerchallenged.username} kiest ${bcFunctions.capitalizeFirstLetter(challengedCat.name)}`)}
            
            challengedEmbed.addFields(Object.keys(challengedstats).map(stat => ({name: stat.toUpperCase(), value: challengedstats[stat].toString(), inline: true})));
            challengedEmbed.setThumbnail(challengedCat.thumbnail);

            if (challengedAccepted) { challengedEmbed.setColor("GREEN")}
            else {challengedEmbed.setColor("BLURPLE");}

            return challengedEmbed
        }

        function toggleOffencivePlayer(){
            if(offensivePlayer === playerChallenging){
                offensivePlayer = playerchallenged
                defensivePlayer = playerChallenging
            }else{
                offensivePlayer = playerChallenging
                defensivePlayer = playerchallenged
            }
        }

        function toggleTurn(){
            if(turn === 'OFFENSIVE'){
                turn = 'DEFENSIVE'
                titleEmbed.setTitle(`wachten op ${defensivePlayer.username}'s beurt`)
            }else{
                turn = 'OFFENSIVE'
                toggleOffencivePlayer()
                titleEmbed.setTitle(`wachten op ${offensivePlayer.username}'s beurt`)
                
            }
        }

        function rand_int(min, max) {
            return Math.floor(Math.random() * (max - min) ) + min;
        }

        function setAtk(){
            if(offensivePlayer === playerChallenging){
                const stats = JSON.parse(challengingCat.stats)
                atk = rand_int(1, stats.atk)
            }else{
                const stats = JSON.parse(challengedCat.stats)
                atk = rand_int(1, stats.atk)
            }
        }

        function setSpd(){
            if(defensivePlayer === playerChallenging){
                const stats = JSON.parse(challengingCat.stats)
                spd = rand_int(1, stats.spd)
            }else{
                const stats = JSON.parse(challengedCat.stats)
                spd = rand_int(1, stats.spd)
            }
        }

        function setDef(){
            if(defensivePlayer === playerChallenging){
                const stats = JSON.parse(challengingCat.stats)
                def = rand_int(1, stats.def)
            }else{
                const stats = JSON.parse(challengedCat.stats)
                def = rand_int(1, stats.def)
            }
        }

        function hit(hitpoints){
                let stats = JSON.parse(getDefensiveCat().stats)
                stats.hp -= hitpoints
                getDefensiveCat().stats = JSON.stringify(stats)
        }

        function getDefensiveCat(){
            if(playerChallenging === defensivePlayer){
                return challengingCat
            }else{
                return challengedCat
            }
        }

        function getOffenciveCat(){
            if(playerChallenging === offensivePlayer){
                return challengingCat
            }else{
                return challengedCat
            }
        }

        function checkEndGame(){
            const defensiveHP = JSON.parse(getDefensiveCat().stats).hp
            const offensiveHP = JSON.parse(getOffenciveCat().stats).hp

            if(offensiveHP <= 0){
                titleEmbed.setTitle(`${defensivePlayer.username}'s kat heeft gewonnen`)
                BattleUI.edit({embeds: [titleEmbed, infoEmbed ,getChallengingEmbed(), getChallengedEmbed()],
                               components: []});
            }
            if(defensiveHP <= 0){
                titleEmbed.setTitle(`${offensivePlayer.username}'s kat heeft gewonnen`)
                BattleUI.edit({embeds: [titleEmbed, infoEmbed ,getChallengingEmbed(), getChallengedEmbed()],
                               components: []});
            }
        }

        function startBattle(){
            isBattleing = true

            const challengingSPD = JSON.parse(challengingCat.stats).spd
            const challengedSPD = JSON.parse(challengedCat.stats).spd

            if (challengedSPD > challengingSPD ){
                offensivePlayer = playerchallenged
                defensivePlayer = playerChallenging
            }

            titleEmbed.setTitle(`wachten op ${offensivePlayer.username}'s beurt`)
            BattleUI.edit({embeds: [titleEmbed, infoEmbed, getChallengingEmbed(), getChallengedEmbed()],
                           components: [offensiveButtonContainer]});
            
        }

        // sending challenge offer ui to server
        const BattleUI = await message.channel.send({
            embeds: [titleEmbed, getChallengingEmbed(), getChallengedEmbed()], 
            components: [choosingButtonContainer]
        });

        // filtering the users so only the challengers trigger the buttons
        const filter = i => ((i.user === playerchallenged) || (i.user === playerChallenging));
        
        // setup up collector to listen to the buttons in battleUI
        const collector = BattleUI.createMessageComponentCollector({ filter });

        // listening to buttons being pressed
        collector.on('collect', async i => {

            if (isBattleing){
                if (turn === 'OFFENSIVE' && i.user === offensivePlayer){
                    if (i.customId === 'FIGHT' ){
                        setAtk()
                        
                        infoEmbed.setTitle(`${getOffenciveCat().name} heeft voor [${atk}] geslagen`)
                        infoEmbed.setColor('GREEN')

                        toggleTurn()
                        await BattleUI.edit({embeds: [titleEmbed, infoEmbed ,getChallengingEmbed(), getChallengedEmbed()],
                            components: [defensiveButtonContainer]});
                    }
                }

                if (turn === 'DEFENSIVE' && i.user === defensivePlayer){
                    if (i.customId === 'DODGE'){
                        setSpd()
                        
                        if (spd > atk){
                            infoEmbed.setTitle(`${getDefensiveCat().name} heeft de slag met [${atk}] punten ontweken met [${spd}] punten `)
                            infoEmbed.setColor("BLUE")
                        }else{
                            infoEmbed.setTitle(`${getDefensiveCat().name} kon niet ontwijken met [${spd}] punten, en is geraakt voor [${atk}] punten`)
                            infoEmbed.setColor("RED")
                            hit(atk)
                        }


                        toggleTurn()
                        await BattleUI.edit({embeds: [titleEmbed, infoEmbed ,getChallengingEmbed(), getChallengedEmbed()],
                            components: [offensiveButtonContainer]});
                        
                    }
    
                    if (i.customId === 'BLOCK' && i.user === defensivePlayer){
                        console.log("block")
                        setDef()
                        
                        if (def >= atk){
                            infoEmbed.setTitle(`${getDefensiveCat().name} heeft de slag van [${atk}] punten geblockeert met [${def}] punten. de kat word geraakt met [1] punten`)
                            infoEmbed.setColor('RED')
                            hit(1)
                            
                        } else{
                            infoEmbed.setTitle(`${getDefensiveCat().name} heeft de slag van [${atk}] punten geblockeert met [${def}] punten. de kat word geraakt met [${atk - def}] punten`)
                            infoEmbed.setColor('RED')
                            hit(atk - def)
                        }

                        toggleTurn()
                        await BattleUI.edit({embeds: [titleEmbed, infoEmbed ,getChallengingEmbed(), getChallengedEmbed()],
                            components: [offensiveButtonContainer]});
                    }
                }
                checkEndGame()
                i.deferUpdate()

            }
            else{
                //player pressed right
                if (i.customId === `RIGHT`) {
                    challengedAccepted = false
                    challengingAccepted = false

                    if (i.user === playerChallenging){
                        challengingIndex += 1 
                        if (challengingIndex >= playerChallengingCats.length){
                            challengingIndex = 0
                    }
                    }
                    if (i.user === playerchallenged){
                        challengedIndex += 1 
                        if (challengedIndex >= playerchallengedCats.length){
                            challengedIndex = 0
                        }
                    }
                }

                // player pressed left
                if (i.customId === `LEFT`) {
                    challengedAccepted = false
                    challengingAccepted = false

                    if (i.user === playerChallenging){
                        challengingIndex -= 1 
                        if (challengingIndex < 0 ){
                            challengingIndex = playerChallengingCats.length - 1
                        }
                    }
                    if (i.user === playerchallenged){
                        challengedIndex -= 1 
                        if (challengedIndex < 0){
                            challengedIndex = playerchallengedCats.length - 1
                        }
                    }
                }

                // player pressed accept
                if (i.customId === `ACCEPT`){
                    
                    if (i.user === playerChallenging){
                        challengingAccepted = true
                    }

                    if (i.user === playerchallenged){
                        challengedAccepted = true
                    }

                    if (challengingAccepted && challengedAccepted){
                        startBattle()
                    }
                }

                // player pressed decline 
                if (i.customId === `DECLINE`){
                    await BattleUI.delete()
                    return await message.channel.send("het aanbod is afgewezen")
                }
                
                await BattleUI.edit({embeds: [titleEmbed, getChallengingEmbed(), getChallengedEmbed()]});
                await i.deferUpdate();
            }
        });
    }
}