const {MessageEmbed} = require("discord.js");

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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

        if (bcNames.length < 3) return message.reply(`Je hebt drie katten nodig om transmutatie uit te voeren, ${message.author}...\nVoorbeeld syntax: \`!battlecat transmute john, charles, claudia\``);

        const gupte = new Promise((resolve, reject) => {
            const data = [];
            bcNames.forEach(name => db.getBattlecatByName(name, message.author.id, message.guild.id).then(r => {
                data.push(r);
            }))
        })

        gupte.then(r => console.log(r));
    }
}