module.exports = () => {
    console.log("Client ready!");

    let time = 0;

    setInterval(async () => {
        time += 1; // Add one minute to the above defined variable
        await client.user.setPresence({
            activities: [{
                name: `!help, uptime: ${time}m`,
            }]
        })
    }, 60000);

    // client.user.setActivity("!help, !h, /help");
}