exports.handle = function (error, id) {
  if (error && error.message) {
    this.log(`Shard ${id} disconnected (${error.message})`);
  } else {
    this.log(`Shard ${id} disconnected`);
  }
};
