import lazyLoad from '@/utils/loadable';

const ImportBillPage = lazyLoad(
    () => import('./ImportBill'),
    (module) => module.default,
);

const ImportBillCreatePage = lazyLoad(
    () => import('./ImportBillCreate'),
    (module) => module.default,
);

const ImportBillEditPage = lazyLoad(
    () => import('./ImportBillEdit'),
    (module) => module.default,
);

export { ImportBillPage, ImportBillCreatePage, ImportBillEditPage };
