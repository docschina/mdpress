export default {
  type: 'upgrade',
  before: info => `<UpgradePath title="${info}">`,
  after: '</UpgradePath>'
};