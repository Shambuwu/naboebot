module.exports = () => {
    console.log("Client ready!");

    let launch_time = Date.now();
    let time = 0;

    setInterval(async () => {
        time += 1;
        await client.user.setPresence({
            activities: [{
                name: `${client.config.settings.prefix}help, nu met 100% meer containers!`,
                type: "PLAYING",
            }]
        })
    }, 60000);
}