module.exports = {
  title: 'Hello MdPress',
  description: '# Hello, MdPress!',
  dest: 'mdpress',
  base: 'mdpress',
  patterns: ['**/*.md', '**/*.js', '!**/deploy.*'],
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
  ]
};
