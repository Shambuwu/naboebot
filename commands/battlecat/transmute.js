const {MessageEmbed} = require("discord.js");
const axios = require("axios");
const bcFunctions = require("../../src/bc-functions.js");


module.exports = {
    name: "transmute",
    description: "Battlecat transmute command, transmute three Battlecats into another Battlecat of a higher rarity",
    aliases: ["t"],
    utilization: `${client.config.settings.prefix}battlecat transmute [naam 1, naam 2, naam 3]`,
    slashCommand: true,

    async execute(client, message, args) {
        if (args.length === 0) return message.reply(`Geef de namen van drie Battlecats van dezelfde rarity om deze te transmuteren, ${message.author}...\nVoorbeeld syntax: \`!battlecat transmute john, charles, claudia\``);

        const bcNames = args.map((name, index, array) => {
            if (name[name.length - 1] === ",") return name.replace(",", "");
            if (array[index + 1] === undefined) return name.replace(",", "");
            let test = `${name} ${array[index + 1].replace(",", "")}`;
            array.splice(index + 1, 1);
            return test;
        }).filter(x => x !== null);

        if (bcNames.length < 3) return message.reply(`Je hebt drie Battlecats nodig om transmutatie uit te voeren, ${message.author}...\nVoorbeeld syntax: \`!battlecat transmute john, charles, claudia\``);

        let requests = bcNames.map((name) => {
            return new Promise((resolve) => {
                db.getBattlecatByName(name, message.author.id, message.guild.id).then(r => {
                    if(r.length === 0) return message.reply(`Je bent niet in bezit van **${bcFunctions.capitalizeFirstLetter(name)}**`)
                    resolve(r)
                });
            })
        })

        Promise.all(requests).then(async result => {
            result = result[0]
            if (!result.every(cat => JSON.parse(cat.stats).rarity === JSON.parse(result[0].stats).rarity)) return message.reply(`Deze katten zijn niet van dezelfde rarity!`);


            console.log(result[0])
            let rarity;
            switch(JSON.parse(result[0].stats).rarity.toLowerCase()) {
                case "common":
                    rarity = client.battlecats.rarities.uncommon;
                    break;
                case "uncommon":
                    rarity = client.battlecats.rarities.rare;
                    break;
                case "rare":
                    rarity = client.battlecats.rarities.super_rare;
                    break;
                case "super Rare":
                    rarity = client.battlecats.rarities.legendary;
                    break;
                case "legendary":
                    rarity = client.battlecats.rarities.mythic;
                    break;
            }

            const battlecat = await bcFunctions.getRandomBattlecat(rarity);
            const embed = new MessageEmbed();

            embed.setTitle(`Jouw Battlecats zijn getransmuteerd tot **${battlecat.name}** (${rarity.name.toLowerCase()})!`);
            embed.setColor(rarity.color);
            embed.addFields(Object.keys(battlecat.stats).map(stat => ({name: stat.toUpperCase(), value: battlecat.stats[stat].toString(), inline: true})));
            embed.setDescription(`${battlecat.name} is toegevoegd aan jouw verzameling!`);
            embed.setImage(battlecat.thumbnail);
            embed.setFooter({text: `(Deze functionaliteit is nog work in progress)`});
            embed.setTimestamp();

            for (const name of bcNames) {
                await db.removeBattlecatByName(name, message.author.id, message.guild.id);
            }

            await db.insertBattlecat(battlecat.name.toLowerCase(), battlecat.thumbnail, JSON.stringify(battlecat.stats), message.author.id, message.guild.id);

            message.reply({embeds: [embed]})
        });
    }
}