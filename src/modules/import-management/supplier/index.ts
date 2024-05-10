import lazyLoad from '@/utils/loadable';

const SupplierPage = lazyLoad(
    () => import('./Supplier'),
    (module) => module.default,
);

export { SupplierPage };
