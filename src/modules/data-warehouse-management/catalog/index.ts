import lazyLoad from '@/utils/loadable';

const DataCatalogPage = lazyLoad(
    () => import('./views/DataCatalog'),
    (module) => module.default,
);

export { DataCatalogPage };
