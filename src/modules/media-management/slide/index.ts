import lazyLoad from '@/utils/loadable';

const SlidePage = lazyLoad(
    () => import('./Slide'),
    (module) => module.default,
);

export { SlidePage };
