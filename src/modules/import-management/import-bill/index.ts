import lazyLoad from '@/utils/loadable';

const ImportBillPage = lazyLoad(
    () => import('./ImportBill'),
    (module) => module.default,
);

export { ImportBillPage };
