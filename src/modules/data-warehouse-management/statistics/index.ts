import lazyLoad from '@/utils/loadable';

const DataStatisticsPage = lazyLoad(
    () => import('./views/DataStatistics'),
    (module) => module.default,
);

export { DataStatisticsPage };
