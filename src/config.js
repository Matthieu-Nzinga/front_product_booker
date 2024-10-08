//export const API_URL = 'https://product-booker.onrender.com/api/'

export const API_URL = 'http://37.60.224.77/api/';
export const LOGIN = API_URL + 'user/login'
export const RESET_PASSWORD = API_URL + 'user/resetPassword'
export const PRODUCTS = API_URL + 'products'
export const POST_PRODUCTS = API_URL + 'products'
export const GET_CATEGORIES = PRODUCTS + '/categories'
export const USERS = API_URL + 'user'
export const POST_USERS = API_URL + 'user'
export const POST_COMMANDS = API_URL + 'commande'
export const GET_COMMANDS = API_URL + 'commande'
export const PUT_COMMANDS = API_URL + 'commande/'
export const HIDE_PRODUCT = PRODUCTS + '/delete-produit/'
export const SHOW_PRODUCT = PRODUCTS + '/activate-produit/'
export const PUT_PRODUCT = API_URL + 'produit/'
export const UPDATE_COMMAND = POST_COMMANDS + '/update-commande/'
export const POST_SONDAGE = API_URL + 'sondage'
export const GET_SONDAGE = API_URL + 'sondage'
export const SHOW_POPUP_SONDAGE = GET_SONDAGE + '/pop-up/activer/'
export const HIDE_POPUP_SONDAGE = GET_SONDAGE + '/pop-up/desactiver/'
export const POST_REPONSE = POST_SONDAGE + '/reponse'
export const PRODUCT_SALE = PRODUCTS + '/en-solde/'
export const PRODUCT_UNSALE = PRODUCTS + '/unset-solde/'
export const SHOW_AND_HIDE_SONDAGE = GET_SONDAGE + '/statut/'
