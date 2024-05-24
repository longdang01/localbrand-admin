import lazyLoad from '@/utils/loadable';

const CustomerPage = lazyLoad(
    () => import('./Customer'),
    (module) => module.default,
);

export { CustomerPage };
