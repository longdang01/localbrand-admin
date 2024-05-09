import lazyLoad from '@/utils/loadable';

const DataWarehousePage = lazyLoad(
    () => import('./views/DataWarehouse'),
    (module) => module.default,
);

export { DataWarehousePage };
