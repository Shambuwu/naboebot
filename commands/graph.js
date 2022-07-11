const {MessageEmbed} = require("discord.js");
module.exports = {
    name: "graph",
    description: "Shows graph for given query",
    aliases: ["g"],
    utilization: `${client.config.settings.prefix}graph [graph type]`,
    slashCommand: true,
    // options: [
    //     {
    //         name: "query",
    //         description: "What type of data you would like to graph",
    //         type: "STRING",
    //         required: false,
    //     }
    // ],

    async execute(client, command) {
        await db.getAllCount(command.guild.name,(result) => {
            const data = [...result].splice(0, 5).sort((a, b) => a.count > b.count ? 1 : -1).reverse();
            const chart = {
                type: "bar",
                data: {
                    labels: data.map(x => x.title),
                    datasets: [{
                        label: "",
                        data: data.map(x => x.count),
                        backgroundColor: [
                            `rgba(255, 99, 132, 0.2)`,
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 205, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                        ],
                        borderColor: [
                            "rgb(255, 99, 132)",
                            "rgb(255, 159, 64)",
                            "rgb(255, 205, 86)",
                            "rgb(75, 192, 192)",
                            "rgb(54, 162, 235)",
                        ],
                        borderWidth: 1.5,
                        barThickness: 50,
                    }],
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                precision: 0,
                                beginAtZero: true,
                                fontSize: 10,
                                fontColor: "white",
                            },
                            gridLines: {
                                color: "gray",
                            },
                        }],
                        xAxes: [{
                            ticks: {
                                precision: 0,
                                fontSize: 5,
                                fontColor: "white",
                            },
                            gridLines: {
                                color: "gray",
                            },
                        }],
                    }
                }
            }

            const encodedChart = encodeURIComponent(JSON.stringify(chart));
            const chartUrl = `https://quickchart.io/chart?c=${encodedChart}`;

            const embed = new MessageEmbed();

            embed.setDescription(`Top 5 meest gespeelde nummers in ${command.guild.name}`);
            embed.setImage(chartUrl);
            embed.setTimestamp();

            return command.channel.send({embeds: [embed]});
        })
    }
}