module.exports = {
  help: 'Show user info',
  fn: async ({ Memer, args }) => {
    if (!args[0] && isNaN(args[0])) {
      return 'you need to give an id';
    }
    let id = args[0];
    let amount;
    if (args[1] && Number(args[1])) {
      amount = Number(args[1]);
    } else {
      amount = 1;
    }
    await Memer.db.addPocket(id, amount);
    return `<@${id}> (${id}) was given ${amount} coins.`;
  }
};
