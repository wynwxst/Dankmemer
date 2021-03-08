exports.handle = function (error) {
  this.stats.err++;
  this.log(error.stack, 'error');
};
