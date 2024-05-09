// FOR FEATURES
const HOME_PATH = '/';
const DATA_CATALOG_PATH = '/data-catalog';
const DATA_WAREHOUSE_PATH = '/data-warehouse';
const DATA_STATISTICS_PATH = '/data-statistics';

// ERRORS
const NOT_FOUND_PATH = "/not-found";
const NOT_AUTHORIZATION_PATH = "/not-authorization";
const SERVER_ERROR_PATH = "/error"

// FOR AUTH
const LOGIN_PATH = "/login";
const FORGOT_PASSWORD_PATH = "/forgot-password";
const RESET_PASSWORD_PATH = "/reset-password/:username/:token";

export { 
    HOME_PATH,
    DATA_CATALOG_PATH,
    DATA_WAREHOUSE_PATH,
    DATA_STATISTICS_PATH,

    LOGIN_PATH,
    FORGOT_PASSWORD_PATH,
    RESET_PASSWORD_PATH,

    NOT_FOUND_PATH,
    NOT_AUTHORIZATION_PATH,
    SERVER_ERROR_PATH
};
