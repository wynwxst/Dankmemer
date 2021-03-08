module.exports = {
  help: 'Show user info',
  fn: async ({ Memer, args }) => {
    if (!args[0] && isNaN(args[0])) {
      return 'you need to give an id';
    }
    let id = args[0];
    await Memer.db.createBlock(id, 'user');
    await Memer.db.removeUser(id);
    return 'User blacklisted and removed from database.';
  }
};
