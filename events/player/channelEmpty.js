module.exports = (player, queue) => {
    queue.metadata.send("Leaving voice channel due to inactivity.");
}