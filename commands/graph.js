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
        await db.getAllCount(command.guild.name,(result) => {
            const data = [...result].splice(0, 5).sort((a, b) => a.count > b.count ? 1 : -1).reverse();
            const chart = {
                type: 'bar',
                data: {
                    labels: data.map(x => x.title),
                    datasets: [{
                        label: "",
                        data: data.map(x => x.count),
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                fontSize: 10,
                                fontColor: 'white',
                            },
                            gridLines: {
                                color: 'gray',
                            },
                        }],
                        xAxes: [{
                            ticks: {
                                fontSize: 5,
                                fontColor: 'white',
                            },
                            gridLines: {
                                color: 'gray',
                            },
                        }],
                    }
                }
            }

            const encodedChart = encodeURIComponent(JSON.stringify(chart));
            const chartUrl = `https://quickchart.io/chart?c=${encodedChart}`;

            const embed = new MessageEmbed();

            embed.setDescription(`Kiek eens eem.`);
            embed.setImage(chartUrl);
            embed.setTimestamp();

            return command.channel.send({embeds: [embed]});
        })
    }
}