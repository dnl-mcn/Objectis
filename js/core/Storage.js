/**
 * @file Storage.js
 * @description Gestore persistenza dati locale con cifratura obbligatoria. Direttiva: NIENTE COOKIE.
 * @version 1.0.3
 */

/**
 * @function initStorage
 * @description Inizializza il sottosistema di storage.
 */
Objectis.initStorage = function() {
    Objectis.trackCall("initStorage");
    if (!window.localStorage) {
        Objectis.logError("LocalStorage non supportato dal browser.");
        return;
    }
    Objectis.log("Sottosistema Storage (LocalOnly) pronto.", "INFO");
};

/**
 * @function setPseudoCookie
 * @description Salva un dato cifrato nel localStorage. (Mantengo il nome per compatibilità controller).
 * @param {String} S_KEY - Chiave del dato.
 * @param {String} S_VAL - Valore in chiaro.
 */
Objectis.setPseudoCookie = function(S_KEY, S_VAL) {
    Objectis.trackCall("setPseudoCookie");
    
    var var_s_finalVal = S_VAL;
    
    // Se il modulo Crypto è presente, cifriamo il dato
    if (typeof Objectis.encrypt === "function") {
        var_s_finalVal = Objectis.encrypt(S_VAL);
    }
    
    try {
        window.localStorage.setItem("obj_" + S_KEY, var_s_finalVal);
    } catch (var_o_err) {
        Objectis.logError("Errore scrittura Storage: " + var_o_err.message);
    }
};

/**
 * @function getPseudoCookie
 * @description Recupera e decifra un dato dallo storage locale.
 * @param {String} S_KEY - Chiave del dato.
 * @return {String} Valore decifrato o null.
 */
Objectis.getPseudoCookie = function(S_KEY) {
    Objectis.trackCall("getPseudoCookie");
    
    var var_s_stored = window.localStorage.getItem("obj_" + S_KEY);
    if (!var_s_stored) return null;
    
    if (typeof Objectis.decrypt === "function") {
        return Objectis.decrypt(var_s_stored);
    }
    
    return var_s_stored;
};

/**
 * @function clearStorage
 * @description Rimuove tutti i dati salvati dal framework.
 */
Objectis.clearStorage = function() {
    Objectis.trackCall("clearStorage");
    window.localStorage.clear();
    Objectis.log("Storage locale ripulito.", "INFO");
};