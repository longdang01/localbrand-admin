import lazyLoad from '@/utils/loadable';

const CategoryBigPage = lazyLoad(
    () => import('./CategoryBig'),
    (module) => module.default,
);

export { CategoryBigPage };
