const GenericCommand = require('../../models/GenericCommand');
const reaction = [
  '<:feelsYUCKman:419485966340849684>',
  '<:feelsautisticman:397488382500143104>',
  '<:reee:397488383963955211>',
  '<:feelsbadman:397488381648699403>',
  '<a:monkas:429416313450921986>',
  '<:feelscringeman:397488381011165194>',
  '<:feelsdabman:397489529319194653>',
  '<:feelsLMAOman:429416311387586561>',
  '<:feelsgreatman:397488378548977671>',
  '<a:feelsSWEATman:429475850740826112>'
];

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    let args = msg.args.args;
    let target = Memer.getRateTarget(msg, args);
    const rating = Memer.randomNumber(1, 100);
    return {
      title: 'dank r8 machine',
      description: `${target} ${rating}% dank ${reaction[Math.ceil(rating / 10) - 1]}`
    };
  },
  {
    triggers: ['dankrate', 'memerate'],
    description: 'See how dank you are'
  }
);
