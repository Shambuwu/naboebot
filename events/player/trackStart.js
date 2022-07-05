module.exports = (player, queue, track) => {
    queue.metadata.send(`Bro, ik ga deze lijpe track draaien: **${track.title}** in **${queue.connection.channel.name}**.`);
}