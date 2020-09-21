export default {
  type: 'slot',
  before: info => `<div class="markdown-slot" id="${info}">`,
  after: '</div>'
};