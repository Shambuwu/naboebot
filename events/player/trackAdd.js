module.exports = (player, queue, track) => {
    queue.metadata.send(`Added ${track.title} to the queue.`);
}