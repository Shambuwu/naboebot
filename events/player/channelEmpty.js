module.exports = (player, queue) => {
    queue.connection.disconnect();
    queue.metadata.send(`Waar is iedereen?? :pleading_face:`);
}