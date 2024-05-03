// FOR FEATURES
const HOME_PATH = '/';

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

    LOGIN_PATH,
    FORGOT_PASSWORD_PATH,
    RESET_PASSWORD_PATH,

    NOT_FOUND_PATH,
    NOT_AUTHORIZATION_PATH,
    SERVER_ERROR_PATH
};
