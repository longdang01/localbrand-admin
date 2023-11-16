import lazyLoad from '@/utils/loadable';

const HomePage = lazyLoad(
    () => import('./views/Home'),
    (module) => module.default,
);

export { HomePage };
