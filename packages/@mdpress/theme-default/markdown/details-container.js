export default {
  type: 'details',
  before: info => `<details class="custom-block details">${info ? `<summary>${info}</summary>` : ''}\n`,
  after: () => '</details>\n'
};