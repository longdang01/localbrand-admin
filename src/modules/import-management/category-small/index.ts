import lazyLoad from '@/utils/loadable';

const CategorySmallPage = lazyLoad(
    () => import('./CategorySmall'),
    (module) => module.default,
);

export { CategorySmallPage };
