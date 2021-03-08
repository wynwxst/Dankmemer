module.exports = {
  help: 'msg time vs sys time.',
  fn: async ({ Memer, msg }) => {
    let message = new Date(msg.timestamp).toTimeString()
    let now = new Date(Date.now())
    let system = now.toTimeString()
    return `Message Time: ${message}\nSystem Time: ${system}`
  }
}
