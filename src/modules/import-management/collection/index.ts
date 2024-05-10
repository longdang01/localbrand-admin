import lazyLoad from '@/utils/loadable';

const CollectionPage = lazyLoad(
    () => import('./Collection'),
    (module) => module.default,
);

export { CollectionPage };
