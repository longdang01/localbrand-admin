import lazyLoad from '@/utils/loadable';

const StaffPage = lazyLoad(
    () => import('./Staff'),
    (module) => module.default,
);

export { StaffPage };
