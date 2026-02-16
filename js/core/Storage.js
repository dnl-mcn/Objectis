/**
 * @file Storage.js
 * @description Gestione dello Pseudo-Cookie nel DOM (HTML 4.01 Strict).
 */

Objectis.const_S_STORAGE_ID = "pseudo-cookie";

/**
 * @function initStorage
 * @description Crea l'oggetto contenitore se non esiste.
 */
Objectis.initStorage = function() {
    Objectis.trackCall("initStorage");
    if (!document.getElementById(Objectis.const_S_STORAGE_ID)) {
        var var_o_obj = document.createElement("object");
        var_o_obj.id = Objectis.const_S_STORAGE_ID;
        var_o_obj.style.display = "none"; // Invisibile ma presente nel DOM
        document.body.appendChild(var_o_obj);
    }
};

/**
 * @function setPseudoCookie
 * @description Crea o aggiorna un parametro nel registro.
 */
Objectis.setPseudoCookie = function(S_NAME, S_VALUE) {
    Objectis.trackCall("setPseudoCookie");
    Objectis.initStorage();
    var var_o_registry = document.getElementById(Objectis.const_S_STORAGE_ID);
    var var_a_params = var_o_registry.getElementsByTagName("param");
    var var_o_target = null;

    // Cerca se esiste già
    for (var var_n_i = 0; var_n_i < var_a_params.length; var_n_i++) {
        if (var_a_params[var_n_i].name === S_NAME) {
            var_o_target = var_a_params[var_n_i];
            break;
        }
    }

    if (var_o_target) {
        var_o_target.value = S_VALUE;
    } else {
        // Crea nuovo parametro (Standard Strict)
        var var_o_param = document.createElement("param");
        var_o_param.name = S_NAME;
        var_o_param.value = S_VALUE;
        var_o_registry.appendChild(var_o_param);
    }

    // Dopo il salvataggio, notifica il cambiamento (Reattività)
    Objectis.bindAll(); 
};

/**
 * @function getPseudoCookie
 * @description Recupera un valore dal registro.
 */
Objectis.getPseudoCookie = function(S_NAME, S_DEFAULT) {
    Objectis.trackCall("getPseudoCookie");
    var var_o_registry = document.getElementById(Objectis.const_S_STORAGE_ID);
    if (!var_o_registry) return S_DEFAULT;

    var var_a_params = var_o_registry.getElementsByTagName("param");
    for (var var_n_i = 0; var_n_i < var_a_params.length; var_n_i++) {
        if (var_a_params[var_n_i].name === S_NAME) {
            return var_a_params[var_n_i].value;
        }
    }
    return S_DEFAULT;
};