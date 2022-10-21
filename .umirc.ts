import { defineConfig } from 'umi';

export default defineConfig({
  layout: { title: 'demo' },
  routes: [
    {
      path: '/',
      name: '基础演示',
      component: 'index',
    },
    {
      path: '/playground',
      name: '综合演示',
      component: 'components/playground',
    },
    {
      path: '/query',
      name: '查询演示',
      component: 'components/query',
    },
    {
      path: '/falling-word-game',
      name: '性能演示',
      component: 'components/falling-word-game',
    },
  ],
  fastRefresh: true,
  mfsu: {},
});
