// FOR FEATURES
const HOME_PATH = '/';

const DASHBOARD_PATH = '/dashboard';

// FOR IMPORT
const PRODUCT_PATH = '/product';
const PRODUCT_DETAIL_PATH = '/product/:path';
const IMPORT_BILL_PATH = "/import-bill";
const IMPORT_BILL_CREATE_PATH = "/import-bill/create";
const IMPORT_BILL_EDIT_PATH = '/import-bill/:invoiceCode';

const CATEGORY_BIG_PATH = "/category-big";
const CATEGORY_SMALL_PATH = "/category-small";
const BRAND_PATH = "/brand";
const SUPPLIER_PATH = "/supplier";
const COLLECTION_PATH = "/collection";

// FOR SELL
const ORDER_PATH = '/order';
const ORDER_CREATE_PATH = "/order/create";
const ORDER_EDIT_PATH = '/order/:ordersCode';

const CUSTOMER_PATH = '/customer';

// FOR SYSTEM
const STAFF_PATH = '/staff';

// FOR MEDIA
const SLIDE_PATH = '/slide';
const LOOKBOOK_PATH = '/lookbook';

// ERRORS
const NOT_FOUND_PATH = "/not-found";
const NOT_AUTHORIZATION_PATH = "/not-authorization";
const SERVER_ERROR_PATH = "/error"

// FOR AUTH
const LOGIN_PATH = "/login";
const FORGOT_PASSWORD_PATH = "/forgot-password";
const RESET_PASSWORD_PATH = "/reset-password/:id/:token";

export { 
    HOME_PATH,
    
    DASHBOARD_PATH,
    PRODUCT_PATH,
    PRODUCT_DETAIL_PATH,

    IMPORT_BILL_PATH,
    IMPORT_BILL_CREATE_PATH,
    IMPORT_BILL_EDIT_PATH,
    CATEGORY_BIG_PATH,
    CATEGORY_SMALL_PATH,
    BRAND_PATH,
    SUPPLIER_PATH,
    COLLECTION_PATH,

    ORDER_PATH,
    ORDER_CREATE_PATH,
    ORDER_EDIT_PATH,
    CUSTOMER_PATH,

    STAFF_PATH,

    SLIDE_PATH,
    LOOKBOOK_PATH,

    LOGIN_PATH,
    FORGOT_PASSWORD_PATH,
    RESET_PASSWORD_PATH,

    NOT_FOUND_PATH,
    NOT_AUTHORIZATION_PATH,
    SERVER_ERROR_PATH
};
