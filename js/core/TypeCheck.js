/**
 * @file TypeCheck.js
 * @description Modulo per la validazione rigorosa dei tipi di dato.
 * @version 0.0.3
 */

/**
 * @function isString
 * @description Verifica se la variabile passata è una stringa.
 * @param {Any} VAR_VAL - Valore da controllare.
 * @return {Boolean} var_b_res - True se stringa.
 */
Objectis.isString = function(VAR_VAL) {
    Objectis.trackCall("isString");
    return (typeof VAR_VAL === "string" || VAR_VAL instanceof String);
};

/**
 * @function isNumber
 * @description Verifica se la variabile è un numero valido (esclude NaN).
 * @param {Any} VAR_VAL - Valore da controllare.
 * @return {Boolean} var_b_res - True se numero finito.
 */
Objectis.isNumber = function(VAR_VAL) {
    Objectis.trackCall("isNumber");
    return (typeof VAR_VAL === "number" && isFinite(VAR_VAL));
};

/**
 * @function isObject
 * @description Verifica se la variabile è un oggetto (e non null).
 * @param {Any} VAR_VAL - Valore da controllare.
 * @return {Boolean} var_b_res - True se oggetto.
 */
Objectis.isObject = function(VAR_VAL) {
    Objectis.trackCall("isObject");
    return (VAR_VAL !== null && typeof VAR_VAL === "object");
};

/**
 * @function isFunction
 * @description Verifica se la variabile è una funzione eseguibile.
 * @param {Any} VAR_VAL - Valore da controllare.
 * @return {Boolean} var_b_res - True se funzione.
 */
Objectis.isFunction = function(VAR_VAL) {
    Objectis.trackCall("isFunction");
    return (typeof VAR_VAL === "function");
};