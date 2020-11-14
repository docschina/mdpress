import Layout from './Layout';

export default ({ routes }) => {
  routes.unshift({
    name: 'docs',
    path: '/docs/:path',
    component: Layout
  });
};
