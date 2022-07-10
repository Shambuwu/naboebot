const {MessageEmbed} = require("discord.js");
module.exports = {
    name: "graph",
    description: "Shows graph for given query",
    aliases: ["g"],
    utilization: `${client.config.settings.prefix}graph [graph type]`,
    slashCommand: true,
    options: [
        {
            name: "query",
            description: "What type of data you would like to graph",
            type: "STRING",
            required: true,
        }
    ],

    async execute(client, command) {
        const chart = {
            type: 'bar',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Retweets',
                    data: [12, 5, 40, 5]
                }, {
                    label: 'Likes',
                    data: [80, 42, 215, 30]
                }],
                backgroundColor: "white",

            }
        }

        const encodedChart = encodeURIComponent(JSON.stringify(chart));
        const chartUrl = `https://quickchart.io/chart?c=${encodedChart}`;

        const embed = new MessageEmbed();

        embed.setDescription(`Kiek eens eem.`);
        embed.setImage(chartUrl);
        embed.setTimestamp();

        return command.channel.send({embeds: [embed]});
    }
}