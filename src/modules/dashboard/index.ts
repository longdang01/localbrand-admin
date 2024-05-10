import lazyLoad from '@/utils/loadable';

const DashboardPage = lazyLoad(
    () => import('./Dashboard'),
    (module) => module.default,
);

export { DashboardPage };
