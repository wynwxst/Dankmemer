module.exports = {
  help: 'change bot status',
  fn: async ({ Memer, args }) => {
    let categories = {};
    for (const command of Memer.cmds) {
      if (command.props.ownerOnly || command.props.hide) { continue; }
      let category = categories[command.category];
      if (!category) {
        category = categories[command.category] = [];
      }
      category.push({triggers: command.props.triggers, description: command.props.description});
    }
    Memer.http.post(`${Memer.config.links.website}/api/cmds`)
      .set('Authorization', Memer.secrets.memerServices.endpoints)
      .send({ 'commands': categories })
      .end();
    return `Commands were pushed to \`/api/cmds\``;
  }
};
