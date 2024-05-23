import lazyLoad from '@/utils/loadable';

const LookbookPage = lazyLoad(
    () => import('./Lookbook'),
    (module) => module.default,
);

export { LookbookPage };
